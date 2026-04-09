import { Router } from "express";
import mongoose from "mongoose";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { Booking } from "../schemas/booking.schema";
import { Showtime } from "../schemas/showtime.schema";
import { Seat } from "../schemas/seat.schema";
import {
  createBooking,
  getBookingsByUser,
  updateBookingStatus,
} from "../services/booking.service";

const router = Router();

// ─── Diagnostic endpoint ───
router.get("/debug/sample", async (req, res) => {
  try {
    // Get raw booking
    const booking = await Booking.findOne().lean();
    if (!booking) return res.json({ message: "No bookings found" });
    
    // Check showtime fields
    const showtime = await Showtime.findById(booking.showtime).lean();
    
    // Check collection names
    const db = require("mongoose").connection.db;
    const collections = await db?.getCollectionNames();
    
    // Try manual lookup using raw MongoDB
    const auditoriums = db?.collection("auditoriums");
    const manualLookupResult = await auditoriums?.findOne({ _id: showtime?.auditoriumId });
    
    // Try lowercase collection
    const auditoriums2 = db?.collection("auditorium");
    const manualLookupResult2 = await auditoriums2?.findOne({ _id: showtime?.auditoriumId });
    
    res.json({
      showtime_data: {
        _id: showtime?._id,
        auditoriumId: showtime?.auditoriumId,
        auditoriumIdType: typeof showtime?.auditoriumId,
        auditoriumIdConstructor: showtime?.auditoriumId?.constructor?.name,
      },
      collections_in_db: collections,
      manual_lookup_auditoriums: manualLookupResult,
      manual_lookup_auditorium: manualLookupResult2,
      direct_find: await (require("../schemas/auditorium.schema").Auditorium).findById(showtime?.auditoriumId).lean(),
    });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err), stack: err instanceof Error ? err.stack : "" });
  }
});

// ─── Admin routes (protected with authentication and admin authorization) ───

// Get all bookings (admin)
router.get("/admin/all", authenticate, authorize("ADMIN"), async (req, res) => {
  try {
    const bookings = await Booking.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "showtimes",
          localField: "showtime",
          foreignField: "_id",
          as: "showtime",
        },
      },
      { $unwind: { path: "$showtime", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "movies",
          localField: "showtime.movieId",
          foreignField: "_id",
          as: "movieData",
        },
      },
      { $unwind: { path: "$movieData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "auditoria",
          localField: "showtime.auditoriumId",
          foreignField: "_id",
          as: "auditoriumData",
        },
      },
      { $unwind: { path: "$auditoriumData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "cinemas",
          localField: "auditoriumData.cinemaId",
          foreignField: "_id",
          as: "cinemaData",
        },
      },
      { $unwind: { path: "$cinemaData", preserveNullAndEmptyArrays: true } },
      // Lookup seats to convert ObjectIds to readable format
      {
        $lookup: {
          from: "seats",
          localField: "seats",
          foreignField: "_id",
          as: "seatData",
        },
      },
      {
        $addFields: {
          // Convert seats: if we found seat documents, use readable format; otherwise use original seats
          seats: {
            $cond: [
              { $gt: [{ $size: "$seatData" }, 0] },
              {
                $map: {
                  input: "$seatData",
                  as: "seat",
                  in: {
                    $concat: ["$$seat.seatRow", { $toString: "$$seat.seatNumber" }]
                  }
                }
              },
              "$seats" // Use original seats if no seat data found
            ]
          }
        }
      },
      {
        $project: {
          _id: 1,
          bookingCode: 1,
          user: { fullName: 1, email: 1, phone: 1 },
          showtime: {
            _id: "$showtime._id",
            movieId: { 
              _id: "$movieData._id",
              title: "$movieData.title"
            },
            auditoriumId: { 
              _id: "$auditoriumData._id",
              name: "$auditoriumData.name",
              cinemaId: { 
                _id: "$cinemaData._id",
                name: "$cinemaData.name"
              }
            },
            startTime: "$showtime.startTime",
            basePrice: "$showtime.basePrice",
          },
          seats: 1,
          status: 1,
          finalTotal: 1,
          ticketTotal: 1,
          snackTotal: 1,
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    
    // Debug: Log the structure of first booking
    if (bookings.length > 0) {
      console.log("📊 Sample booking structure:", JSON.stringify(bookings[0], null, 2));
    }
    
    res.json(bookings);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Error fetching bookings:", message);
    res.status(500).json({ message });
  }
});

