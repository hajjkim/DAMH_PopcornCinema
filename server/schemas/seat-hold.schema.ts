import { Schema, model } from "mongoose";

const seatHoldSchema = new Schema(
  {
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
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Chỉ giữ ghế trong 5 phút, tự động xóa khi hết hạn
seatHoldSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const SeatHold = model("SeatHold", seatHoldSchema);