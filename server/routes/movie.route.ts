import { Router } from "express";
import { upload } from "../middlewares/upload.middleware";
import {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,  
} from "../services/movie.service";

const router = Router();

router.get("/", async (_req, res) => {
    try {
        const movies = await getAllMovies();
        res.status(200).json(movies);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(500).json({ message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const movie = await getMovieById(req.params.id);
        res.status(200).json(movie);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(404).json({ message });
    }
});

router.post("/", async (req, res) => {
    try {
        const movie = await createMovie(req.body);
        res.status(201).json(movie);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(400).json({ message });
    }
});

router.put("/:id", upload.single("poster"), async (req, res) => {
    try {
        const body = { ...req.body };
        if ((req as any).file) {
            body.poster = `http://localhost:5000/uploads/${(req as any).file.filename}`;
        }
        // Parse JSON-stringified array fields sent via FormData
        for (const key of ["genres", "actors"]) {
            if (typeof body[key] === "string") {
                try { body[key] = JSON.parse(body[key]); } catch {}
            }
        }
        const movie = await updateMovie(req.params.id as string, body);
        res.status(200).json(movie);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(400).json({ message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await deleteMovie(req.params.id);
        res.status(200).json({ message: "Movie deleted successfully" });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        res.status(404).json({ message });
    }
});

export default router;