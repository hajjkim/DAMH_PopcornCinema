export type ShowtimeItem = {
  id: string;
  movieTitle: string;
  moviePoster: string;
  date: string;
  room: string;
  format: string;
  times: string[];
};

import phim1 from "../assets/images/movies/phim1.jpg";
import phim2 from "../assets/images/movies/phim2.jpg";
import phim3 from "../assets/images/movies/phim3.jpg";
import phim4 from "../assets/images/movies/phim4.jpg";
import phim5 from "../assets/images/movies/phim5.jpg";
import phim6 from "../assets/images/movies/phim6.jpg";

export const showtimeList: ShowtimeItem[] = [
  {
    id: "st1",
    movieTitle: "Bộ Tứ Báo Thủ",
    moviePoster: phim1,
    date: "2026-03-27",
    room: "Phòng 1",
    format: "2D Phụ đề",
    times: ["09:00", "11:30", "14:00", "16:30", "19:00", "21:30"],
  },
  {
    id: "st2",
    movieTitle: "Chị Dâu",
    moviePoster: phim2,
    date: "2026-03-27",
    room: "Phòng 2",
    format: "2D Lồng tiếng",
    times: ["08:45", "10:45", "13:15", "15:45", "18:15", "20:45"],
  },
  {
    id: "st3",
    movieTitle: "Hài Tết",
    moviePoster: phim3,
    date: "2026-03-27",
    room: "Phòng 3",
    format: "2D Phụ đề",
    times: ["09:15", "12:00", "14:45", "17:30", "20:15"],
  },
  {
    id: "st4",
    movieTitle: "Quỷ Nhập Tràng",
    moviePoster: phim4,
    date: "2026-03-27",
    room: "Phòng 4",
    format: "2D Kinh dị",
    times: ["10:00", "12:30", "15:00", "17:30", "20:00", "22:15"],
  },
  {
    id: "st5",
    movieTitle: "Nụ Hôn Bạc Tỷ",
    moviePoster: phim5,
    date: "2026-03-28",
    room: "Phòng 1",
    format: "2D Phụ đề",
    times: ["09:30", "12:00", "14:30", "17:00", "19:30"],
  },
  {
    id: "st6",
    movieTitle: "Lật Mặt",
    moviePoster: phim6,
    date: "2026-03-28",
    room: "Phòng 2",
    format: "2D Hành động",
    times: ["08:30", "11:00", "13:30", "16:00", "18:30", "21:00"],
  },
];