import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import {
  getAllPromotions,
  getPromotionById,
  getPromotionByCode,
  getActivePromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  validatePromotionCode,
  calculateDiscount,
  incrementUsageCount,
} from "../services/promotion.service";

const router = Router();

// ─── Public routes (no auth required) ────────────────────────────────────────

// Get all promotions
router.get("/", async (_req, res) => {
  try {
    const promotions = await getAllPromotions();
    res.status(200).json(promotions);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Get active promotions only
// NOTE: must be registered before /:id to avoid "active" being treated as an ID
router.get("/active", async (_req, res) => {
  try {
    const promotions = await getActivePromotions();
    res.status(200).json(promotions);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Look up a promotion by its code (used in checkout UI)
// NOTE: must be registered before /:id for the same reason
router.get("/code/:code", async (req, res) => {
  try {
    const promotion = await getPromotionByCode(req.params.code);
    res.status(200).json(promotion);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(404).json({ message });
  }
});

// Validate a promotion code against an order value (used during checkout)
router.post("/validate/:code", authenticate, async (req, res) => {
  const { orderValue } = req.body;
  try {
    const promotion = await validatePromotionCode(String(req.params.code), orderValue);
    res.status(200).json(promotion);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Calculate discount for a promotion against an order value (used during checkout)
router.post("/:id/calculate-discount", authenticate, async (req, res) => {
  const { orderValue } = req.body;
  try {
    const discount = await calculateDiscount(String(req.params.id), orderValue);
    res.status(200).json({ discount });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Get promotion detail by ID
router.get("/:id", async (req, res) => {
  try {
    const promotion = await getPromotionById(String(req.params.id));
    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }
    res.status(200).json(promotion);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// ─── Admin routes ─────────────────────────────────────────────────────────────

// Create a promotion
router.post("/", authenticate, authorize("ADMIN"), async (req, res) => {
  try {
    const promotion = await createPromotion(req.body);
    res.status(201).json(promotion);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Update a promotion
router.put("/:id", authenticate, authorize("ADMIN"), upload.single("image"), async (req, res) => {
  try {
    const body = { ...req.body };
    if ((req as any).file) {
      body.imageUrl = `http://localhost:5000/uploads/${(req as any).file.filename}`;
    }
    const promotion = await updatePromotion(String(req.params.id), body);
    res.status(200).json(promotion);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Increment usage count — called internally after a booking is confirmed
// Guarded so external clients cannot inflate usage counts arbitrarily
router.patch("/:id/increment-usage", authenticate, authorize("ADMIN"), async (req, res) => {
  try {
    const promotion = await incrementUsageCount(String(req.params.id));
    res.status(200).json(promotion);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Delete a promotion
router.delete("/:id", authenticate, authorize("ADMIN"), async (req, res) => {
  try {
    await deletePromotion(String(req.params.id));
    res.status(200).json({ message: "Promotion deleted successfully" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(404).json({ message });
  }
});

export default router;