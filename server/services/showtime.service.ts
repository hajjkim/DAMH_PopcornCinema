import { Showtime } from "../schemas/showtime.schema";
import { SeatHold } from "../schemas/seat-hold.schema";
import { Booking } from "../schemas/booking.schema";

export const getAllShowtimes = async () => {
  // Chỉ trả về các suất chưa quá thời gian chiếu
  const now = new Date();
  const today = now.toLocaleDateString("en-CA"); // YYYY-MM-DD

  // Lọc cơ bản theo ngày
  const candidates = await Showtime.find({ date: { $gte: today } })
    .sort({ date: 1, time: 1 })
    .lean();

  // Loại các suất cùng ngày nhưng đã qua giờ chiếu
  const filtered = candidates.filter((st) => {
    if (st.date > today) return true;
    // st.date === today
    const [h, m] = String(st.time || "").split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return true; // giữ lại nếu format lạ
    const showDate = new Date(now);
    showDate.setHours(h, m, 0, 0);
    return showDate.getTime() > now.getTime();
  });

  return filtered;
};

export const getShowtimeById = async (id: string) => {
  const showtime = await Showtime.findById(id).lean();

  if (!showtime) {
    throw new Error("Showtime not found");
  }

  return showtime;
};

export const getShowtimeSeatStatus = async (showtimeId: string) => {
  const showtime = await Showtime.findById(showtimeId).lean();

  if (!showtime) {
    throw new Error("Showtime not found");
  }

  const now = new Date();

  const activeHolds = await SeatHold.find({
    showtimeId,
    expiresAt: { $gt: now },
  }).lean();

  const confirmedBookings = await Booking.find({
    showtimeId,
    status: { $in: ["pending_payment", "pending_confirmation", "confirmed"] },
  }).lean();

  const heldSeats = activeHolds.flatMap((hold) => hold.seats || []);
  const bookedSeats = confirmedBookings.flatMap((booking) => booking.seats || []);

  return {
    allSeats: showtime.seatLayout || [],
    heldSeats,
    bookedSeats,
  };
};
