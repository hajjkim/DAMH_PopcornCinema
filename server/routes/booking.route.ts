import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import {
  createBooking,
  getBookingsByUser,
  updateBookingStatus,
} from "../services/booking.service";

const router = Router();

router.use(authenticate);

router.post("/", async (req, res) => {
  try {
    const result = await createBooking({
      userId: req.auth!.userId,
      ...req.body,
    });
    res.status(201).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

router.get("/me", async (req, res) => {
  try {
    const bookings = await getBookingsByUser(req.auth!.userId);
    res.status(200).json(bookings);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const booking = await getBookingsByUser(req.auth!.userId).then((list) =>
      list.find((b) => b._id.toString() === req.params.id)
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

router.patch("/:id/status", async (req, res) => {
  // Only admin (or future system jobs) should change booking status
  authorize("ADMIN")(req, res, async () => {
    try {
      const { status } = req.body;
      const booking = await updateBookingStatus(req.params.id, status);
      res.status(200).json(booking);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(400).json({ message });
    }
  });
});

export default router;
