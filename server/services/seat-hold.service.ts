import { SeatHold } from "../schemas/seat-hold.schema";
import { Showtime } from "../schemas/showtime.schema";
import { Booking } from "../schemas/booking.schema";

export const createSeatHold = async (
  userId: string,
  showtimeId: string,
  seats: string[],
  holdMinutes = 5
) => {
  if (!showtimeId || !Array.isArray(seats) || seats.length === 0) {
    throw new Error("showtimeId and seats are required");
  }

  const showtime = await Showtime.findById(showtimeId).lean();
  if (!showtime) {
    throw new Error("Showtime not found");
  }

  const invalidSeats = seats.filter((seat) => !showtime.seatLayout.includes(seat));
  if (invalidSeats.length > 0) {
    throw new Error(`Invalid seats: ${invalidSeats.join(", ")}`);
  }

  const now = new Date();
  // purge expired holds so they don't block fresh selections
  await SeatHold.deleteMany({ expiresAt: { $lt: now } });

  // remove any previous active holds of this user for the same showtime to avoid self-conflict
  await SeatHold.deleteMany({ userId, showtimeId });

  const activeHolds = await SeatHold.find({
    showtimeId,
    expiresAt: { $gt: now },
  }).lean();

  const heldSeats = activeHolds.flatMap((hold) => hold.seats || []);

  const booked = await Booking.find({
    showtimeId,
    status: { $in: ["pending_payment", "pending_confirmation", "confirmed"] },
  }).lean();

  const bookedSeats = booked.flatMap((b) => b.seats || []);

  const conflictedSeats = seats.filter(
    (seat) => heldSeats.includes(seat) || bookedSeats.includes(seat)
  );

  if (conflictedSeats.length > 0) {
    throw new Error(`Seats already held/booked: ${conflictedSeats.join(", ")}`);
  }

  const expiresAt = new Date(Date.now() + holdMinutes * 60 * 1000);

  const seatHold = await SeatHold.create({
    showtimeId,
    userId,
    seats,
    expiresAt,
  });

  return seatHold;
};

export const releaseSeatHold = async (id: string) => {
  // Idempotent delete to avoid noisy errors on double-cleanup from FE/React StrictMode
  await SeatHold.findByIdAndDelete(id);
  return { id, status: "released" };
};

export const releaseExpiredHolds = async () => {
  await SeatHold.deleteMany({ expiresAt: { $lt: new Date() } });
};

export const getActiveSeatHoldForUser = async (
  userId: string,
  showtimeId?: string
) => {
  const now = new Date();
  const filter: any = { userId, expiresAt: { $gt: now } };
  if (showtimeId) {
    filter.showtimeId = showtimeId;
  }

  const hold = await SeatHold.findOne(filter).sort({ createdAt: -1 }).lean();
  return hold;
};
