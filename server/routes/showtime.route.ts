import { Router } from "express";
import {
  getAllShowtimes,
  getShowtimeById,
  getShowtimeSeatStatus,
} from "../services/showtime.service";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const showtimes = await getAllShowtimes();
    res.status(200).json(showtimes);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const showtime = await getShowtimeById(req.params.id);
    res.status(200).json(showtime);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(404).json({ message });
  }
});

router.get("/:id/seats", async (req, res) => {
  try {
    const seatStatus = await getShowtimeSeatStatus(req.params.id);
    res.status(200).json(seatStatus);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(404).json({ message });
  }
});

export default router;