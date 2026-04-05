import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/db";
// import authRoute from "./routes/auth.route";
// import userRoute from "./routes/user.route";
// import movieRoute from "./routes/movie.route";
// import showtimeRoute from "./routes/showtime.route";
// import snackRoute from "./routes/snack.route";
// import promotionRoute from "./routes/promotion.route";
// import seatHoldRoute from "./routes/seat-hold.route";
// import bookingRoute from "./routes/booking.route";
// import auditoriumRoute from "./routes/auditorium.route";
// import cinemaRoute from "./routes/cinema.route";
// import seatRoute from "./routes/seat.route";
// import paymentRoute from "./routes/payment.route";
// import adminRoute from "./routes/admin.route";
// import savedPromotionRoute from "./routes/saved-promotion.route";
import { markExpiredBookings } from "./services/booking.service";
import apiRoutes from "./routes/index";
import { errorHandler } from "./middlewares/error.middleware";

// Load .env from root folder
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// CORS Configuration
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.get("/api/health", (_req, res) => {
  res.json({ message: "Server is running" });
});

// app.use("/api/auth", authRoute);
// app.use("/api/users", userRoute);
// app.use("/api/movies", movieRoute);
// app.use("/api/showtimes", showtimeRoute);
// app.use("/api/snacks", snackRoute);
// app.use("/api/promotions", promotionRoute);
// app.use("/api/seat-holds", seatHoldRoute);
// app.use("/api/bookings", bookingRoute);
// app.use("/api/auditoriums", auditoriumRoute);
// app.use("/api/cinemas", cinemaRoute);
// app.use("/api/seats", seatRoute);
// app.use("/api/payments", paymentRoute);
// app.use("/api/admin", adminRoute);
// app.use("/api/saved-promotions", savedPromotionRoute);

// app.use((_req, res) => {
//   res.status(404).json({ message: "Route not found" });
//});
// Use all API routes
app.use("/api", apiRoutes);

// Error handler middleware
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    // background job: mark pending bookings that passed payment window as failed
    setInterval(() => {
      markExpiredBookings().catch((err) =>
        console.error("markExpiredBookings error:", err)
      );
    }, 60 * 1000); // every minute

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
