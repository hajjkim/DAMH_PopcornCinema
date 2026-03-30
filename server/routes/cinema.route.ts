import { Router } from "express";
import {
    getAllCinemas,
    getCinemaById,
    createCinema,
    updateCinema,
    deleteCinema,
} from "../services/cinema.service";

const router = Router();

router.get("/", async (_req, res) => {
    try {
        const cinemas = await getAllCinemas();
        res.status(200).json(cinemas);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const cinema = await getCinemaById(req.params.id);
        res.status(200).json(cinema);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(404).json({ message });
    }
});

router.post("/", async (req, res) => {
    try {
        const cinema = await createCinema(req.body);
        res.status(201).json(cinema);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(400).json({ message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const cinema = await updateCinema(req.params.id, req.body);
        res.status(200).json(cinema);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(400).json({ message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await deleteCinema(req.params.id);
        res.status(200).json({ message: "Cinema deleted successfully" });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(404).json({ message });
    }
});

export default router;