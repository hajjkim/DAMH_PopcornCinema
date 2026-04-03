
import mongoose, { Document, Schema } from "mongoose";

export interface ISeatHold {
  showtimeId: string;
  userId: string;
  seats: string[];
  expiresAt: Date;
}
export interface ISeatHoldDocument extends ISeatHold, Document {}

const seatHoldSchema = new Schema<ISeatHoldDocument>({
  showtimeId: { type: String, required: true },
  userId: { type: String, required: true },
  seats: { type: [String], required: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

// Auto-remove expired holds to free seats after TTL (5 minutes by default on creation)
seatHoldSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const SeatHold = mongoose.models.SeatHold || mongoose.model<ISeatHoldDocument>("SeatHold", seatHoldSchema);
