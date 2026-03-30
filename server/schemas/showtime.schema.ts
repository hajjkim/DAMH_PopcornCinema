import { Schema, model } from "mongoose";

const showtimeSchema = new Schema(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    auditoriumId: {
      type: Schema.Types.ObjectId,
      ref: "Auditorium",
      required: true,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    basePrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["OPEN", "CLOSED", "CANCELLED"],
      default: "OPEN",
    },
  },
  { timestamps: true }
);

export const Showtime = model("Showtime", showtimeSchema);