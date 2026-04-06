import mongoose from "mongoose";
import { Payment } from "../schemas/payment.schema";
import { PaymentTransaction } from "../schemas/payment-transaction.schema";
import { Booking } from "../schemas/booking.schema";

type CreatePaymentTxInput = {
  user: string;
  showtimeId: string;
  bookingId?: string;
  amount: number;
  expiresAt: Date;
  qrContent?: string;
  qrImageUrl?: string;
};

const generateOrderCode = () =>
  `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export const getAllPayments = async () => {
  return await PaymentTransaction.find()
    .populate("userId")
    .populate("bookingId")
    .populate("showtimeId")
    .sort({ createdAt: -1 });
};

export const getPaymentById = async (id: string) => {
  const payment = await PaymentTransaction.findById(id)
    .populate("userId")
    .populate("bookingId")
    .populate("showtimeId");

  if (!payment) throw new Error("Payment not found");
  return payment;
};

export const getPaymentsByUserId = async (userId: string) => {
  return await PaymentTransaction.find({ userId })
    .populate("bookingId")
    .populate("showtimeId")
    .sort({ createdAt: -1 });
};

export const createPayment = async (data: {
  bookingId?: string;
  orderCode: string;
  amount: number;
  status?: string;
}) => {
  let userId: string | undefined;
  let showtimeId: string | undefined;

  if (data.bookingId) {
    const booking = await Booking.findById(data.bookingId).lean();
    if (booking) {
      userId = String(booking.user);
      showtimeId = String(booking.showtime);
    }
  }

  if (!userId || !showtimeId) {
    throw new Error("Could not resolve userId/showtimeId from booking");
  }

  const payment = await PaymentTransaction.create({
    orderCode: data.orderCode,
    userId,
    showtimeId,
    bookingId: data.bookingId || null,
    amount: data.amount,
    status: data.status || "PENDING",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
  return payment;
};

export const updatePayment = async (id: string, data: any) => {
  const payment = await PaymentTransaction.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!payment) throw new Error("Payment not found");
  return payment;
};

export const processRefund = async (id: string, reason: string) => {
  const payment = await PaymentTransaction.findById(id);
  if (!payment) throw new Error("Payment not found");

  if (payment.status !== "PAID") {
    throw new Error("Can only refund paid payments");
  }

  const refundedPayment = await PaymentTransaction.findByIdAndUpdate(
    id,
    {
      status: "REFUNDED",
    },
    { new: true }
  );

  return refundedPayment;
};

export const getPaymentStats = async () => {
  const stats = await PaymentTransaction.aggregate([
    {
      $group: {
        _id: "$status",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  return stats;
};

export const getUserTransactions = async (userId: string) => {
  return await PaymentTransaction.find({ userId })
    .populate("bookingId")
    .populate("showtimeId")
    .sort({ createdAt: -1 });
};

export const markPaymentAsPaid = async (orderCode: string) => {
  const payment = await PaymentTransaction.findOne({ orderCode });
  if (!payment) {
    throw new Error("Transaction not found");
  }

  if (payment.status === "PAID") {
    return payment;
  }

  const updated = await PaymentTransaction.findByIdAndUpdate(
    payment._id,
    { status: "PAID", paidAt: new Date() },
    { new: true }
  );

  // Update associated booking status to confirmed
  if (payment.bookingId) {
    await Booking.findByIdAndUpdate(
      payment.bookingId,
      { status: "confirmed" },
      { new: true }
    );
  }

  return updated;
};

export const createPaymentTransaction = async (
  payload: CreatePaymentTxInput,
  session?: mongoose.ClientSession
) => {
  const doc = await PaymentTransaction.create(
    [
      {
        orderCode: generateOrderCode(),
        userId: payload.user,
        showtimeId: payload.showtimeId,
        bookingId: payload.bookingId || null,
        amount: payload.amount,
        status: "PENDING",
        qrContent: payload.qrContent || "",
        qrImageUrl: payload.qrImageUrl || "",
        expiresAt: payload.expiresAt,
      },
    ],
    { session }
  );

  return doc[0];
};

export const expirePendingTransactions = async () => {
  const now = new Date();
  await PaymentTransaction.updateMany(
    { status: "PENDING", expiresAt: { $lte: now } },
    { status: "EXPIRED" }
  );
};
