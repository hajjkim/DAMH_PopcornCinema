import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { getAdminStats, getUsersReport, getTopMovies, getRevenueStats, getMoviesReport, getSnacksReport, getPaymentsReport } from "../services/admin.service";

const router = Router();

// Protect all admin routes with authentication and authorization
router.use(authenticate);
router.use(authorize("ADMIN"));

// Get admin stats
router.get("/stats", async (_req, res) => {
  try {
    const stats = await getAdminStats();
    res.status(200).json(stats);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Get top movies
router.get("/top-movies", async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 4;
    const topMovies = await getTopMovies(limit);
    res.status(200).json(topMovies);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Get revenue stats
router.get("/revenue-stats", async (_req, res) => {
  try {
    const revenueStats = await getRevenueStats();
    res.status(200).json(revenueStats);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Get users report
router.get("/users/report", async (req, res) => {
  try {
    const { role, status, limit, skip } = req.query;
    const report = await getUsersReport({
      role: role ? String(role) : undefined,
      status: status ? String(status) : undefined,
      limit: limit ? Number(limit) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
    res.status(200).json(report);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Get movies report
router.get("/movies/report", async (_req, res) => {
  try {
    const report = await getMoviesReport();
    res.status(200).json(report);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Get snacks report
router.get("/snacks/report", async (_req, res) => {
  try {
    const report = await getSnacksReport();
    res.status(200).json(report);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Get payments report
router.get("/payments/report", async (_req, res) => {
  try {
    const report = await getPaymentsReport();
    res.status(200).json(report);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

export default router;
