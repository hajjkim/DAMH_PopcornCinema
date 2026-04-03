
import mongoose, { Document, Schema } from "mongoose";

export interface IBooking {
  userId: string;
  showtimeId: string;
  seats: string[];
  snacks?: { snackId: string; qty: number }[];
  promotionCode?: string;
  ticketTotal: number;
  snackTotal?: number;
  finalTotal: number;
  status: "pending_payment"|"pending_confirmation"|"confirmed"|"failed";
  paymentExpiresAt?: Date;
}
export interface IBookingDocument extends IBooking, Document {}

const bookingSchema = new Schema<IBookingDocument>({
  userId: { type: String, required: true },
  showtimeId: { type: String, required: true },
  seats: { type: [String], required: true },
  snacks: [{ snackId: String, qty: Number }],
  promotionCode: String,
  ticketTotal: { type: Number, required: true },
  snackTotal: { type: Number, default: 0 },
  finalTotal: { type: Number, required: true },
  status: { type: String, enum: ["pending_payment","pending_confirmation","confirmed","failed"], default: "pending_payment" },
  paymentExpiresAt: { type: Date },
}, { timestamps: true });

// Helper index to query expiring payments quickly
bookingSchema.index({ paymentExpiresAt: 1 });
bookingSchema.index({ showtimeId: 1, seats: 1 });

export const Booking = mongoose.models.Booking || mongoose.model<IBookingDocument>("Booking", bookingSchema);
