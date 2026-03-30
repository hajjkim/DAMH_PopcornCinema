import { Schema, model } from "mongoose";

const auditoriumSchema = new Schema(
  {
    cinemaId: {
      type: Schema.Types.ObjectId,
      ref: "Cinema",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    totalRows: { type: Number, required: true },
    totalColumns: { type: Number, required: true },
    seatCapacity: { type: Number, required: true },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

auditoriumSchema.index({ cinemaId: 1, name: 1 }, { unique: true });

export const Auditorium = model("Auditorium", auditoriumSchema);