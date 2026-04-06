import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import {
  getAllShowtimes,
  getShowtimeById,
  getShowtimeSeatStatus,
  createShowtime,
  updateShowtime,
  deleteShowtime,
} from "../services/showtime.service";

const router = Router();

// Public routes
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

// Admin routes
router.post("/", authenticate, authorize("ADMIN"), async (req, res) => {
  try {
    const showtime = await createShowtime(req.body);
    res.status(201).json(showtime);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

router.put("/:id", authenticate, authorize("ADMIN"), async (req, res) => {
  try {
    const showtime = await updateShowtime(String(req.params.id), req.body);
    res.status(200).json(showtime);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

router.delete("/:id", authenticate, authorize("ADMIN"), async (req, res) => {
  try {
    await deleteShowtime(String(req.params.id));
    res.status(200).json({ message: "Showtime deleted successfully" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

export default router;