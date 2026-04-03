import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
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
    const seatHold = await createSeatHold(req.auth!.userId, showtimeId, seats);
    res.status(201).json(seatHold);
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
