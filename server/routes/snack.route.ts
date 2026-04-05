import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware";
import {
  getAllSnacks,
  getSnackById,
  getSnacksByCategory,
  getActiveSnacks,
  createSnack,
  updateSnack,
  deleteSnack,
  updateSnackQuantity,
  updateSnackStatus,
} from "../services/snack.service";

const router = Router();

// ─── Public routes ────────────────────────────────────────────────────────────

// Get all snacks
router.get("/", async (_req, res) => {
  try {
    const snacks = await getAllSnacks();
    res.status(200).json(snacks);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Get active snacks only
// NOTE: must be registered before /:id
router.get("/active", async (_req, res) => {
  try {
    const snacks = await getActiveSnacks();
    res.status(200).json(snacks);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Get snacks by category
// NOTE: must be registered before /:id
router.get("/category/:category", async (req, res) => {
  try {
    const snacks = await getSnacksByCategory(req.params.category);
    res.status(200).json(snacks);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Get snack by ID
router.get("/:id", async (req, res) => {
  try {
    const snack = await getSnackById(req.params.id);
    res.status(200).json(snack);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(404).json({ message });
  }
});

// ─── Admin routes ─────────────────────────────────────────────────────────────

// Create a snack
router.post("/", authorize("ADMIN"), async (req, res) => {
  try {
    const snack = await createSnack(req.body);
    res.status(201).json(snack);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Update a snack
router.put("/:id", authorize("ADMIN"), async (req, res) => {
  try {
    const snack = await updateSnack(String(req.params.id), req.body);
    res.status(200).json(snack);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Update snack quantity (e.g. inventory adjustment)
router.patch("/:id/quantity", authorize("ADMIN"), async (req, res) => {
  const { quantity } = req.body;
  try {
    const snack = await updateSnackQuantity(String(req.params.id), quantity);
    res.status(200).json(snack);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Toggle snack active/inactive status
router.patch("/:id/status", authorize("ADMIN"), async (req, res) => {
  const { status } = req.body;
  try {
    const snack = await updateSnackStatus(String(req.params.id), status);
    res.status(200).json(snack);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Delete a snack
router.delete("/:id", authorize("ADMIN"), async (req, res) => {
  try {
    await deleteSnack(String(req.params.id));
    res.status(200).json({ message: "Snack deleted successfully" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(404).json({ message });
  }
});

export default router;