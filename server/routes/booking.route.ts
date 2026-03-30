import { Router } from "express";
import { createBooking } from "../services/booking.service";

const router = Router();

// Đặt vé
router.post("/", async (req, res) => {
  const { userId, showtimeId, seatIds } = req.body;

  try {
    const booking = await createBooking(userId, showtimeId, seatIds);
    res.status(201).json(booking);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

export default router;