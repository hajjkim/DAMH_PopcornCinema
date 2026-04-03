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

type CreateBookingInput = {
  userId: string;
  showtimeId: string;
  seats: string[];
  snacks?: { snackId: string; qty: number }[];
  promotionCode?: string;
  ticketTotal: number;
  snackTotal?: number;
  finalTotal: number;
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

  const invalidSeats = data.seats.filter(
    (seat) => !showtime.seatLayout.includes(seat)
  );
  if (invalidSeats.length > 0) {
    throw new Error(`Invalid seats: ${invalidSeats.join(", ")}`);
  }

  const now = new Date();
  const holds = await SeatHold.find({
    showtimeId: data.showtimeId,
    userId: { $ne: data.userId }, // bỏ qua hold của chính user đang thanh toán
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
    showtimeId: data.showtimeId,
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
    const discountText = promo.discount.trim();
    if (discountText.endsWith("%")) {
      const pct = Number(discountText.replace("%", "")) || 0;
      discountAmount = Math.floor(((ticketTotal + snackTotal) * pct) / 100);
    } else {
      discountAmount = Number(discountText) || 0;
    }
  }

  const computedFinal = Math.max(ticketTotal + snackTotal - discountAmount, 0);
  const paymentExpiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

  const [booking] = await Booking.create(
    [
      {
        userId: data.userId,
        showtimeId: data.showtimeId,
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

  const payment = await createPaymentTransaction(
    {
      userId: data.userId,
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
  return Booking.find({ userId }).sort({ createdAt: -1 }).lean();
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
