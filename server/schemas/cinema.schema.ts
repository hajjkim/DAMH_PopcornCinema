import { Schema, model } from "mongoose";

const cinemaSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    totalRooms: { type: Number, default: 0 },
    phone: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

export const Cinema = model("Cinema", cinemaSchema);