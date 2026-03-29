import phim1 from "../assets/images/movies/phim1.jpg";
import phim2 from "../assets/images/movies/phim2.jpg";
import phim3 from "../assets/images/movies/phim3.jpg";
import phim4 from "../assets/images/movies/phim4.jpg";
import phim5 from "../assets/images/movies/phim5.jpg";
import phim6 from "../assets/images/movies/phim6.jpg";
import phim7 from "../assets/images/movies/phim7.jpg";
import phim8 from "../assets/images/movies/phim8.jpg";
import phim9 from "../assets/images/movies/phim9.jpg";
import phim10 from "../assets/images/movies/phim10.jpg";
import phim11 from "../assets/images/movies/phim11.jpg";
import phim12 from "../assets/images/movies/phim12.jpg";
import phim13 from "../assets/images/movies/phim13.jpg";
import phim14 from "../assets/images/movies/phim14.jpg";
import phim15 from "../assets/images/movies/phim15.jpg";

export type MovieItem = {
  id: string;
  title: string;
  poster: string;
  status: "nowShowing" | "comingSoon";
  genre: string;
  duration: string;
  releaseDate: string;
  director: string;
  actors: string;
  rating: string;
  language: string;
  description: string;
  trailer?: string;
};

export const movieList: MovieItem[] = [
  {
    id: "1",
    title: "Bộ Tứ Báo Thủ",
    poster: phim1,
    status: "nowShowing",
    genre: "Hài, Tình cảm",
    duration: "115 phút",
    releaseDate: "20/03/2026",
    director: "Trấn Thành",
    actors: "Trấn Thành, Lê Dương Bảo Lâm, Uyển Ân",
    rating: "T13",
    language: "Tiếng Việt",
    description:
      "Bộ phim kể về những tình huống dở khóc dở cười của một nhóm bạn thân khi cùng vướng vào một kế hoạch không ai ngờ tới. Xen lẫn yếu tố hài hước là những câu chuyện về tình bạn, gia đình và lựa chọn trưởng thành.",
  },
  {
    id: "2",
    title: "Chị Dâu",
    poster: phim2,
    status: "nowShowing",
    genre: "Tâm lý, Gia đình",
    duration: "120 phút",
    releaseDate: "18/03/2026",
    director: "Khương Ngọc",
    actors: "Việt Hương, Hồng Đào, Lê Khánh",
    rating: "T16",
    language: "Tiếng Việt",
    description:
      "Một câu chuyện gia đình đầy cảm xúc với những mâu thuẫn, hi sinh và sự cảm thông giữa các thế hệ. Bộ phim mang đến nhiều khoảnh khắc gần gũi và chạm đến cảm xúc người xem.",
  },
  {
    id: "3",
    title: "Hài Tết",
    poster: phim3,
    status: "nowShowing",
    genre: "Hài",
    duration: "98 phút",
    releaseDate: "15/03/2026",
    director: "Nguyễn Quang Dũng",
    actors: "Thu Trang, Tiến Luật, Anh Tú",
    rating: "P",
    language: "Tiếng Việt",
    description:
      "Phim xoay quanh một loạt biến cố bất ngờ diễn ra trong những ngày cận Tết, khi mọi thành viên trong gia đình đều có bí mật riêng. Từ đó tạo nên những tình huống vui nhộn nhưng cũng rất ấm áp.",
  },
  {
    id: "4",
    title: "Quỷ Nhập Tràng",
    poster: phim4,
    status: "nowShowing",
    genre: "Kinh dị",
    duration: "105 phút",
    releaseDate: "22/03/2026",
    director: "Pom Nguyễn",
    actors: "Quang Tuấn, Khả Như",
    rating: "T18",
    language: "Tiếng Việt",
    description:
      "Một ngôi làng nhỏ bỗng rơi vào chuỗi hiện tượng bí ẩn sau một nghi thức tâm linh bị phá vỡ. Những bí mật kinh hoàng dần được hé lộ trong bóng tối và nỗi sợ bao trùm tất cả.",
  },
  {
    id: "5",
    title: "Nụ Hôn Bạc Tỷ",
    poster: phim5,
    status: "nowShowing",
    genre: "Tình cảm, Hài",
    duration: "110 phút",
    releaseDate: "25/03/2026",
    director: "Thu Trang",
    actors: "Thiên Ân, Lê Xuân Tiền",
    rating: "T13",
    language: "Tiếng Việt",
    description:
      "Bộ phim là câu chuyện tình yêu hiện đại, nơi cảm xúc, tham vọng và lựa chọn cá nhân va chạm với nhau. Phim mang màu sắc trẻ trung, lãng mạn và nhiều bất ngờ.",
  },
  {
    id: "6",
    title: "Lật Mặt",
    poster: phim6,
    status: "nowShowing",
    genre: "Hành động",
    duration: "128 phút",
    releaseDate: "27/03/2026",
    director: "Lý Hải",
    actors: "Quách Ngọc Tuyên, Ốc Thanh Vân",
    rating: "T16",
    language: "Tiếng Việt",
    description:
      "Một cuộc truy đuổi nghẹt thở mở ra giữa những bí mật bị che giấu nhiều năm. Với nhịp phim nhanh, nhiều pha hành động mãn nhãn, đây là lựa chọn hấp dẫn cho khán giả yêu thích thể loại gay cấn.",
  },
  {
    id: "7",
    title: "Ma Không Đầu",
    poster: phim7,
    status: "nowShowing",
    genre: "Kinh dị, Hài",
    duration: "102 phút",
    releaseDate: "26/03/2026",
    director: "Đang cập nhật",
    actors: "Đang cập nhật",
    rating: "T16",
    language: "Tiếng Việt",
    description:
      "Một câu chuyện kỳ bí pha trộn giữa yếu tố rùng rợn và hài hước, đưa người xem vào hành trình khám phá những hiện tượng siêu nhiên không thể lý giải.",
  },
  {
    id: "8",
    title: "Đèn Âm Hồn",
    poster: phim8,
    status: "nowShowing",
    genre: "Kinh dị",
    duration: "108 phút",
    releaseDate: "24/03/2026",
    director: "Đang cập nhật",
    actors: "Đang cập nhật",
    rating: "T18",
    language: "Tiếng Việt",
    description:
      "Một vật thể cổ bí ẩn vô tình bị đánh thức, kéo theo hàng loạt sự kiện kinh hoàng. Bộ phim đem lại không khí căng thẳng và ám ảnh từ đầu đến cuối.",
  },
  {
    id: "9",
    title: "Kẻ Ẩn Danh",
    poster: phim9,
    status: "nowShowing",
    genre: "Hành động, Tội phạm",
    duration: "118 phút",
    releaseDate: "21/03/2026",
    director: "Đang cập nhật",
    actors: "Đang cập nhật",
    rating: "T16",
    language: "Tiếng Việt",
    description:
      "Một nhân vật bí ẩn xuất hiện giữa cuộc chiến ngầm của các băng nhóm tội phạm. Bộ phim có nhiều phân cảnh hành động mạnh và cốt truyện lôi cuốn.",
  },
  {
    id: "10",
    title: "Cám",
    poster: phim10,
    status: "nowShowing",
    genre: "Kinh dị, Cổ trang",
    duration: "112 phút",
    releaseDate: "23/03/2026",
    director: "Đang cập nhật",
    actors: "Đang cập nhật",
    rating: "T18",
    language: "Tiếng Việt",
    description:
      "Lấy cảm hứng từ chất liệu dân gian Việt Nam, bộ phim tái hiện một câu chuyện đen tối với bầu không khí u ám và nhiều lớp bí ẩn.",
  },
  {
    id: "11",
    title: "Avengers Mới",
    poster: phim11,
    status: "comingSoon",
    genre: "Hành động, Viễn tưởng",
    duration: "135 phút",
    releaseDate: "10/04/2026",
    director: "Đang cập nhật",
    actors: "Đang cập nhật",
    rating: "T13",
    language: "Tiếng Anh",
    description:
      "Một chương mới của các siêu anh hùng với mối đe dọa toàn cầu chưa từng có. Bộ phim hứa hẹn nhiều đại cảnh và các màn đối đầu bùng nổ.",
  },
  {
    id: "12",
    title: "Siêu Trộm",
    poster: phim12,
    status: "comingSoon",
    genre: "Hành động, Hài",
    duration: "109 phút",
    releaseDate: "12/04/2026",
    director: "Đang cập nhật",
    actors: "Đang cập nhật",
    rating: "T13",
    language: "Tiếng Anh",
    description:
      "Một phi vụ tưởng như hoàn hảo bỗng trở nên hỗn loạn khi các thành viên trong nhóm đều có mục đích riêng. Phim pha trộn hài hước và hành động giải trí.",
  },
  {
    id: "13",
    title: "Thanh Gươm Diệt Quỷ",
    poster: phim13,
    status: "comingSoon",
    genre: "Hoạt hình, Hành động",
    duration: "125 phút",
    releaseDate: "15/04/2026",
    director: "Đang cập nhật",
    actors: "Đang cập nhật",
    rating: "T13",
    language: "Tiếng Nhật",
    description:
      "Cuộc chiến mới giữa con người và quỷ dữ tiếp tục bùng nổ. Phim gây ấn tượng bằng hình ảnh đẹp mắt và nhịp độ chiến đấu dồn dập.",
  },
  {
    id: "14",
    title: "Robot Đại Chiến",
    poster: phim14,
    status: "comingSoon",
    genre: "Viễn tưởng, Hành động",
    duration: "130 phút",
    releaseDate: "18/04/2026",
    director: "Đang cập nhật",
    actors: "Đang cập nhật",
    rating: "T13",
    language: "Tiếng Anh",
    description:
      "Khi trí tuệ nhân tạo vượt ngoài tầm kiểm soát, loài người phải đứng lên chống lại cuộc nổi dậy của máy móc trong một trận chiến sống còn.",
  },
  {
    id: "15",
    title: "Vùng Đất Ma",
    poster: phim15,
    status: "comingSoon",
    genre: "Kinh dị",
    duration: "101 phút",
    releaseDate: "20/04/2026",
    director: "Đang cập nhật",
    actors: "Đang cập nhật",
    rating: "T18",
    language: "Tiếng Anh",
    description:
      "Một nhóm bạn lạc vào vùng đất bị nguyền rủa và dần phát hiện ra sự thật đáng sợ phía sau truyền thuyết tồn tại suốt hàng trăm năm.",
  },
];