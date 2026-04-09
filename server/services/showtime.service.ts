import { Showtime } from "../schemas/showtime.schema";
import { SeatHold } from "../schemas/seat-hold.schema";
import { Booking } from "../schemas/booking.schema";
import { Seat } from "../schemas/seat.schema";

export const getAllShowtimes = async () => {
  // Return all showtimes sorted by startTime in descending order (newest first)
  const showtimes = await Showtime.find()
    .populate("movieId", "title poster")
    .populate({
      path: "auditoriumId",
      select: "name cinemaId",
      populate: {
        path: "cinemaId",
        select: "name",
      },
    })
    .sort({ startTime: -1 });

  // Filter out showtimes whose referenced movie was deleted (dangling ref)
  return showtimes.filter((s) => s.movieId != null);
};

export const getShowtimeById = async (id: string) => {
  const showtime = await Showtime.findById(id)
    .populate("movieId", "title")
    .populate({
      path: "auditoriumId",
      select: "name cinemaId",
      populate: {
        path: "cinemaId",
        select: "name",
      },
    });

  if (!showtime) {
    throw new Error("Showtime not found");
  }

  return showtime;
};

export const createShowtime = async (data: any) => {
  const showtime = new Showtime({
    movieId: data.movieId,
    auditoriumId: data.auditoriumId,
    startTime: data.startTime,
    endTime: data.endTime,
    basePrice: data.basePrice || 0,
    status: data.status || "OPEN",
  });

  await showtime.save();

  return await showtime.populate([
    { path: "movieId", select: "title" },
    {
      path: "auditoriumId",
      select: "name cinemaId",
      populate: { path: "cinemaId", select: "name" },
    },
  ]);
};

export const updateShowtime = async (id: string, data: any) => {
  const updateData: any = {};

  if (data.movieId) updateData.movieId = data.movieId;
  if (data.auditoriumId) updateData.auditoriumId = data.auditoriumId;
  if (data.startTime) updateData.startTime = data.startTime;
  if (data.endTime) updateData.endTime = data.endTime;
  if (typeof data.basePrice === "number") updateData.basePrice = data.basePrice;
  if (data.status) updateData.status = data.status;

  const showtime = await Showtime.findByIdAndUpdate(id, updateData, {
    new: true,
  })
    .populate("movieId", "title")
    .populate({
      path: "auditoriumId",
      select: "name cinemaId",
      populate: { path: "cinemaId", select: "name" },
    });

  if (!showtime) {
    throw new Error("Showtime not found");
  }

  return showtime;
};

export const deleteShowtime = async (id: string) => {
  const showtime = await Showtime.findByIdAndDelete(id);

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

  // Fetch all seats for this auditorium
  const allAuditoriumSeats = await Seat.find({ 
    auditoriumId: showtime.auditoriumId,
    status: "ACTIVE"
  }).lean();

  const allSeatIds = allAuditoriumSeats.map((s) => s._id.toString());

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
    allSeats: allSeatIds,
    heldSeats,
    bookedSeats,
  };
};
