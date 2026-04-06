import { Router } from "express";
import crypto from "crypto";
import { SePayPgClient } from "sepay-pg-node";
import { Booking } from "../schemas/booking.schema";
import { PaymentTransaction } from "../schemas/payment-transaction.schema";
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
router.get("/admin/all", authenticate, authorize("ADMIN"), async (_req, res) => {
  try {
    const payments = await getAllPayments();
    res.status(200).json(payments);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Get payment stats
router.get("/admin/stats", authenticate, authorize("ADMIN"), async (_req, res) => {
  try {
    const stats = await getPaymentStats();
    res.status(200).json(stats);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Get all payments for a specific user (admin view)
router.get("/admin/user/:userId", authenticate, authorize("ADMIN"), async (req, res) => {
  try {
    const payments = await getPaymentsByUserId(String(req.params.userId));
    res.status(200).json(payments);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Get any payment by ID (admin)
router.get("/admin/:id", authenticate, authorize("ADMIN"), async (req, res) => {
  try {
    const payment = await getPaymentById(String(req.params.id));
    res.status(200).json(payment);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(404).json({ message });
  }
});

// Create a payment record manually (admin)
router.post("/admin", authenticate, authorize("ADMIN"), async (req, res) => {
  try {
    const payment = await createPayment(req.body);
    res.status(201).json(payment);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Raw update a payment (admin)
router.put("/admin/:id", authenticate, authorize("ADMIN"), async (req, res) => {
  try {
    const payment = await updatePayment(String(req.params.id), req.body);
    res.status(200).json(payment);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Process a refund (admin)
router.post("/admin/:id/refund", authenticate, authorize("ADMIN"), async (req, res) => {
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

// ─── SePay checkout fields (authenticated) ────────────────────────────────────
router.post("/sepay/init", authenticate, (req, res) => {
  try {
    const {
      order_invoice_number,
      order_amount,
      order_description,
      success_url,
      error_url,
      cancel_url,
    } = req.body as {
      order_invoice_number: string;
      order_amount: number;
      order_description?: string;
      success_url?: string;
      error_url?: string;
      cancel_url?: string;
    };

    if (!order_invoice_number || !order_amount) {
      return res
        .status(400)
        .json({ message: "order_invoice_number and order_amount are required" });
    }

    const env = (process.env.SEPAY_ENV || "sandbox") as "sandbox" | "production";
    const merchantId = process.env.SEPAY_MERCHANT_ID || "";
    const secretKey = process.env.SEPAY_SECRET_KEY || "";

    if (!merchantId || !secretKey) {
      return res.status(500).json({ message: "SePay is not configured on the server" });
    }

    const client = new SePayPgClient({ env, merchant_id: merchantId, secret_key: secretKey });

    const fields = client.checkout.initOneTimePaymentFields({
      operation: "PURCHASE",
      payment_method: "BANK_TRANSFER",
      order_invoice_number,
      order_amount,
      currency: "VND",
      order_description: order_description || `Thanh toan don ${order_invoice_number}`,
      success_url,
      error_url,
      cancel_url,
    });

    res.status(200).json({
      checkoutUrl: client.checkout.initCheckoutUrl(),
      fields,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// ─── SePay webhook (server-to-server, no user auth) ───────────────────────────
// SePay calls this after a successful payment. Registers the webhook URL in
// the SePay merchant dashboard under "Webhook URL".
router.post("/sepay/webhook", async (req, res) => {
  try {
    const secretKey = process.env.SEPAY_SECRET_KEY || "";
    if (!secretKey) {
      return res.status(500).json({ message: "SePay not configured" });
    }

    const body = req.body as Record<string, any>;

    // Verify HMAC-SHA256 signature using the same field list as the SDK's signFields
    const SIGNED_FIELD_NAMES = [
      "merchant", "env", "operation", "payment_method", "order_amount",
      "currency", "order_invoice_number", "order_description", "customer_id",
      "agreement_id", "agreement_name", "agreement_type",
      "agreement_payment_frequency", "agreement_amount_per_payment",
      "success_url", "error_url", "cancel_url", "order_id",
    ];

    const signedParts: string[] = [];
    for (const field of SIGNED_FIELD_NAMES) {
      if (body[field] !== undefined && body[field] !== null) {
        signedParts.push(`${field}=${body[field]}`);
      }
    }

    const expectedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(signedParts.join(","))
      .digest("base64");

    if (body.signature !== expectedSignature) {
      return res.status(401).json({ message: "Invalid signature" });
    }

    // Accept COMPLETED or PAID as success status
    const txStatus: string = body.transaction_status || body.status || "";
    if (!["COMPLETED", "PAID"].includes(txStatus.toUpperCase())) {
      // Not a success event — acknowledge without acting
      return res.status(200).json({ message: "Ignored non-success event" });
    }

    const orderInvoiceNumber: string = body.order_invoice_number || "";
    if (!orderInvoiceNumber) {
      return res.status(400).json({ message: "order_invoice_number is required" });
    }

    await markPaymentAsPaid(orderInvoiceNumber);
    res.status(200).json({ message: "OK" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// ─── SePay IPN — Payment Gateway callback ────────────────────────────────────
// Register in SePay PG dashboard → Cấu hình IPN nhận thông báo
// URL: https://your-domain/api/payments/sepay/ipn
router.post("/sepay/ipn", async (req, res) => {
  try {
    const body = req.body as Record<string, any>;

    // Log full payload so we can inspect in dev
    console.log("[SePay IPN]", JSON.stringify(body));

    // ── 1. Verify HMAC-SHA256 signature ──────────────────────────────────────
    const secretKey = process.env.SEPAY_SECRET_KEY || "";
    if (secretKey && body.signature) {
      const SIGNED_FIELDS = [
        "merchant", "env", "operation", "payment_method", "order_amount",
        "currency", "order_invoice_number", "order_description", "customer_id",
        "agreement_id", "agreement_name", "agreement_type",
        "agreement_payment_frequency", "agreement_amount_per_payment",
        "success_url", "error_url", "cancel_url", "order_id",
      ];
      const parts: string[] = [];
      for (const field of SIGNED_FIELDS) {
        if (body[field] !== undefined && body[field] !== null) {
          parts.push(`${field}=${body[field]}`);
        }
      }
      const expected = crypto
        .createHmac("sha256", secretKey)
        .update(parts.join(","))
        .digest("base64");
      if (body.signature !== expected) {
        console.warn("[SePay IPN] Invalid signature");
        return res.status(401).json({ success: false, message: "Invalid signature" });
      }
    }

    // ── 2. Handle Payment Gateway IPN (nested order/transaction objects) ──────
    // Real payload: { notification_type, order: { order_invoice_number, order_status }, transaction: { transaction_status } }
    const pgInvoice: string | undefined =
      body.order?.order_invoice_number || body.order_invoice_number;
    const pgStatus: string = (
      body.transaction?.transaction_status ||
      body.order?.order_status ||
      body.transaction_status ||
      body.status ||
      ""
    ).toUpperCase();
    const PAID_STATUSES = ["COMPLETED", "PAID", "SUCCESS", "CAPTURED", "APPROVED"];

    if (pgInvoice) {
      if (!PAID_STATUSES.includes(pgStatus)) {
        return res.status(200).json({ success: true, message: `Ignored status: ${pgStatus}` });
      }
      try {
        await markPaymentAsPaid(pgInvoice);
      } catch {
        // Fallback: try matching bookingCode
        const booking = await Booking.findOne({ bookingCode: pgInvoice });
        if (booking) {
          await PaymentTransaction.findOneAndUpdate(
            { bookingId: booking._id, status: { $ne: "PAID" } },
            { status: "PAID", paidAt: new Date() }
          );
          await Booking.findByIdAndUpdate(booking._id, { status: "confirmed" });
        }
      }
      return res.status(200).json({ success: true });
    }

    // ── 3. Handle bank-monitoring webhook (transferType present) ─────────────
    const { transferType, code, content } = body;
    if (transferType !== "in") {
      return res.status(200).json({ success: true, message: "Ignored outgoing transaction" });
    }
    const orderCode: string | null =
      code || (content?.match(/\b(ORD-[\w-]+|PC\d+)\b/i)?.[0] ?? null);
    if (!orderCode) {
      return res.status(200).json({ success: true, message: "No order code found" });
    }
    try {
      await markPaymentAsPaid(orderCode);
    } catch {
      const booking = await Booking.findOne({ bookingCode: orderCode });
      if (booking) {
        await PaymentTransaction.findOneAndUpdate(
          { bookingId: booking._id, status: { $ne: "PAID" } },
          { status: "PAID", paidAt: new Date() }
        );
        await Booking.findByIdAndUpdate(booking._id, { status: "confirmed" });
      }
    }

    res.status(200).json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[SePay IPN] Error:", message);
    res.status(200).json({ success: false, message });
  }
});

// ─── SePay active verify — called by client after successful redirect ─────────
// Queries SePay API directly so confirmation works even without a configured IPN.
// POST /api/payments/sepay/verify  { bookingId }
router.post("/sepay/verify", authenticate, async (req, res) => {
  try {
    const { bookingId } = req.body as { bookingId?: string };
    if (!bookingId) {
      return res.status(400).json({ message: "bookingId is required" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Already confirmed — nothing to do
    if (booking.status === "confirmed") {
      return res.status(200).json({ status: "confirmed" });
    }

    // Find the PaymentTransaction so we know the SePay order_invoice_number
    const tx = await PaymentTransaction.findOne({ bookingId });
    if (!tx) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Query SePay directly
    const env = (process.env.SEPAY_ENV || "sandbox") as "sandbox" | "production";
    const merchantId = process.env.SEPAY_MERCHANT_ID || "";
    const secretKey = process.env.SEPAY_SECRET_KEY || "";
    const client = new SePayPgClient({ env, merchant_id: merchantId, secret_key: secretKey });

    const sePayRes = await client.order.retrieve(tx.orderCode);
    const orderData = sePayRes.data;
    console.log("[SePay verify]", tx.orderCode, JSON.stringify(orderData));

    // SePay returns order_status; accept CAPTURED/APPROVED/COMPLETED/PAID/SUCCESS
    const orderStatus: string = (
      orderData?.order?.order_status ||
      orderData?.order_status ||
      orderData?.status ||
      orderData?.data?.order_status ||
      ""
    ).toUpperCase();
    const PAID_STATUSES = ["COMPLETED", "PAID", "SUCCESS", "CAPTURED", "APPROVED"];

    if (PAID_STATUSES.includes(orderStatus)) {
      await markPaymentAsPaid(tx.orderCode);
      return res.status(200).json({ status: "confirmed" });
    }

    return res.status(200).json({ status: booking.status, sePayStatus: orderStatus });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[SePay verify] Error:", message);
    res.status(500).json({ message });
  }
});

export default router;