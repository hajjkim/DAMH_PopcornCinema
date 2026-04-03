import { Router } from "express";
import {
  getAllPromotions,
  getPromotionById,
} from "../services/promotion.service";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const promotions = await getAllPromotions();
    res.status(200).json(promotions);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// GET /:id - promotion detail
router.get("/:id", async (req, res) => {
  try {
    const promotion = await getPromotionById(req.params.id);

    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    res.status(200).json(promotion);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

export default router;
