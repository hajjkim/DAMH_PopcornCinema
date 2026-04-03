import { Router } from "express";
import { getAllSnacks } from "../services/snack.service";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const snacks = await getAllSnacks();
    res.status(200).json(snacks);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

export default router;