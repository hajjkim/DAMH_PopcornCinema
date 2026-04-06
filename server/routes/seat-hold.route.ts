import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { Showtime } from "../schemas/showtime.schema";
import { Seat } from "../schemas/seat.schema";
import {
  createSeatHold,
  releaseSeatHold,
  getActiveSeatHoldForUser,
} from "../services/seat-hold.service";

const router = Router();

router.use(authenticate);

router.post("/", async (req, res) => {
  try {
    const { showtimeId, seats } = req.body;
    
    // Convert seat identifiers (e.g., "A1") to actual Seat ObjectIds
    const showtime = await Showtime.findById(showtimeId).lean();
    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }

    // Query all seats for this auditorium
    const auditoriumSeats = await Seat.find({ auditoriumId: showtime.auditoriumId }).lean();
    
    // Build a map from "row+number" to seat ObjectId
    const seatMap = new Map<string, string>();
    auditoriumSeats.forEach((seat) => {
      const seatKey = `${seat.seatRow}${seat.seatNumber}`;
      seatMap.set(seatKey, seat._id.toString());
    });

    // Convert input seat identifiers to ObjectIds, tracking original IDs for error messages
    const seatObjectIds: string[] = [];
    const seatIdToOriginal: Record<string, string> = {};
    
    seats.forEach((seatId: string) => {
      const objectId = seatMap.get(seatId);
      if (!objectId) {
        throw new Error(`Invalid seat: ${seatId}`);
      }
      seatObjectIds.push(objectId);
      seatIdToOriginal[objectId] = seatId;
    });

    try {
      const seatHold = await createSeatHold(req.auth!.userId, showtimeId, seatObjectIds);
      res.status(201).json(seatHold);
    } catch (err) {
      // Transform error message to show original seat IDs instead of ObjectIds
      if (err instanceof Error && err.message.includes("Seats already held/booked:")) {
        const objectIds = err.message.replace("Seats already held/booked: ", "").split(", ");
        const originalIds = objectIds
          .map((id: string) => seatIdToOriginal[id] || id)
          .filter(Boolean);
        err.message = `Seats already held/booked: ${originalIds.join(", ")}`;
      }
      throw err;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Get current active hold of logged-in user (optionally filter by showtime)
router.get("/me", async (req, res) => {
  try {
    const showtimeId = req.query.showtimeId as string | undefined;
    const hold = await getActiveSeatHoldForUser(req.auth!.userId, showtimeId);
    res.status(200).json(hold || null);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await releaseSeatHold(req.params.id);
    res.status(200).json({ message: "Released" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

export default router;
