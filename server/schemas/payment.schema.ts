import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
  {
    paymentTransactionId: {
      type: Schema.Types.ObjectId,
      ref: "PaymentTransaction",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
    method: {
      type: String,
      enum: ["CREDIT_CARD", "DEBIT_CARD", "BANK_TRANSFER", "E_WALLET", "CASH"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESSFUL", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    failureReason: {
      type: String,
      default: "",
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

paymentSchema.index({ userId: 1, bookingId: 1 });
paymentSchema.index({ paymentTransactionId: 1 });

export const Payment = model("Payment", paymentSchema);
