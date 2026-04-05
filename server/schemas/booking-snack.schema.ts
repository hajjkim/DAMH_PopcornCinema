import { Schema, model } from "mongoose";

const bookingSnackSchema = new Schema(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    snackId: {
      type: Schema.Types.ObjectId,
      ref: "Snack",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

// Create unique index for booking and snack combination
bookingSnackSchema.index({ bookingId: 1, snackId: 1 }, { unique: true });

export const BookingSnack = model("BookingSnack", bookingSnackSchema);
