import dotenv from "dotenv";
import { connectDB } from "./config/db"; // Import db connection
import { Cinema } from "./schemas/cinema.schema";
import { Movie } from "./schemas/movie.schema";
import { Auditorium } from "./schemas/auditorium.schema";
import { Seat } from "./schemas/seat.schema";
import { Showtime } from "./schemas/showtime.schema";
import { User } from "./schemas/user.schema";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB(); // Connect to MongoDB

    // Clear existing data (optional)
    await Cinema.deleteMany({});
    await Movie.deleteMany({});
    await Auditorium.deleteMany({});
    await Seat.deleteMany({});
    await Showtime.deleteMany({});
    await User.deleteMany({});

    console.log("Cleared existing data...");

    // Seed Cinemas
    const cinemas = await Cinema.insertMany([
      {
        name: "Popcorn Cinema Thủ Đức",
        address: "123 Võ Văn Ngân",
        city: "Hồ Chí Minh",
        status: "ACTIVE",
      },
      {
        name: "Popcorn Cinema Bình Thạnh",
        address: "456 Xô Viết Nghệ Tĩnh",
        city: "Hồ Chí Minh",
        status: "ACTIVE",
      },
      {
        name: "Popcorn Cinema Quận 1",
        address: "789 Nguyễn Huệ",
        city: "Hồ Chí Minh",
        status: "ACTIVE",
      },
    ]);

    console.log(`${cinemas.length} cinemas seeded`);

    // Seed Movies
    const movies = await Movie.insertMany([
      {
        title: "Avengers: Endgame",
        director: "Anthony Russo, Joe Russo",
        description: "After the devastating events, the Avengers assemble once more.",
        durationMinutes: 181,
        releaseDate: new Date("2019-04-26"),
        language: "English",
        ageRating: "C13",
        status: "NOW_SHOWING",
        actors: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"],
        genres: ["Action", "Sci-Fi", "Adventure"],
        posterUrl: "https://example.com/avengers-endgame.jpg",
      },
      {
        title: "The Shawshank Redemption",
        director: "Frank Darabont",
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        durationMinutes: 142,
        releaseDate: new Date("1994-09-23"),
        language: "English",
        ageRating: "T18",
        status: "NOW_SHOWING",
        actors: ["Tim Robbins", "Morgan Freeman"],
        genres: ["Drama", "Crime"],
        posterUrl: "https://example.com/shawshank.jpg",
      },
      {
        title: "Inception",
        director: "Christopher Nolan",
        description: "A skilled thief who steals corporate secrets through dream-sharing technology.",
        durationMinutes: 148,
        releaseDate: new Date("2010-07-16"),
        language: "English",
        ageRating: "C13",
        status: "NOW_SHOWING",
        actors: ["Leonardo DiCaprio", "Marion Cotillard", "Ellen Page"],
        genres: ["Action", "Sci-Fi", "Thriller"],
        posterUrl: "https://example.com/inception.jpg",
      },
      {
        title: "The Dark Knight",
        director: "Christopher Nolan",
        description: "When the menace known as the Joker wreaks havoc, Batman must accept one of the greatest psychological tests.",
        durationMinutes: 152,
        releaseDate: new Date("2008-07-18"),
        language: "English",
        ageRating: "C13",
        status: "NOW_SHOWING",
        actors: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
        genres: ["Action", "Crime", "Drama"],
        posterUrl: "https://example.com/dark-knight.jpg",
      },
      {
        title: "Interstellar",
        director: "Christopher Nolan",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        durationMinutes: 169,
        releaseDate: new Date("2014-11-07"),
        language: "English",
        ageRating: "C13",
        status: "COMING_SOON",
        actors: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
        genres: ["Adventure", "Drama", "Sci-Fi"],
        posterUrl: "https://example.com/interstellar.jpg",
      },
      {
        title: "Dune",
        director: "Denis Villeneuve",
        description: "Paul Atreides, a brilliant young man, must travel to the dangerous planet Dune to ensure the future of his family.",
        durationMinutes: 155,
        releaseDate: new Date("2021-10-22"),
        language: "English",
        ageRating: "C13",
        status: "COMING_SOON",
        actors: ["Timothée Chalamet", "Zendaya", "Oscar Isaac"],
        genres: ["Action", "Adventure", "Drama", "Sci-Fi"],
        posterUrl: "https://example.com/dune.jpg",
      },
    ]);

    console.log(`${movies.length} movies seeded`);

    // Seed Auditoriums for each cinema
    const auditoriums = [];
    for (let cinemaIdx = 0; cinemaIdx < cinemas.length; cinemaIdx++) {
      for (let audIdx = 1; audIdx <= 3; audIdx++) {
        const auditorium = await Auditorium.create({
          cinemaId: cinemas[cinemaIdx]._id,
          name: `Auditorium ${audIdx}`,
          totalRows: 10,
          totalColumns: 12,
          seatCapacity: 120,
          status: "ACTIVE",
        });
        auditoriums.push(auditorium);
      }
    }

    console.log(`${auditoriums.length} auditoriums seeded`);

    // Seed Seats for each auditorium
    const seatPromises = [];
    for (const auditorium of auditoriums) {
      for (let row = 1; row <= 10; row++) {
        for (let col = 1; col <= 12; col++) {
          seatPromises.push(
            Seat.create({
              auditoriumId: auditorium._id,
              seatRow: String.fromCharCode(64 + row), // A, B, C, ...
              seatNumber: col,
              seatType: col <= 6 ? "VIP" : "COUPLE", // VIP for first 6 cols, COUPLE for the rest
              extraPrice: col <= 6 ? 50000 : 30000, // Extra charge for premium seats
            })
          );
        }
      }
    }
    await Promise.all(seatPromises);

    console.log(`Seats seeded (${seatPromises.length} total)`);

    // Seed Showtimes
    const showtimes = [];
    const baseDate = new Date("2026-05-01");

    // Create showtimes for multiple auditoriums and movies
    for (let audIdx = 0; audIdx < Math.min(3, auditoriums.length); audIdx++) {
      for (let movieIdx = 0; movieIdx < Math.min(3, movies.length); movieIdx++) {
        const times = [9, 12, 15, 18, 21]; // 9am, 12pm, 3pm, 6pm, 9pm

        for (const hour of times) {
          const startTime = new Date(baseDate);
          startTime.setHours(hour, 0, 0, 0);
          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + movies[movieIdx].durationMinutes);

          showtimes.push({
            movieId: movies[movieIdx]._id,
            auditoriumId: auditoriums[audIdx]._id,
            startTime,
            endTime,
            basePrice: 100000 + (Math.random() * 50000 | 0), // Random price between 100k-150k
            status: "OPEN",
          });
        }
      }
    }

    await Showtime.insertMany(showtimes);
    console.log(`${showtimes.length} showtimes seeded`);

    // Seed Users
    const users = await User.insertMany([
      {
        fullName: "Nguyễn Văn A",
        email: "customer1@example.com",
        passwordHash: "$2a$12$abc123...", // This should be a real hash
        role: "CUSTOMER",
        status: "ACTIVE",
      },
      {
        fullName: "Trần Thị B",
        email: "customer2@example.com",
        passwordHash: "$2a$12$def456...",
        role: "CUSTOMER",
        status: "ACTIVE",
      },
      {
        fullName: "Lê Văn C",
        email: "customer3@example.com",
        passwordHash: "$2a$12$ghi789...",
        role: "CUSTOMER",
        status: "ACTIVE",
      },
      {
        fullName: "Admin User",
        email: "admin@popcorncinema.com",
        passwordHash: "$2a$12$xyz789...",
        role: "ADMIN",
        status: "ACTIVE",
      },
    ]);

    console.log(`${users.length} users seeded`);

    console.log("\n✅ Data seeding completed successfully!");
    console.log(`Summary:`);
    console.log(`- Cinemas: ${cinemas.length}`);
    console.log(`- Movies: ${movies.length}`);
    console.log(`- Auditoriums: ${auditoriums.length}`);
    console.log(`- Seats: ${seatPromises.length}`);
    console.log(`- Showtimes: ${showtimes.length}`);
    console.log(`- Users: ${users.length}`);

    process.exit();
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
};

seedData();