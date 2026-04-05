import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { Booking } from "../schemas/booking.schema";
import {
  createBooking,
  getBookingsByUser,
  updateBookingStatus,
} from "../services/booking.service";

const router = Router();

// ─── Admin routes (protected with authentication and admin authorization) ───

// Get all bookings (admin)
router.get("/admin/all", authenticate, authorize("ADMIN"), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .select("bookingCode user showtime seats status finalTotal ticketTotal snackTotal createdAt")
      .populate("user", "fullName email phone")
      .populate({
        path: "showtime",
        select: "movieId auditoriumId startTime basePrice",
        populate: [
          { path: "movieId", select: "title" },
          {
            path: "auditoriumId",
            select: "name cinemaId",
            populate: {
              path: "cinemaId",
              select: "name",
            },
          },
        ],
      })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Get any booking by ID (admin)
router.get("/admin/:id", authenticate, authorize("ADMIN"), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .select("bookingCode user showtime seats status finalTotal ticketTotal snackTotal promotionCode createdAt")
      .populate("user", "fullName email phone")
      .populate({
        path: "showtime",
        select: "movieId auditoriumId startTime basePrice",
        populate: [
          { path: "movieId", select: "title" },
          {
            path: "auditoriumId",
            select: "name cinemaId",
            populate: {
              path: "cinemaId",
              select: "name",
            },
          },
        ],
      });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Update booking status (admin)
router.patch("/admin/:id/status", authenticate, authorize("ADMIN"), async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await updateBookingStatus(String(req.params.id), status);
    res.status(200).json(booking);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Raw update booking (admin)
router.put("/admin/:id", authenticate, authorize("ADMIN"), async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(booking);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// Delete booking (admin)
router.delete("/admin/:id", authenticate, authorize("ADMIN"), async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message });
  }
});

// ─── User routes (all require authentication) ────────────────────────────────

router.use(authenticate);

// Create a booking
router.post("/", async (req, res) => {
  try {
    const result = await createBooking({
      user: req.auth!.userId,
      ...req.body,
    });
    res.status(201).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Get all bookings for the authenticated user
router.get("/me", async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.auth!.userId })
      .select("bookingCode user showtime seats status finalTotal ticketTotal snackTotal createdAt")
      .populate({
        path: "showtime",
        select: "movieId auditoriumId startTime basePrice",
        populate: [
          { path: "movieId", select: "title" },
          {
            path: "auditoriumId",
            select: "name cinemaId",
            populate: {
              path: "cinemaId",
              select: "name",
            },
          },
        ],
      })
      .sort({ createdAt: -1 });
    
    // Map showtime to showtimeId for frontend compatibility
    const mapped = bookings.map((b: any) => ({
      ...b.toObject(),
      showtimeId: b.showtime?._id || b.showtime,
    }));
    
    res.status(200).json(mapped);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Get a specific booking (scoped to the authenticated user)
router.get("/:id", async (req, res) => {
  try {
    const bookings = await getBookingsByUser(req.auth!.userId);
    const booking = bookings.find((b) => b._id.toString() === req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

export default router;