import mongoose from "mongoose";
import { PaymentTransaction } from "../schemas/payment-transaction.schema";
import { Booking } from "../schemas/booking.schema";

type CreatePaymentTxInput = {
  userId: string;
  showtimeId: string;
  bookingId?: string;
  amount: number;
  expiresAt: Date;
  qrContent?: string;
  qrImageUrl?: string;
};

const generateOrderCode = () =>
  `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export const createPaymentTransaction = async (
  payload: CreatePaymentTxInput,
  session?: mongoose.ClientSession
) => {
  const doc = await PaymentTransaction.create(
    [
      {
        orderCode: generateOrderCode(),
        userId: payload.userId,
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

export const getUserTransactions = async (userId: string) => {
  return PaymentTransaction.find({ userId })
    .sort({ createdAt: -1 })
    .lean();
};

export const markPaymentAsPaid = async (orderCode: string) => {
  const session = await mongoose.startSession();
  let updated: any;

  await session.withTransaction(async () => {
    const payment = await PaymentTransaction.findOne({ orderCode }).session(
      session
    );
    if (!payment) {
      throw new Error("Transaction not found");
    }

    if (payment.status === "PAID") {
      updated = payment;
      return;
    }

    await PaymentTransaction.updateOne(
      { _id: payment._id },
      { status: "PAID", paidAt: new Date() }
    ).session(session);

    if (payment.bookingId) {
      await Booking.updateOne(
        { _id: payment.bookingId },
        { status: "confirmed" }
      ).session(session);
    }

    updated = await PaymentTransaction.findById(payment._id).session(session);
  });

  session.endSession();
  return updated;
};

export const expirePendingTransactions = async () => {
  const now = new Date();
  await PaymentTransaction.updateMany(
    { status: "PENDING", expiresAt: { $lte: now } },
    { status: "EXPIRED" }
  );
};
