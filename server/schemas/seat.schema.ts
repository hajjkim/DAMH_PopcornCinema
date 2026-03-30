import { Schema, model } from "mongoose";

const seatSchema = new Schema(
    {
        auditoriumId: {
        type: Schema.Types.ObjectId,
        ref: "Auditorium",
        required: true,
        },
        seatRow: {
        type: String,
        required: true,
        trim: true,
        },
        seatNumber: {
        type: Number,
        required: true,
        },
        seatType: {
        type: String,
        enum: ["VIP", "COUPLE"],
        required: true,
        default: "VIP",
        },
        extraPrice: {
        type: Number,
        default: 0,
        },
        status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE",
        },
    },
    { timestamps: true }
);

seatSchema.index(
    { auditoriumId: 1, seatRow: 1, seatNumber: 1 },
    { unique: true }
);

export const Seat = model("Seat", seatSchema);