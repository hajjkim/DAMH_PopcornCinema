import mongoose from "mongoose";
import { Payment } from "../schemas/payment.schema";
import { PaymentTransaction } from "../schemas/payment-transaction.schema";

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
  return await Payment.find()
    .populate("userId")
    .populate("bookingId")
    .populate("paymentTransactionId")
    .sort({ createdAt: -1 });
};

export const getPaymentById = async (id: string) => {
  const payment = await Payment.findById(id)
    .populate("userId")
    .populate("bookingId")
    .populate("paymentTransactionId");

  if (!payment) throw new Error("Payment not found");
  return payment;
};

export const getPaymentsByUserId = async (userId: string) => {
  return await Payment.find({ userId })
    .populate("bookingId")
    .populate("paymentTransactionId")
    .sort({ createdAt: -1 });
};

export const createPayment = async (data: {
  paymentTransactionId: string;
  userId: string;
  bookingId?: string;
  method: string;
  amount: number;
  status?: string;
  transactionId?: string;
}) => {
  const payment = await Payment.create(data);
  return payment;
};

export const updatePayment = async (id: string, data: any) => {
  const payment = await Payment.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!payment) throw new Error("Payment not found");
  return payment;
};

export const processRefund = async (id: string, reason: string) => {
  const payment = await Payment.findById(id);
  if (!payment) throw new Error("Payment not found");

  if (payment.status !== "SUCCESSFUL") {
    throw new Error("Can only refund successful payments");
  }

  const refundedPayment = await Payment.findByIdAndUpdate(
    id,
    {
      status: "REFUNDED",
      failureReason: reason,
    },
    { new: true }
  );

  return refundedPayment;
};

export const getPaymentStats = async () => {
  const stats = await Payment.aggregate([
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
  return await Payment.find({ userId })
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
