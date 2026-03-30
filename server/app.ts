import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoute from "./routes/auth.route";
import movieRoute from "./routes/movie.route";
import cinemaRoute from "./routes/cinema.route";
import auditoriumRoute from "./routes/auditorium.route";
import seatRoute from "./routes/seat.route";
import showtimeRoute from "./routes/showtime.route";
import seatHoldRoute from "./routes/seat-hold.route";
import bookingRoute from "./routes/booking.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/movies", movieRoute);
app.use("/api/cinemas", cinemaRoute);
app.use("/api/auditoriums", auditoriumRoute);
app.use("/api/seats", seatRoute);
app.use("/api/showtimes", showtimeRoute);
app.use("/api/seat-holds", seatHoldRoute);
app.use("/api/bookings", bookingRoute);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();