import { User } from "../schemas/user.schema";
import { Movie } from "../schemas/movie.schema";
import { Booking } from "../schemas/booking.schema";
import { BookingSnack } from "../schemas/booking-snack.schema";
import { Payment } from "../schemas/payment.schema";
import { Showtime } from "../schemas/showtime.schema";
import { Seat } from "../schemas/seat.schema";

export const getAdminStats = async () => {
  try {
    const totalMovies = await Movie.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    // Get today's showtimes
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const totalShowtimes = await Showtime.countDocuments({
      startTime: { $gte: today, $lt: tomorrow },
    });

    return {
      totalMovies,
      totalShowtimes,
      totalBookings,
      totalUsers,
    };
  } catch (error) {
    console.error("Error getting admin stats:", error);
    throw new Error("Failed to retrieve admin statistics");
  }
};

export const getTopMovies = async (limit: number = 4) => {
  try {
    // Aggregate confirmed bookings → join showtime to get movieId → rank by count
    const topMovies = await Booking.aggregate([
      { $match: { status: "confirmed" } },
      {
        $lookup: {
          from: "showtimes",
          localField: "showtime",
          foreignField: "_id",
          as: "showtimeData",
        },
      },
      { $unwind: "$showtimeData" },
      {
        $group: {
          _id: "$showtimeData.movieId",
          bookingCount: { $sum: 1 },
          revenue: { $sum: "$finalTotal" },
        },
      },
      { $sort: { bookingCount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "_id",
          as: "movieData",
        },
      },
      { $unwind: "$movieData" },
      {
        $project: {
          _id: "$_id",
          title: "$movieData.title",
          posterUrl: "$movieData.poster",
          bookingCount: 1,
          revenue: 1,
        },
      },
    ]);

    return topMovies;
  } catch (error) {
    console.error("Error getting top movies:", error);
    throw new Error("Failed to retrieve top movies");
  }
};

export const getRevenueStats = async () => {
  try {
    // Get all successful payments
    const payments = await Payment.find({ status: "SUCCESSFUL" });

    let totalRevenue = 0;
    let ticketRevenue = 0;
    let snackRevenue = 0;

    // Calculate revenue from payments
    payments.forEach((payment) => {
      const amount = payment.amount || 0;
      totalRevenue += amount;

      // Estimate split (typically 70% tickets, 30% snacks)
      ticketRevenue += amount * 0.7;
      snackRevenue += amount * 0.3;
    });

    // Calculate occupancy rate
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayShowtimes = await Showtime.countDocuments({
      startTime: { $gte: today, $lt: tomorrow },
    });

    const totalSeats = await Seat.countDocuments();
    const bookedSeats = await Booking.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    const occupancyRate = totalSeats > 0 
      ? Math.round((bookedSeats / (totalSeats * (todayShowtimes || 1))) * 100) 
      : 0;

    // Calculate weekly growth (mock data for now)
    const weeklyGrowth = 12.5; // This would calculate from last week's data

    return {
      totalRevenue,
      ticketRevenue,
      snackRevenue,
      occupancyRate,
      weeklyGrowth,
    };
  } catch (error) {
    console.error("Error getting revenue stats:", error);
    throw new Error("Failed to retrieve revenue statistics");
  }
};

export const getRevenueChart = async (days: number) => {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days + 1);
  startDate.setHours(0, 0, 0, 0);

  const payments = await Payment.find({
    status: "SUCCESSFUL",
    createdAt: { $gte: startDate, $lte: endDate },
  }).lean();

  // Build a map of date -> revenue, pre-filled with 0 for every day
  const map = new Map<string, number>();
  for (let d = 0; d < days; d++) {
    const dt = new Date(startDate);
    dt.setDate(dt.getDate() + d);
    map.set(dt.toISOString().slice(0, 10), 0);
  }

  for (const p of payments) {
    const key = new Date((p as any).createdAt).toISOString().slice(0, 10);
    if (map.has(key)) map.set(key, (map.get(key) || 0) + ((p as any).amount || 0));
  }

  return Array.from(map.entries()).map(([date, revenue]) => ({ date, revenue }));
};

export const getMoviesReport = async () => {
  const movies = await Booking.aggregate([
    { $match: { status: "confirmed" } },
    {
      $lookup: {
        from: "showtimes",
        localField: "showtime",
        foreignField: "_id",
        as: "showtime",
      },
    },
    { $unwind: { path: "$showtime", preserveNullAndEmptyArrays: false } },
    {
      $group: {
        _id: "$showtime.movieId",
        ticketsSold: { $sum: { $size: "$seats" } },
        orders: { $sum: 1 },
        revenue: { $sum: "$finalTotal" },
      },
    },
    {
      $lookup: {
        from: "movies",
        localField: "_id",
        foreignField: "_id",
        as: "movieData",
      },
    },
    { $match: { movieData: { $ne: [] } } },
    { $unwind: "$movieData" },
    {
      $project: {
        _id: 1,
        title: "$movieData.title",
        poster: "$movieData.posterUrl",
        ticketsSold: 1,
        orders: 1,
        revenue: 1,
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  return { movies };
};

export const getSnacksReport = async () => {
  const snacks = await BookingSnack.aggregate([
    {
      $lookup: {
        from: "bookings",
        localField: "bookingId",
        foreignField: "_id",
        as: "booking",
      },
    },
    { $unwind: "$booking" },
    { $match: { "booking.status": "confirmed" } },
    {
      $group: {
        _id: "$snackId",
        quantitySold: { $sum: "$quantity" },
        orders: { $sum: 1 },
        revenue: { $sum: "$totalPrice" },
      },
    },
    {
      $lookup: {
        from: "snacks",
        localField: "_id",
        foreignField: "_id",
        as: "snackData",
      },
    },
    { $unwind: "$snackData" },
    {
      $project: {
        _id: 1,
        name: "$snackData.name",
        image: "$snackData.imageUrl",
        quantitySold: 1,
        orders: 1,
        revenue: 1,
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  return { snacks };
};

export const getUsersReport = async (filters: {
  role?: string;
  status?: string;
  limit?: number;
  skip?: number;
}) => {
  const query: any = {};

  if (filters.role) {
    query.role = filters.role;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  const limit = filters.limit || 10;
  const skip = filters.skip || 0;

  const users = await User.find(query)
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(query);

  return {
    users,
    total,
    page: Math.floor(skip / limit) + 1,
    pages: Math.ceil(total / limit),
  };
};

export const getPaymentsReport = async () => {
  const payments = await Payment.aggregate([
    { $match: { status: "SUCCESSFUL" } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userData",
      },
    },
    { $unwind: "$userData" },
    {
      $lookup: {
        from: "bookings",
        localField: "bookingId",
        foreignField: "_id",
        as: "bookingData",
      },
    },
    {
      $lookup: {
        from: "showtimes",
        localField: "bookingData.showtime",
        foreignField: "_id",
        as: "showtimeData",
      },
    },
    {
      $project: {
        _id: 1,
        method: 1,
        amount: 1,
        status: 1,
        transactionId: 1,
        createdAt: 1,
        userName: "$userData.name",
        userEmail: "$userData.email",
        bookingCode: { $arrayElemAt: ["$bookingData.code", 0] },
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  return { payments };
};
