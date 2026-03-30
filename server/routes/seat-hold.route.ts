import { Router } from "express";
import { holdSeat } from "../services/seat-hold.service";

const router = Router();

// Giữ ghế trong vòng 5 phút
router.post("/", async (req, res) => {
  const { showtimeId, seatId, userId } = req.body;

  try {
    const seatHold = await holdSeat(showtimeId, seatId, userId);
    res.status(201).json(seatHold);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

export default router;