import mongoose from "mongoose";
import { Booking } from "../schemas/booking.schema";
import { SeatHold } from "../schemas/seat-hold.schema";
import { Showtime } from "../schemas/showtime.schema";
import { Promotion } from "../schemas/promotion.schema";
import {
  createPaymentTransaction,
  expirePendingTransactions,
} from "./payment.service";
import { PaymentTransaction } from "../schemas/payment-transaction.schema";
import { generateOrderCode } from "../utils/generate-code";

type CreateBookingInput = {
  user: string;
  showtimeId: string;
  seats: string[];
  snacks?: { snackId: string; qty: number }[];
  promotionCode?: string;
  ticketTotal: number;
  snackTotal?: number;
  finalTotal: number;
  seatHoldId?: string;
};

/**
 * Generate a unique booking code with retry logic to handle collisions
 */
const generateUniqueBookingCode = async (maxRetries: number = 5): Promise<string> => {
  for (let i = 0; i < maxRetries; i++) {
    const code = generateOrderCode();
    const existing = await Booking.findOne({ bookingCode: code }).lean();
    if (!existing) {
      return code;
    }
  }
  throw new Error(`Failed to generate unique booking code after ${maxRetries} retries`);
};

/**
 * Core logic to create a booking (with optional session).
 */
const runCore = async (
  data: CreateBookingInput,
  session?: mongoose.ClientSession
) => {
  const sessionOrNull = session ?? null;

  const showtime = await Showtime.findById(data.showtimeId)
    .session(sessionOrNull)
    .lean();
  if (!showtime) throw new Error("Showtime not found");

  // Note: Seat validation and conversion from string IDs to ObjectIds is handled in the booking route.
  // By the time we reach here, data.seats contains ObjectIds obtained from the Seat collection.
  // We don't validate seats here since the route already validated and converted them.

  const now = new Date();
  const holds = await SeatHold.find({
    showtimeId: data.showtimeId,
    userId: { $ne: data.user }, // bỏ qua hold của chính user đang thanh toán
    expiresAt: { $gt: now },
    seats: { $in: data.seats },
  })
    .session(sessionOrNull)
    .lean();
  if (holds.length > 0) {
    const seatsHeld = holds.flatMap((h) =>
      h.seats.filter((s: string) => data.seats.includes(s))
    );
    throw new Error(
      `Seats already held: ${Array.from(new Set(seatsHeld)).join(", ")}`
    );
  }

  const existingBookings = await Booking.find({
    showtime: data.showtimeId,
    user: { $ne: data.user }, // Exclude current user's bookings
    status: { $in: ["pending_payment", "pending_confirmation", "confirmed"] },
    seats: { $in: data.seats },
  })
    .session(sessionOrNull)
    .lean();
  if (existingBookings.length > 0) {
    const seatsBooked = existingBookings.flatMap((b) =>
      b.seats.filter((s: string) => data.seats.includes(s))
    );
    throw new Error(
      `Seats already booked: ${Array.from(new Set(seatsBooked)).join(", ")}`
    );
  }

  // Promotion & totals
  let promoCode: string | undefined = undefined;
  let discountAmount = 0;
  const ticketTotal = data.ticketTotal || 0;
  const snackTotal = data.snackTotal || 0;
  if (data.promotionCode) {
    const promo = await Promotion.findOne({
      code: data.promotionCode.trim().toUpperCase(),
    })
      .session(sessionOrNull)
      .lean();
    if (!promo) throw new Error("Invalid promotion code");
    promoCode = promo.code;
    const discountType = promo.discountType || "FIXED_AMOUNT";
    const discountValue = Number(promo.discountValue ?? 0);
    
    if (discountType === "PERCENTAGE") {
      discountAmount = Math.floor(((ticketTotal + snackTotal) * discountValue) / 100);
    } else {
      discountAmount = discountValue;
    }
  }

  const computedFinal = Math.max(ticketTotal + snackTotal - discountAmount, 0);
  const paymentExpiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes
  const bookingCode = await generateUniqueBookingCode();

  const [booking] = await Booking.create(
    [
      {
        user: data.user,
        showtime: data.showtimeId,
        bookingCode,
        seats: data.seats,
        snacks: data.snacks || [],
        promotionCode: promoCode,
        ticketTotal,
        snackTotal,
        finalTotal: computedFinal,
        status: "pending_confirmation",
        paymentExpiresAt,
      },
    ],
    { session: sessionOrNull || undefined }
  );

  await SeatHold.deleteMany(
    { showtimeId: data.showtimeId, seats: { $in: data.seats } },
    { session: sessionOrNull || undefined }
  );

  // Also clean up the specific seat hold by ID if provided
  if (data.seatHoldId) {
    await SeatHold.findByIdAndDelete(data.seatHoldId, {
      session: sessionOrNull || undefined,
    });
  }

  const payment = await createPaymentTransaction(
    {
      user: data.user,
      showtimeId: data.showtimeId,
      bookingId: booking._id.toString(),
      amount: computedFinal,
      expiresAt: paymentExpiresAt,
      qrImageUrl: process.env.PAYMENT_QR_URL || "",
      qrContent:
        process.env.PAYMENT_QR_CONTENT ||
        process.env.PAYMENT_ACCOUNT_NUMBER ||
        "",
    },
    session
  );

  return { booking, payment };
};

const createBookingInternal = async (
  data: CreateBookingInput,
  useTransaction: boolean
) => {
  if (!useTransaction) {
    return runCore(data, undefined);
  }

  const session = await mongoose.startSession();
  try {
    let created: any;
    await session.withTransaction(async () => {
      created = await runCore(data, session);
    });
    return created;
  } finally {
    await session.endSession();
  }
};

// Public entry: try transaction; if Mongo is standalone, fallback gracefully.
export const createBooking = async (data: CreateBookingInput) => {
  try {
    return await createBookingInternal(data, true);
  } catch (err: any) {
    const msg = String(err?.message || "");
    if (
      msg.includes(
        "Transaction numbers are only allowed on a replica set member"
      )
    ) {
      // Fallback without transaction on standalone Mongo (dev)
      return await createBookingInternal(data, false);
    }
    throw err;
  }
};

export const getBookingsByUser = async (userId: string) => {
  return Booking.find({ user: userId }).sort({ createdAt: -1 }).lean();
};

export const updateBookingStatus = async (id: string, status: string) => {
  const booking = await Booking.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
  if (!booking) throw new Error("Booking not found");
  return booking;
};

export const markExpiredBookings = async () => {
  const now = new Date();
  const expired = await Booking.find({
    status: { $in: ["pending_payment", "pending_confirmation"] },
    paymentExpiresAt: { $lte: now },
  }).lean();

  if (expired.length > 0) {
    const ids = expired.map((b) => b._id);
    await Booking.updateMany({ _id: { $in: ids } }, { status: "failed" });
    await PaymentTransaction.updateMany(
      { bookingId: { $in: ids }, status: "PENDING" },
      { status: "EXPIRED" }
    );
  }

  await expirePendingTransactions();
};
