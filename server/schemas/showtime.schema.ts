
import mongoose, { Document, Schema } from "mongoose";

export interface IShowtime {
  movieId: string;
  cinema: string;
  date: string;
  time: string;
  seatLayout: string[];
}
export interface IShowtimeDocument extends IShowtime, Document {}

const showtimeSchema = new Schema<IShowtimeDocument>({
  movieId: { type: String, required: true },
  cinema: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  seatLayout: { type: [String], required: true },
}, { timestamps: true });

export const Showtime = mongoose.models.Showtime || mongoose.model<IShowtimeDocument>("Showtime", showtimeSchema);