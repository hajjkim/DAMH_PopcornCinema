import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import {
  getAllPayments,
  getPaymentById,
  getPaymentsByUserId,
  createPayment,
  updatePayment,
  processRefund,
  getPaymentStats,
  getUserTransactions,
  markPaymentAsPaid,
} from "../services/payment.service";

const router = Router();

// ─── Public / system routes (no auth) ────────────────────────────────────────

// Payment config for QR display on the client
router.get("/config", (_req, res) => {
  res.status(200).json({
    qrImage: process.env.PAYMENT_QR_URL || "",
    bankName: process.env.PAYMENT_BANK_NAME || "MB Bank",
    accountNumber: process.env.PAYMENT_ACCOUNT_NUMBER || "1234567899",
    accountName: process.env.PAYMENT_ACCOUNT_NAME || "POPCORN CINEMA",
  });
});

// Webhook called by the payment provider — secret-based auth, not user auth
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

// ─── Admin routes ─────────────────────────────────────────────────────────────

// Get all payments
router.get("/admin/all", authorize("ADMIN"), async (_req, res) => {
  try {
    const payments = await getAllPayments();
    res.status(200).json(payments);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Get payment stats
router.get("/admin/stats", authorize("ADMIN"), async (_req, res) => {
  try {
    const stats = await getPaymentStats();
    res.status(200).json(stats);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Get all payments for a specific user (admin view)
router.get("/admin/user/:userId", authorize("ADMIN"), async (req, res) => {
  try {
    const payments = await getPaymentsByUserId(String(req.params.userId));
    res.status(200).json(payments);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Get any payment by ID (admin)
router.get("/admin/:id", authorize("ADMIN"), async (req, res) => {
  try {
    const payment = await getPaymentById(String(req.params.id));
    res.status(200).json(payment);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(404).json({ message });
  }
});

// Create a payment record manually (admin)
router.post("/admin", authorize("ADMIN"), async (req, res) => {
  try {
    const payment = await createPayment(req.body);
    res.status(201).json(payment);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Raw update a payment (admin)
router.put("/admin/:id", authorize("ADMIN"), async (req, res) => {
  try {
    const payment = await updatePayment(String(req.params.id), req.body);
    res.status(200).json(payment);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Process a refund (admin)
router.post("/admin/:id/refund", authorize("ADMIN"), async (req, res) => {
  const { reason } = req.body;
  try {
    const payment = await processRefund(String(req.params.id), reason);
    res.status(200).json(payment);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// ─── User routes (all require authentication) ─────────────────────────────────

// Get the authenticated user's own transaction history
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