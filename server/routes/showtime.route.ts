import { Router } from "express";
import {
    getAllShowtimes,
    getShowtimeById,
    createShowtime,
    updateShowtime,
    deleteShowtime,
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

router.post("/", async (req, res) => {
    try {
        const showtime = await createShowtime(req.body);
        res.status(201).json(showtime);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(400).json({ message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const showtime = await updateShowtime(req.params.id, req.body);
        res.status(200).json(showtime);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(400).json({ message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await deleteShowtime(req.params.id);
        res.status(200).json({ message: "Showtime deleted successfully" });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(404).json({ message });
    }
});

export default router;