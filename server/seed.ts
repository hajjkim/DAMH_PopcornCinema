import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcryptjs";

import { User } from "./schemas/user.schema";
import { Movie } from "./schemas/movie.schema";
import { Showtime } from "./schemas/showtime.schema";
import { Snack } from "./schemas/snack.schema";
import { Promotion } from "./schemas/promotion.schema";
import { Booking } from "./schemas/booking.schema";
import { SeatHold } from "./schemas/seat-hold.schema";
import { Cinema } from "./schemas/cinema.schema";
import { Auditorium } from "./schemas/auditorium.schema";
import { Seat } from "./schemas/seat.schema";

// Load .env from root folder
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/popcorn_cinema";

function generateSeats(rows = 8, cols = 12) {
  const seats: string[] = [];
  const rowNames = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < rows; r++) {
    for (let c = 1; c <= cols; c++) {
      seats.push(`${rowNames[r]}${c}`);
    }
  }
  return seats;
}

function generateBookingCode() {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");

  // Clear old data
  await Promise.all([
    User.deleteMany({}),
    Movie.deleteMany({}),
    Showtime.deleteMany({}),
    Snack.deleteMany({}),
    Promotion.deleteMany({}),
    Booking.deleteMany({}),
    SeatHold.deleteMany({}),
    Cinema.deleteMany({}),
    Auditorium.deleteMany({}),
    Seat.deleteMany({}),
  ]);
  console.log("Old data cleared");

  // USERS
  const [hashedPassword1, hashedPassword2] = await Promise.all([
    bcrypt.hash("password123", 10),
    bcrypt.hash("admin123", 10),
  ]);

  const users = await User.insertMany([
    {
      fullName: "Nguyen Van A",
      email: "a@gmail.com",
      passwordHash: hashedPassword1,
      role: "CUSTOMER",
      status: "ACTIVE",
    },
    {
      fullName: "Admin User",
      email: "admin@gmail.com",
      passwordHash: hashedPassword2,
      role: "ADMIN",
      status: "ACTIVE",
    },
  ]);

  console.log("Users created:");
  console.log("  Account 1: a@gmail.com / password123");
  console.log("  Account 2: admin@gmail.com / admin123");

  // CINEMAS
  const cinemaDocs = await Cinema.insertMany([
    { name: "Popcorn Cinema Vincom Bà Triệu", address: "191 Bà Triệu, Hai Bà Trưng, Hà Nội", city: "Hà Nội" },
    { name: "Popcorn Cinema Royal City", address: "72A Nguyễn Trãi, Thanh Xuân, Hà Nội", city: "Hà Nội" },
    { name: "Popcorn Cinema Times City", address: "458 Minh Khai, Hai Bà Trưng, Hà Nội", city: "Hà Nội" },
    { name: "Popcorn Cinema AEON Mall Hà Đông", address: "Dương Nội, Hà Đông, Hà Nội", city: "Hà Nội" },
    { name: "Popcorn Cinema Landmark 81", address: "208 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM", city: "Hồ Chí Minh" },
    { name: "Popcorn Cinema Crescent Mall", address: "101 Tôn Dật Tiên, Quận 7, TP.HCM", city: "Hồ Chí Minh" },
    { name: "Popcorn Cinema Bitexco", address: "2 Hải Triều, Quận 1, TP.HCM", city: "Hồ Chí Minh" },
    { name: "Popcorn Cinema Vincom Ngô Quyền", address: "910A Ngô Quyền, Sơn Trà, Đà Nẵng", city: "Đà Nẵng" },
  ]);

  // AUDITORIUMS
  const auditoriumDocs = await Auditorium.insertMany([
    { cinemaId: cinemaDocs[0]._id, name: "Hall 1", totalRows: 9, totalColumns: 12, seatCapacity: 108 },
    { cinemaId: cinemaDocs[0]._id, name: "Hall 2", totalRows: 10, totalColumns: 12, seatCapacity: 120 },
    { cinemaId: cinemaDocs[1]._id, name: "Hall 1", totalRows: 10, totalColumns: 12, seatCapacity: 120 },
    { cinemaId: cinemaDocs[1]._id, name: "Hall 2", totalRows: 8, totalColumns: 12, seatCapacity: 96 },
    { cinemaId: cinemaDocs[2]._id, name: "Hall 1", totalRows: 9, totalColumns: 12, seatCapacity: 108 },
    { cinemaId: cinemaDocs[3]._id, name: "Hall 1", totalRows: 9, totalColumns: 11, seatCapacity: 99 },
    { cinemaId: cinemaDocs[4]._id, name: "IMAX", totalRows: 11, totalColumns: 14, seatCapacity: 154 },
    { cinemaId: cinemaDocs[4]._id, name: "Deluxe", totalRows: 9, totalColumns: 12, seatCapacity: 108 },
    { cinemaId: cinemaDocs[5]._id, name: "Hall 1", totalRows: 8, totalColumns: 12, seatCapacity: 96 },
    { cinemaId: cinemaDocs[5]._id, name: "Hall 2", totalRows: 8, totalColumns: 10, seatCapacity: 80 },
    { cinemaId: cinemaDocs[6]._id, name: "Hall 1", totalRows: 8, totalColumns: 12, seatCapacity: 96 },
    { cinemaId: cinemaDocs[7]._id, name: "Hall 1", totalRows: 8, totalColumns: 12, seatCapacity: 96 },
    { cinemaId: cinemaDocs[7]._id, name: "Hall 2", totalRows: 8, totalColumns: 12, seatCapacity: 96 },
  ]);

  console.log(`${auditoriumDocs.length} auditoriums created`);

  // SEATS - Generate seats for each auditorium
  const seatDocs: any[] = [];
  const rowNames = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (const auditorium of auditoriumDocs) {
    for (let row = 0; row < auditorium.totalRows; row++) {
      for (let col = 1; col <= auditorium.totalColumns; col++) {
        // Special couple seats (last row, last 2 seats)
        const isCoupleRow = row === auditorium.totalRows - 1 && col > auditorium.totalColumns - 2;
        
        seatDocs.push({
          auditoriumId: auditorium._id,
          seatRow: rowNames[row],
          seatNumber: col,
          seatType: isCoupleRow ? "COUPLE" : "VIP",
          extraPrice: isCoupleRow ? 100000 : 0,
          status: "ACTIVE",
        });
      }
    }
  }

  await Seat.insertMany(seatDocs);
  console.log(`${seatDocs.length} seats created`);

  // MOVIES (updated 02/04/2026)
  const movies = await Movie.insertMany([
    {
      title: "Super Mario Thiên Hà",
      genres: ["Hoạt hình", "Phiêu lưu"],
      duration: 113,
      director: "Đang cập nhật",
      actors: ["Chris Pratt", "Anya Taylor-Joy", "Jack Black"],
      language: "Lồng tiếng / Phụ đề",
      rating: "T13",
      description:
        "Mario, Luigi và Peach bước vào cuộc phiêu lưu vũ trụ mới, đối đầu Bowser cùng con trai Bowser Jr. trên dải ngân hà.",
      releaseDate: new Date("2026-04-01"),
      status: "NOW_SHOWING",
      poster: "https://placehold.co/400x600?text=Super+Mario+Thien+Ha",
    },
    {
      title: "TÀI",
      genres: ["Tâm lý", "Gia đình", "Hành động"],
      duration: 125,
      director: "Mai Tài Phến",
      actors: ["Mai Tài Phến", "Mỹ Tâm", "Hồng Ánh"],
      language: "Tiếng Việt",
      rating: "T16",
      description:
        "Người đàn ông tên Tài rơi vào vòng xoáy nợ nần và phải đối mặt với lựa chọn sinh tồn để bảo vệ gia đình.",
      releaseDate: new Date("2026-03-06"),
      status: "NOW_SHOWING",
      poster: "https://placehold.co/400x600?text=TAI",
    },
    {
      title: "Quỷ Nhập Tràng 2",
      genres: ["Kinh dị"],
      duration: 112,
      director: "Đang cập nhật",
      actors: ["Quang Tuấn", "Khả Như"],
      language: "Tiếng Việt",
      rating: "T18",
      description:
        "Truyền thuyết xác chết sống lại tiếp tục gieo rắc nỗi sợ với loạt nghi thức tà ám mới.",
      releaseDate: new Date("2026-03-13"),
      status: "NOW_SHOWING",
      poster: "https://placehold.co/400x600?text=Quy+Nhap+Trang+2",
    },
    {
      title: "Cô Dâu!",
      genres: ["Kinh dị", "Tình cảm"],
      duration: 118,
      director: "Maggie Gyllenhaal",
      actors: ["Christian Bale", "Jessie Buckley"],
      language: "Tiếng Anh - Phụ đề",
      rating: "C18",
      description:
        "Phiên bản mới của huyền thoại Frankenstein, khi một cô dâu được tạo ra và kéo theo chuỗi bi kịch vượt kiểm soát.",
      releaseDate: new Date("2026-03-13"),
      status: "NOW_SHOWING",
      poster: "https://placehold.co/400x600?text=Co+Dau",
    },
    {
      title: "Cú Nhảy Kỳ Diệu",
      genres: ["Hoạt hình", "Phiêu lưu", "Gia đình"],
      duration: 102,
      director: "Đang cập nhật",
      actors: ["Lồng tiếng Việt"],
      language: "Lồng tiếng / Phụ đề",
      rating: "P",
      description:
        "Hành trình kỳ diệu của nhân vật động vật nhỏ bé khám phá thế giới và vượt qua thử thách môi trường.",
      releaseDate: new Date("2026-03-13"),
      status: "NOW_SHOWING",
      poster: "https://placehold.co/400x600?text=Cu+Nhay+Ky+Dieu",
    },
    {
      title: "Greenland 2: Đại Di Cư",
      genres: ["Hành động", "Thảm họa"],
      duration: 121,
      director: "Ric Roman Waugh",
      actors: ["Gerard Butler", "Morena Baccarin"],
      language: "Tiếng Anh - Phụ đề",
      rating: "T13",
      description:
        "Gia đình Garrity tiếp tục hành trình sinh tồn hậu thảm họa, đối mặt hiểm nguy mới khi Trái Đất chưa kịp hồi phục.",
      releaseDate: new Date("2026-03-13"),
      status: "NOW_SHOWING",
      poster: "https://placehold.co/400x600?text=Greenland+2",
    },
    {
      title: "Tuyển Thủ Dê: Mùi Vị Chiến Thắng",
      genres: ["Hoạt hình", "Hài", "Thể thao"],
      duration: 93,
      director: "Tyree Dillihay",
      actors: ["Caleb McLaughlin", "Gabrielle Union"],
      language: "Tiếng Anh - Phụ đề",
      rating: "P",
      description:
        "Chú dê Will nuôi mơ ước trở thành tuyển thủ Roarball, vượt qua định kiến để tỏa sáng giữa đấu trường khốc liệt.",
      releaseDate: new Date("2026-02-13"),
      status: "NOW_SHOWING",
      poster: "https://placehold.co/400x600?text=Tuyen+Thu+De",
    },
    {
      title: "Song Hỷ Lâm Nguy",
      genres: ["Hài", "Gia đình"],
      duration: 110,
      director: "Vũ Hà",
      actors: ["Dustin Nguyễn", "Misthy", "Jun Vũ"],
      language: "Tiếng Việt",
      rating: "P",
      description:
        "Hai đám cưới diễn ra đối diện nhau với danh sách khách mời trùng khớp, kéo theo loạt tình huống dở khóc dở cười.",
      releaseDate: new Date("2026-04-03"),
      status: "COMING_SOON",
      poster: "https://placehold.co/400x600?text=Song+Hy+Lam+Nguy",
    },
    {
      title: "Hẹn Em Ngày Nhật Thực",
      genres: ["Tình cảm", "Gia đình"],
      duration: 115,
      director: "Lê Thiện Viễn",
      actors: ["Đoàn Thiên Ân", "Khương Lê", "NSND Lê Khanh"],
      language: "Tiếng Việt",
      rating: "T13",
      description:
        "Chuyện tình hoài niệm làng quê thập niên 90, đối diện lựa chọn giữa gia đình và trái tim.",
      releaseDate: new Date("2026-04-03"),
      status: "COMING_SOON",
      poster: "https://placehold.co/400x600?text=Hen+Em+Ngay+Nhat+Thuc",
    },
    {
      title: "Kiki's Delivery Service (IMAX)",
      genres: ["Hoạt hình", "Phiêu lưu"],
      duration: 103,
      director: "Hayao Miyazaki",
      actors: ["Minami Takayama", "Kappei Yamaguchi"],
      language: "Tiếng Nhật - Phụ đề",
      rating: "P",
      description:
        "Bản chiếu IMAX tái ngộ khán giả với cô phù thủy Kiki và chú mèo Jiji trên hành trình trưởng thành.",
      releaseDate: new Date("2026-03-13"),
      status: "NOW_SHOWING",
      poster: "https://placehold.co/400x600?text=Kiki+IMAX",
    },
    {
      title: "Dưới Bóng Điện Hạ",
      genres: ["Lịch sử", "Tâm lý"],
      duration: 128,
      director: "Đang cập nhật",
      actors: ["Yoo Hae Jin", "Park Ji Hoon", "Yoo Ji Tae"],
      language: "Tiếng Hàn - Phụ đề",
      rating: "T16",
      description:
        "Câu chuyện về vua Danjong bị lưu đày và mối liên kết lặng lẽ với trưởng làng Eom Heung Do giữa biến động lịch sử.",
      releaseDate: new Date("2026-04-10"),
      status: "COMING_SOON",
      poster: "https://placehold.co/400x600?text=Duoi+Bong+Dien+Ha",
    },
    {
      title: "Xác Ướp",
      genres: ["Kinh dị", "Giật gân"],
      duration: 108,
      director: "Lee Cronin",
      actors: ["Jack Reynor", "Laia Costa", "May Calamawy"],
      language: "Tiếng Anh - Phụ đề",
      rating: "C18",
      description:
        "Bé gái mất tích 8 năm bất ngờ trở về, mở ra cơn ác mộng kinh hoàng mang màu sắc xác ướp cổ xưa.",
      releaseDate: new Date("2026-04-17"),
      status: "COMING_SOON",
      poster: "https://placehold.co/400x600?text=Xac+Uop",
    },
    {
      title: "Trùm Sò",
      genres: ["Hài", "Dân gian"],
      duration: 100,
      director: "Đỗ Đức Thịnh",
      actors: ["Đức Thịnh", "Phương Nam", "Doãn Quốc Đam"],
      language: "Tiếng Việt",
      rating: "P",
      description:
        "Lấy cảm hứng Ngao Sò Ốc Hến, hành trình truy tìm vàng của Trùm Sò đem lại tiếng cười dí dỏm dịp lễ 30/4.",
      releaseDate: new Date("2026-04-24"),
      status: "COMING_SOON",
      poster: "https://placehold.co/400x600?text=Trum+So",
    },
    {
      title: "Michael",
      genres: ["Tiểu sử", "Âm nhạc"],
      duration: 138,
      director: "Antoine Fuqua",
      actors: ["Jaafar Jackson", "Nia Long", "Colman Domingo"],
      language: "Tiếng Anh - Phụ đề",
      rating: "T13",
      description:
        "Chân dung điện ảnh về cuộc đời và di sản của Michael Jackson, theo dấu hành trình từ Jackson Five đến ngôi sao vĩ đại.",
      releaseDate: new Date("2026-04-24"),
      status: "COMING_SOON",
      poster: "https://placehold.co/400x600?text=Michael",
    },
    {
      title: "Heo Năm Móng",
      genres: ["Kinh dị", "Hài đen"],
      duration: 98,
      director: "Đang cập nhật",
      actors: ["Đang cập nhật"],
      language: "Tiếng Việt",
      rating: "T18",
      description:
        "Câu chuyện dân gian được làm mới với sắc thái kinh dị hài đen, ra mắt cuối tháng 4.",
      releaseDate: new Date("2026-04-30"),
      status: "COMING_SOON",
      poster: "https://placehold.co/400x600?text=Heo+Nam+Mong",
    },
    {
      title: "Anh Hùng",
      genres: ["Hành động", "Tâm lý"],
      duration: 122,
      director: "Đang cập nhật",
      actors: ["Thái Hòa", "Võ Tấn Phát", "Hồng Ánh"],
      language: "Tiếng Việt",
      rating: "T16",
      description:
        "Tài xế taxi đơn thân bị cuốn vào vụ lừa đảo từ thiện khi con gái đang nguy kịch, buộc ông phải trở thành 'anh hùng' bất đắc dĩ.",
      releaseDate: new Date("2026-04-24"),
      status: "COMING_SOON",
      poster: "https://placehold.co/400x600?text=Anh+Hung",
    },
  ]);

  // SHOWTIMES
  const timeSlots = ["09:30", "12:30", "15:45", "19:00", "21:30"];
  // Generate dates for 7 days (for NOW_SHOWING movies)
  const nowShowingDates = [];
  for (let d = 2; d <= 8; d++) {
    const date = new Date("2026-04-02");
    date.setDate(d);
    nowShowingDates.push(date.toISOString().slice(0, 10));
  }
  
  const showtimes = [];

  const parseTime = (dateStr: string, timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date(dateStr);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const addMinutes = (date: Date, minutes: number) => {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
  };

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];

    if (movie.status === "NOW_SHOWING") {
      // For NOW_SHOWING: all 5 time slots for each day
      for (const date of nowShowingDates) {
        const dateIndex = nowShowingDates.indexOf(date);
        for (const time of timeSlots) {
          const timeIndex = timeSlots.indexOf(time);
          const auditorium =
            auditoriumDocs[(i + dateIndex + timeIndex) % auditoriumDocs.length];

          const startTime = parseTime(date, time);
          const endTime = addMinutes(startTime, 130);

          const showtime = await Showtime.create({
            movieId: movie._id,
            auditoriumId: auditorium._id,
            startTime,
            endTime,
            basePrice: 100000,
            status: "OPEN",
          });
          showtimes.push(showtime);
        }
      }
    } else {
      // For COMING_SOON: generate showtimes starting from release date
      const releaseDate = new Date(movie.releaseDate);
      const comingDates = [];
      
      // Generate 3 days starting from release date
      for (let d = 0; d < 3; d++) {
        const date = new Date(releaseDate);
        date.setDate(date.getDate() + d);
        comingDates.push(date.toISOString().slice(0, 10));
      }

      for (const date of comingDates) {
        // Afternoon and evening slots for COMING_SOON
        for (const time of timeSlots.slice(2, 5)) {
          const timeIndex = timeSlots.indexOf(time);
          const auditorium =
            auditoriumDocs[(i + timeIndex) % auditoriumDocs.length];

          const startTime = parseTime(date, time);
          const endTime = addMinutes(startTime, 130);

          const showtime = await Showtime.create({
            movieId: movie._id,
            auditoriumId: auditorium._id,
            startTime,
            endTime,
            basePrice: 100000,
            status: "OPEN",
          });
          showtimes.push(showtime);
        }
      }
    }
  }

  // SNACKS
  const snacks = await Snack.insertMany([
    { name: "Bắp ngọt + Pepsi", price: 50000 },
    { name: "Combo Gia Đình", price: 169000 },
    { name: "Combo 2 Bắp + 2 Nước", price: 99000 },
    { name: "Nước suối", price: 15000 },
    { name: "Hotdog phô mai", price: 39000 },
    { name: "Trà đào cam sả", price: 45000 },
  ]);

  // PROMOTIONS — using the full schema fields resolved from promotion.schema.ts
  const promotions = await Promotion.insertMany([
    {
      title: "Giảm 30% cho thành viên mới",
      code: "WELCOME30",
      discountType: "PERCENTAGE",
      discountValue: 30,
      minOrderValue: 0,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
      status: "ACTIVE",
    },
    {
      title: "Giảm 20% vé từ Thứ 2 - Thứ 5",
      code: "WEEKDAY20",
      discountType: "PERCENTAGE",
      discountValue: 20,
      minOrderValue: 0,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
      status: "ACTIVE",
    },
    {
      title: "Giảm 10% thanh toán VNPAY",
      code: "VNPAY10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderValue: 0,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
      status: "ACTIVE",
    },
    {
      title: "Giảm 50.000đ đơn từ 200.000đ",
      code: "CORNFREE",
      discountType: "FIXED_AMOUNT",
      discountValue: 50000,
      minOrderValue: 200000,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
      status: "ACTIVE",
    },
  ]);

  // BOOKINGS (demo)
  await Booking.insertMany([
    {
      user: users[0]._id,
      showtime: showtimes[0]._id,
      bookingCode: generateBookingCode(),
      seats: ["A1", "A2"],
      snacks: [{ snackId: snacks[0]._id, qty: 1 }],
      promotionCode: promotions[0].code,
      ticketTotal: 200000,
      snackTotal: 50000,
      finalTotal: 175000,
      status: "confirmed",
    },
  ]);

  console.log("\n✅ Seed complete with updated April 2026 data");
  console.log(`  Users:        ${users.length}`);
  console.log(`  Cinemas:      ${cinemaDocs.length}`);
  console.log(`  Auditoriums:  ${auditoriumDocs.length}`);
  console.log(`  Movies:       ${movies.length}`);
  console.log(`  Showtimes:    ${showtimes.length}`);
  console.log(`  Snacks:       ${snacks.length}`);
  console.log(`  Promotions:   ${promotions.length}`);

  mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});