import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import {
    getAllAuditoriums,
    getAuditoriumById,
    createAuditorium,
    updateAuditorium,
    deleteAuditorium,
} from "../services/auditorium.service";

const router = Router();

// Public routes
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

// Admin routes
router.post("/", authenticate, authorize("ADMIN"), async (req, res) => {
    try {
        const auditorium = await createAuditorium(req.body);
        res.status(201).json(auditorium);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(400).json({ message });
    }
});

router.put("/:id", authenticate, authorize("ADMIN"), async (req, res) => {
    try {
        const auditorium = await updateAuditorium(String(req.params.id), req.body);
        res.status(200).json(auditorium);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(400).json({ message });
    }
});

router.delete("/:id", authenticate, authorize("ADMIN"), async (req, res) => {
    try {
        await deleteAuditorium(String(req.params.id));
        res.status(200).json({ message: "Auditorium deleted successfully" });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(404).json({ message });
    }
});

export default router;