
import mongoose, { Document, Schema } from "mongoose";

export interface IShowtime {
  movieId: mongoose.Schema.Types.ObjectId;
  auditoriumId: mongoose.Schema.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  basePrice: number;
  status: "OPEN" | "CLOSED";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IShowtimeDocument extends IShowtime, Document {}

const showtimeSchema = new Schema<IShowtimeDocument>(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    auditoriumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auditorium",
      required: true,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    basePrice: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
    },
  },
  { timestamps: true }
);

export const Showtime =
  mongoose.models.Showtime ||
  mongoose.model<IShowtimeDocument>("Showtime", showtimeSchema);
