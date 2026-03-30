import { Router } from "express";
import {
    getAllSeats,
    getSeatsByAuditorium,
    getSeatById,
    createSeat,
    updateSeat,
    deleteSeat,
} from "../services/seat.service";

const router = Router();

router.get("/", async (_req, res) => {
    try {
        const seats = await getAllSeats();
        res.status(200).json(seats);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message });
    }
});

router.get("/auditorium/:auditoriumId", async (req, res) => {
    try {
        const seats = await getSeatsByAuditorium(req.params.auditoriumId);
        res.status(200).json(seats);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const seat = await getSeatById(req.params.id);
        res.status(200).json(seat);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(404).json({ message });
    }
});

router.post("/", async (req, res) => {
    try {
        const seat = await createSeat(req.body);
        res.status(201).json(seat);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(400).json({ message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const seat = await updateSeat(req.params.id, req.body);
        res.status(200).json(seat);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(400).json({ message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await deleteSeat(req.params.id);
        res.status(200).json({ message: "Seat deleted successfully" });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(404).json({ message });
    }
});

export default router;