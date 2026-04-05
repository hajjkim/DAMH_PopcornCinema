import { Schema, model } from "mongoose";

const ticketSchema = new Schema(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
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
    seatId: {
      type: Schema.Types.ObjectId,
      ref: "Seat",
      required: true,
    },
    ticketCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    qrCode: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["VALID", "USED", "CANCELLED", "EXPIRED"],
      default: "VALID",
    },
    usedAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

ticketSchema.index({ bookingId: 1 });
ticketSchema.index({ userId: 1, showtimeId: 1 });

export const Ticket = model("Ticket", ticketSchema);
