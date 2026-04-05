import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import {
  getSavedPromotionsByUser,
  isSaved,
  savePromotion,
  unsavePromotion,
  removeSavedPromotion,
  getSavedPromotionCount,
} from "../services/saved-promotion.service";

const router = Router();

// ─── Admin routes ─────────────────────────────────────────────────────────────

// Get saved promotions for any user by ID (admin)
router.get(
  "/admin/user/:userId",
  authorize("ADMIN"),
  async (req, res) => {
    try {
      const savedPromotions = await getSavedPromotionsByUser(String(req.params.userId));
      res.status(200).json(savedPromotions);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({ message });
    }
  }
);

// Get saved promotion count for any user (admin)
router.get(
  "/admin/user/:userId/count",
  authorize("ADMIN"),
  async (req, res) => {
    try {
      const count = await getSavedPromotionCount(String(req.params.userId));
      res.status(200).json({ count });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({ message });
    }
  }
);

// Remove a saved-promotion record by its own ID (admin)
router.delete("/admin/:id", authorize("ADMIN"), async (req, res) => {
  try {
    await removeSavedPromotion(String(req.params.id));
    res.status(200).json({ message: "Saved promotion deleted successfully" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(404).json({ message });
  }
});

// ─── User routes (all require authentication) ─────────────────────────────────

router.use(authenticate);

// Get saved promotions for the authenticated user
router.get("/me", async (req, res) => {
  try {
    const savedPromotions = await getSavedPromotionsByUser(req.auth!.userId);
    res.status(200).json(savedPromotions);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Get saved promotion count for the authenticated user
router.get("/me/count", async (req, res) => {
  try {
    const count = await getSavedPromotionCount(req.auth!.userId);
    res.status(200).json({ count });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Check if a promotion is saved by the authenticated user
router.get("/:promotionId/check", async (req, res) => {
  try {
    const saved = await isSaved(req.auth!.userId, req.params.promotionId);
    res.status(200).json({ saved });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Save a promotion for the authenticated user
router.post("/", async (req, res) => {
  const { promotionId } = req.body;
  try {
    const savedPromotion = await savePromotion(req.auth!.userId, promotionId);
    res.status(201).json(savedPromotion);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Unsave a promotion for the authenticated user
router.delete("/:promotionId", async (req, res) => {
  try {
    await unsavePromotion(req.auth!.userId, req.params.promotionId);
    res.status(200).json({ message: "Promotion removed from saved" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(404).json({ message });
  }
});

export default router;