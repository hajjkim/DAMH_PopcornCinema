import { Router } from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import adminRoutes from "./admin.route";
import movieRoutes from "./movie.route";
import cinemaRoutes from "./cinema.route";
import auditoriumRoutes from "./auditorium.route";
import showtimeRoutes from "./showtime.route";
import seatRoutes from "./seat.route";
import seatHoldRoutes from "./seat-hold.route";
import bookingRoutes from "./booking.route";
import paymentRoutes from "./payment.route";
import promotionRoutes from "./promotion.route";
import savedPromotionRoutes from "./saved-promotion.route";
import snackRoutes from "./snack.route";

const router = Router();

// API Routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/movies", movieRoutes);
router.use("/cinemas", cinemaRoutes);
router.use("/auditoriums", auditoriumRoutes);
router.use("/showtimes", showtimeRoutes);
router.use("/seats", seatRoutes);
router.use("/seat-holds", seatHoldRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payments", paymentRoutes);
router.use("/promotions", promotionRoutes);
router.use("/saved-promotions", savedPromotionRoutes);
router.use("/snacks", snackRoutes);

export default router;
