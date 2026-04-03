import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getUserTransactions,
  markPaymentAsPaid,
} from "../services/payment.service";

const router = Router();

router.get("/config", (_req, res) => {
  res.status(200).json({
    qrImage: process.env.PAYMENT_QR_URL || "",
    bankName: process.env.PAYMENT_BANK_NAME || "MB Bank",
    accountNumber: process.env.PAYMENT_ACCOUNT_NUMBER || "1234567899",
    accountName: process.env.PAYMENT_ACCOUNT_NAME || "POPCORN CINEMA",
  });
});

// Placeholder endpoints
router.post("/webhook", async (req, res) => {
  try {
    const secret = req.headers["x-webhook-secret"];
    const expected = process.env.PAYMENT_WEBHOOK_SECRET;

    if (!expected || secret !== expected) {
      return res.status(401).json({ message: "Unauthorized webhook" });
    }

    const { orderCode, status } = req.body || {};
    if (!orderCode || status !== "PAID") {
      return res
        .status(400)
        .json({ message: "orderCode and status=PAID are required" });
    }

    const payment = await markPaymentAsPaid(orderCode);
    res.status(200).json(payment);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

router.get("/transactions/me", authenticate, async (req, res) => {
  try {
    const transactions = await getUserTransactions(req.auth!.userId);
    res.status(200).json(transactions);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

export default router;
