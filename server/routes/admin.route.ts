import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Protect all admin routes with authentication and admin role
router.use(authenticate);
router.use(authorize("admin"));

// Dashboard stats
router.get("/dashboard", async (req, res) => {
  try {
    res.status(200).json({
      totalBookings: 0,
      totalUsers: 0,
      totalRevenue: 0,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// User management endpoints
router.get("/users", async (req, res) => {
  try {
    res.status(200).json([]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Booking management endpoints
router.get("/bookings", async (req, res) => {
  try {
    res.status(200).json([]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

export default router;
