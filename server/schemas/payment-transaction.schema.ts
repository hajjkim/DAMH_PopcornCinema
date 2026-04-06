import { Schema, model } from "mongoose";

const paymentTransactionSchema = new Schema(
  {
    orderCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    showtimeId: {
      type: Schema.Types.ObjectId,
      ref: "Showtime",
      required: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "EXPIRED", "CANCELLED", "REFUNDED"],
      default: "PENDING",
    },
    qrContent: { type: String, default: "" },
    qrImageUrl: { type: String, default: "" },
    expiresAt: { type: Date, required: true, index: true },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Create index for user and showtime
paymentTransactionSchema.index({ userId: 1, showtimeId: 1 });

export const PaymentTransaction = model(
  "PaymentTransaction",
  paymentTransactionSchema
);
