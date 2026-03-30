import { Booking } from "../schemas/booking.schema";
import { SeatHold } from "../schemas/seat-hold.schema";
import { Seat } from "../schemas/seat.schema";
import { Showtime } from "../schemas/showtime.schema";

// Đặt vé
export const createBooking = async (userId: string, showtimeId: string, seatIds: string[]) => {
  const seats = await Seat.find({ _id: { $in: seatIds } });

  if (seats.length !== seatIds.length) {
    throw new Error("One or more seats are invalid");
  }

  // Tính tổng tiền vé
  const totalPrice = seats.reduce((acc, seat) => acc + seat.extraPrice, 0);
  const booking = new Booking({
    userId,
    showtimeId,
    seats: seats.map((seat) => seat._id),
    totalPrice,
  });

  await booking.save();

  // Giải phóng ghế đã giữ
  await SeatHold.deleteMany({
    seatId: { $in: seatIds },
    expiresAt: { $lt: new Date() },
  });

  return booking;
};