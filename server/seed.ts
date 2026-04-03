const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcryptjs = require("bcryptjs");
dotenv.config();

const { User } = require("./schemas/user.schema");
const { Movie } = require("./schemas/movie.schema");
const { Showtime } = require("./schemas/showtime.schema");
const { Snack } = require("./schemas/snack.schema");
const { Promotion } = require("./schemas/promotion.schema");
const { Booking } = require("./schemas/booking.schema");
const { SeatHold } = require("./schemas/seat-hold.schema");
const { Cinema } = require("./schemas/cinema.schema");
const { Auditorium } = require("./schemas/auditorium.schema");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/popcorn_cinema";

function generateSeats(rows = 8, cols = 12) {
  const seats = [];
  const rowNames = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < rows; r++) {
    for (let c = 1; c <= cols; c++) {
      seats.push(`${rowNames[r]}${c}`);
    }
  }
  return seats;
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");

  // clear old data
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
  ]);
  console.log("Old data cleared");

  // USERS
  const [hashedPassword1, hashedPassword2] = await Promise.all([
    bcryptjs.hash("password123", 10),
    bcryptjs.hash("admin123", 10),
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

  // CINEMAS & AUDITORIUMS (mở rộng đa thành phố)
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

  // MOVIES (cập nhật 02/04/2026)
  const movies = await Movie.insertMany([
    {
      title: "Super Mario Thiên Hà",
      genre: "Hoạt hình, Phiêu lưu",
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
      genre: "Tâm lý, Gia đình, Hành động",
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
      genre: "Kinh dị",
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
      genre: "Kinh dị, Tình cảm",
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
      genre: "Hoạt hình, Phiêu lưu, Gia đình",
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
      genre: "Hành động, Thảm họa",
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
      genre: "Hoạt hình, Hài, Thể thao",
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
      genre: "Hài, Gia đình",
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
      genre: "Tình cảm, Gia đình",
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
      genre: "Hoạt hình, Phiêu lưu",
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
      genre: "Lịch sử, Tâm lý",
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
      genre: "Kinh dị, Giật gân",
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
      genre: "Hài, Dân gian",
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
      genre: "Tiểu sử, Âm nhạc",
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
      genre: "Kinh dị, Hài đen",
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
      genre: "Hành động, Tâm lý",
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

  // SHOWTIMES (lịch mẫu nhiều ngày)
  const timeSlots = ["09:30", "12:30", "15:45", "19:00", "21:30"];
  const nowShowingDates = ["2026-04-02", "2026-04-03", "2026-04-04", "2026-04-05"];
  const showtimes = [];

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];

    if (movie.status === "NOW_SHOWING") {
      for (const date of nowShowingDates) {
        const dateIndex = nowShowingDates.indexOf(date);
        for (const time of timeSlots.slice(0, 3)) {
          const timeIndex = timeSlots.indexOf(time);
          const auditorium = auditoriumDocs[(i + dateIndex + timeIndex) % auditoriumDocs.length];
          const cinemaName =
            cinemaDocs.find((c: any) => c._id.equals(auditorium.cinemaId))?.name || "Popcorn Cinema";
          const roomName = auditorium.name;

          const showtime = await Showtime.create({
            movieId: movie._id,
            cinema: cinemaName,
            date,
            time,
            seatLayout: generateSeats(auditorium.totalRows, auditorium.totalColumns),
            room: roomName,
          });
          showtimes.push(showtime);
        }
      }
    } else {
      const releaseDateStr = movie.releaseDate.toISOString().slice(0, 10);
      const plusOne = new Date(movie.releaseDate);
      plusOne.setDate(plusOne.getDate() + 1);
      const comingDates = [releaseDateStr, plusOne.toISOString().slice(0, 10)];

      for (const date of comingDates) {
        for (const time of timeSlots.slice(2, 5)) {
          const timeIndex = timeSlots.indexOf(time);
          const auditorium = auditoriumDocs[(i + timeIndex) % auditoriumDocs.length];
          const cinemaName =
            cinemaDocs.find((c: any) => c._id.equals(auditorium.cinemaId))?.name || "Popcorn Cinema";
          const roomName = auditorium.name;

          const showtime = await Showtime.create({
            movieId: movie._id,
            cinema: cinemaName,
            date,
            time,
            seatLayout: generateSeats(auditorium.totalRows, auditorium.totalColumns),
            room: roomName,
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

  // PROMOTIONS
  const promotions = await Promotion.insertMany([
    { title: "Giảm 30% cho thành viên mới", code: "WELCOME30", discount: "30%" },
    { title: "Giảm 20% vé từ Thứ 2 - Thứ 5", code: "WEEKDAY20", discount: "20%" },
    { title: "Giảm 10% thanh toán VNPAY", code: "VNPAY10", discount: "10%" },
    { title: "Mua 2 vé tặng 1 bắp", code: "CORNFREE", discount: "FREESNACK" },
  ]);

  // BOOKINGS (demo)
  await Booking.insertMany([
    {
      userId: users[0]._id,
      showtimeId: showtimes[0]._id,
      seats: ["A1", "A2"],
      snacks: [{ snackId: snacks[0]._id, qty: 1 }],
      promotionCode: promotions[0].code,
      ticketTotal: 200000,
      snackTotal: 50000,
      finalTotal: 175000,
      status: "confirmed",
    },
  ]);

  console.log("Seed complete with updated April 2026 data");
  console.log(`Users: ${users.length}`);
  console.log(`Cinemas: ${cinemaDocs.length}`);
  console.log(`Auditoriums: ${auditoriumDocs.length}`);
  console.log(`Movies: ${movies.length}`);
  console.log(`Showtimes: ${showtimes.length}`);
  console.log(`Snacks: ${snacks.length}`);
  console.log(`Promotions: ${promotions.length}`);
  mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});
