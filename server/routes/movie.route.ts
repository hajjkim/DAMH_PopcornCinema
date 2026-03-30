import { Router } from "express";
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

router.put("/:id", async (req, res) => {
    try {
        const movie = await updateMovie(req.params.id, req.body);
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