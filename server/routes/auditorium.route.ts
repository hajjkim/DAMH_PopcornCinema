import { Router } from "express";
import {
    getAllAuditoriums,
    getAuditoriumById,
    createAuditorium,
    updateAuditorium,
    deleteAuditorium,
} from "../services/auditorium.service";

const router = Router();

router.get("/", async (_req, res) => {
    try {
        const auditoriums = await getAllAuditoriums();
        res.status(200).json(auditoriums);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const auditorium = await getAuditoriumById(req.params.id);
        res.status(200).json(auditorium);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(404).json({ message });
    }
});

router.post("/", async (req, res) => {
    try {
        const auditorium = await createAuditorium(req.body);
        res.status(201).json(auditorium);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(400).json({ message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const auditorium = await updateAuditorium(req.params.id, req.body);
        res.status(200).json(auditorium);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(400).json({ message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await deleteAuditorium(req.params.id);
        res.status(200).json({ message: "Auditorium deleted successfully" });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(404).json({ message });
    }
});

export default router;