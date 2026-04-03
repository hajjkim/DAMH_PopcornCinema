import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

// Get saved promotions for authenticated user
router.get("/me", async (req, res) => {
  try {
    res.status(200).json([]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Save a promotion
router.post("/", async (req, res) => {
  try {
    res.status(201).json({ message: "Promotion saved successfully" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Remove saved promotion
router.delete("/:id", async (req, res) => {
  try {
    res.status(200).json({ message: "Promotion removed successfully" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(404).json({ message });
  }
});

export default router;