// Get any booking by ID (admin)
router.get("/admin/:id", authenticate, authorize("ADMIN"), async (req, res) => {
  try {
    const bookings = await Booking.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(String(req.params.id)) } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "showtimes",
          localField: "showtime",
          foreignField: "_id",
          as: "showtime",
        },
      },
      { $unwind: { path: "$showtime", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "movies",
          localField: "showtime.movieId",
          foreignField: "_id",
          as: "movieData",
        },
      },
      { $unwind: { path: "$movieData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "auditoria",
          localField: "showtime.auditoriumId",
          foreignField: "_id",
          as: "auditoriumData",
        },
      },
      { $unwind: { path: "$auditoriumData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "cinemas",
          localField: "auditoriumData.cinemaId",
          foreignField: "_id",
          as: "cinemaData",
        },
      },
      { $unwind: { path: "$cinemaData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "seats",
          localField: "seats",
          foreignField: "_id",
          as: "seatData",
        },
      },
      {
        $addFields: {
          seats: {
            $cond: [
              { $gt: [{ $size: "$seatData" }, 0] },
              {
                $map: {
                  input: "$seatData",
                  as: "seat",
                  in: { $concat: ["$$seat.seatRow", { $toString: "$$seat.seatNumber" }] }
                }
              },
              "$seats"
            ]
          }
        }
      },
      {
        $project: {
          bookingCode: 1,
          user: { fullName: 1, email: 1, phone: 1 },
          showtime: {
            _id: "$showtime._id",
            movieId: { 
              _id: { $ifNull: ["$movieData._id", null] },
              title: { $ifNull: ["$movieData.title", null] }
            },
            auditoriumId: { 
              _id: { $ifNull: ["$auditoriumData._id", null] },
              name: { $ifNull: ["$auditoriumData.name", null] },
              cinemaId: { 
                _id: { $ifNull: ["$cinemaData._id", null] },
                name: { $ifNull: ["$cinemaData.name", null] }
              }
            },
            startTime: "$showtime.startTime",
            basePrice: "$showtime.basePrice",
          },
          seats: 1,
          status: 1,
          finalTotal: 1,
          ticketTotal: 1,
          snackTotal: 1,
          promotionCode: 1,
          createdAt: 1,
        },
      },
    ]);

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(bookings[0]);
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
router.post("/", authenticate, async (req, res) => {
  try {
    const { showtimeId, seats } = req.body;
    
    // Convert seat identifiers (e.g., "A1") to actual Seat ObjectIds
    const showtime = await Showtime.findById(showtimeId).lean();
    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }

    // Query all seats for this auditorium (to validate they exist)
    const auditoriumSeats = await Seat.find({ auditoriumId: showtime.auditoriumId }).lean();
    
    // Build a map from "row+number" to seat string ID for validation
    const seatMap = new Map<string, boolean>();
    auditoriumSeats.forEach((seat) => {
      const seatKey = `${seat.seatRow}${seat.seatNumber}`;
      seatMap.set(seatKey, true);
    });

    // Validate that all requested seats are valid
    // If no seats in database, we'll accept any seat string format for now
    const validationRequired = auditoriumSeats.length > 0;
    
    seats.forEach((seatId: string) => {
      if (validationRequired && !seatMap.has(seatId)) {
        throw new Error(`Invalid seat: ${seatId}`);
      }
    });

    try {
      // Always use the original seat strings for storage (like "A1", "A2", etc)
      const result = await createBooking({
        user: req.auth!.userId,
        ...req.body,
        seats: seats,  // Store original seat strings, not ObjectIds
      });
      res.status(201).json(result);
    } catch (err) {
      // Pass through error as-is since we're already using readable seat IDs
      throw err;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Get all bookings for the authenticated user
router.get("/me", authenticate, async (req, res) => {
  try {
    const bookings = await Booking.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(String(req.auth!.userId)) } },
      {
        $lookup: {
          from: "showtimes",
          localField: "showtime",
          foreignField: "_id",
          as: "showtime",
        },
      },
      { $unwind: { path: "$showtime", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "movies",
          localField: "showtime.movieId",
          foreignField: "_id",
          as: "movieData",
        },
      },
      { $unwind: { path: "$movieData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "auditoria",
          localField: "showtime.auditoriumId",
          foreignField: "_id",
          as: "auditoriumData",
        },
      },
      { $unwind: { path: "$auditoriumData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "cinemas",
          localField: "auditoriumData.cinemaId",
          foreignField: "_id",
          as: "cinemaData",
        },
      },
      { $unwind: { path: "$cinemaData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "seats",
          localField: "seats",
          foreignField: "_id",
          as: "seatData",
        },
      },
      {
        $addFields: {
          seats: {
            $cond: [
              { $gt: [{ $size: "$seatData" }, 0] },
              {
                $map: {
                  input: "$seatData",
                  as: "seat",
                  in: { $concat: ["$$seat.seatRow", { $toString: "$$seat.seatNumber" }] }
                }
              },
              "$seats"
            ]
          }
        }
      },
      {
        $project: {
          bookingCode: 1,
          showtime: {
            _id: "$showtime._id",
            movieId: { _id: "$movieData._id", title: "$movieData.title", poster: "$movieData.poster" },
            auditoriumId: { 
              _id: "$auditoriumData._id", 
              name: "$auditoriumData.name", 
              cinemaId: { _id: "$cinemaData._id", name: "$cinemaData.name" } 
            },
            startTime: "$showtime.startTime",
            endTime: "$showtime.endTime",
            basePrice: "$showtime.basePrice",
          },
          seats: 1,
          status: 1,
          finalTotal: 1,
          ticketTotal: 1,
          snackTotal: 1,
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    
    // Map showtime to showtimeId for frontend compatibility
    const mapped = bookings.map((b: any) => ({
      ...b,
      showtimeId: b.showtime?._id || b.showtime,
    }));
    
    res.status(200).json(mapped);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

// Get a specific booking (scoped to the authenticated user)
router.get("/:id", authenticate, async (req, res) => {
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

// Cancel a booking — user can only cancel their own pending booking
router.patch("/:id/cancel", authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.user.toString() !== String(req.auth!.userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (!["pending_payment", "pending_confirmation"].includes(booking.status)) {
      return res.status(400).json({ message: "Booking cannot be cancelled" });
    }
    booking.status = "failed";
    await booking.save();
    res.status(200).json({ message: "Booking cancelled", status: "failed" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ message });
  }
});

export default router;