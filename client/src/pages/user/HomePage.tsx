import React, { useMemo, useState } from "react";
import "../../styles/HomePage.css";

type Movie = {
  _id: string;
  title: string;
  poster?: string;
  genre?: string;
};

type Promotion = {
  _id: string;
  title: string;
  image?: string;
  description?: string;
};

type HomePageProps = {
  nowShowing?: Movie[];
  comingSoon?: Movie[];
  promotions?: Promotion[];
};

type MovieCardProps = {
  movie: Movie;
  isComingSoon?: boolean;
};

type PromotionCardProps = {
  item: Promotion;
};

const banners: string[] = [
  "/images/banners/banner1.jpg",
  "/images/banners/banner2.jpg",
  "/images/banners/banner3.jpg",
  "/images/banners/banner4.jpg",
];

const demoNowShowing: Movie[] = [
  {
    _id: "1",
    title: "Avengers: Secret Wars",
    poster: "/images/movies/default.jpg",
    genre: "Hành động, viễn tưởng",
  },
  {
    _id: "2",
    title: "The Batman Part II",
    poster: "/images/movies/default.jpg",
    genre: "Hành động, trinh thám",
  },
  {
    _id: "3",
    title: "Inside Out 2",
    poster: "/images/movies/default.jpg",
    genre: "Hoạt hình, gia đình",
  },
  {
    _id: "4",
    title: "Dune: Part Three",
    poster: "/images/movies/default.jpg",
    genre: "Phiêu lưu, khoa học viễn tưởng",
  },
];

const demoComingSoon: Movie[] = [
  {
    _id: "5",
    title: "Frozen 3",
    poster: "/images/movies/default.jpg",
    genre: "Hoạt hình, âm nhạc",
  },
  {
    _id: "6",
    title: "Spider-Man 4",
    poster: "/images/movies/default.jpg",
    genre: "Siêu anh hùng",
  },
  {
    _id: "7",
    title: "Mission: Impossible",
    poster: "/images/movies/default.jpg",
    genre: "Hành động, giật gân",
  },
  {
    _id: "8",
    title: "Kung Fu Panda 5",
    poster: "/images/movies/default.jpg",
    genre: "Hoạt hình, hài hước",
  },
];

const demoPromotions: Promotion[] = [
  {
    _id: "1",
    title: "Mua 1 tặng 1 vé thứ 4",
    image: "/images/promotions/default.jpg",
    description: "Ưu đãi hấp dẫn dành cho khách hàng đặt vé online.",
  },
  {
    _id: "2",
    title: "Combo bắp nước siêu tiết kiệm",
    image: "/images/promotions/default.jpg",
    description: "Giảm giá combo khi đặt cùng vé xem phim.",
  },
  {
    _id: "3",
    title: "Thành viên mới nhận quà",
    image: "/images/promotions/default.jpg",
    description: "Đăng ký tài khoản để nhận ưu đãi chào mừng.",
  },
];

import { Link } from "react-router-dom";

function MovieCard({ movie, isComingSoon = false }: MovieCardProps) {
  return (
    <div className="movie-card">
      <div className="movie-thumb">
        <img
          src={movie.poster || "/images/movies/default.jpg"}
          alt={movie.title}
        />
      </div>

      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.genre || "Đang cập nhật thể loại"}</p>

        <div className="movie-actions">
        <Link
          to={`/movies/${movie._id}`}
          className="btn btn-small btn-outline"
        >
          Chi tiết
        </Link>

        {isComingSoon ? (
          <button className="btn btn-small btn-disabled">
            Sắp mở bán
          </button>
        ) : (
          <Link
            to={`/booking/${movie._id}`}
            className="btn btn-small btn-primary"
          >
            Đặt vé
          </Link>
        )}
        </div>
      </div>
    </div>
  );
}

function PromotionCard({ item }: PromotionCardProps) {
  return (
    <div className="promo-card">
      <img
        src={item.image || "/images/promotions/default.jpg"}
        alt={item.title}
      />

      <div className="promo-info">
        <h3>{item.title}</h3>
        <p>{item.description || "Ưu đãi hấp dẫn dành cho khách hàng."}</p>
      </div>
    </div>
  );
}

export default function HomePage({
  nowShowing = demoNowShowing,
  comingSoon = demoComingSoon,
  promotions = demoPromotions,
}: HomePageProps) {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const safeBanners = useMemo(() => {
    return banners.length > 0 ? banners : ["/images/banners/banner1.jpg"];
  }, []);

  const goPrev = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? safeBanners.length - 1 : prev - 1
    );
  };

  const goNext = () => {
    setCurrentSlide((prev) =>
      prev === safeBanners.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="page-home">
      <main>
        <section className="hero">
          <div className="container hero-content">
            <div className="hero-text">
              <span className="hero-badge">Đang hot</span>
              <h1>Trải nghiệm điện ảnh đỉnh cao tại Popcorn Cinema</h1>
              <p>Đặt vé nhanh, chọn ghế dễ, ưu đãi hấp dẫn mỗi tuần.</p>


              <div className="hero-buttons">
                <Link to="/movies" className="btn btn-primary">
                  Đặt vé ngay
                </Link>
                <Link to="/promotions" className="btn btn-outline">
                  Xem ưu đãi
                </Link>
              </div>
            </div>

            <div className="hero-slider">
              <div className="hero-slides">
                {safeBanners.map((banner, index) => (
                  <img
                    key={`${banner}-${index}`}
                    src={banner}
                    alt={`Banner ${index + 1}`}
                    className={`hero-slide ${
                      currentSlide === index ? "active" : ""
                    }`.trim()}
                  />
                ))}
              </div>

              <button className="hero-nav prev" type="button" onClick={goPrev}>
                &#10094;
              </button>

              <button className="hero-nav next" type="button" onClick={goNext}>
                &#10095;
              </button>

              <div className="hero-dots">
                {safeBanners.map((_, index) => (
                  <span
                    key={index}
                    className={`hero-dot ${
                      currentSlide === index ? "active" : ""
                    }`.trim()}
                    onClick={() => setCurrentSlide(index)}
                    onKeyDown={(event: React.KeyboardEvent<HTMLSpanElement>) => {
                      if (event.key === "Enter" || event.key === " ") {
                        setCurrentSlide(index);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="movie-section">
          <div className="container">
            <div className="section-header">
              <h2>Phim đang chiếu</h2>
              <Link to="/movies">Xem tất cả</Link>
            </div>

            <div className="movie-grid">
              {nowShowing.length > 0 ? (
                nowShowing.map((movie) => (
                  <React.Fragment key={movie._id}>
                    <MovieCard movie={movie} />
                  </React.Fragment>
                ))
              ) : (
                <p className="empty-text">Chưa có phim đang chiếu.</p>
              )}
            </div>
          </div>
        </section>

        <section className="movie-section alt-section">
          <div className="container">
            <div className="section-header">
              <h2>Phim sắp chiếu</h2>
              <Link to="/movies">Xem tất cả</Link>
            </div>

            <div className="movie-grid">
              {comingSoon.length > 0 ? (
                comingSoon.map((movie) => (
                  <React.Fragment key={movie._id}>
                    <MovieCard movie={movie} isComingSoon />
                  </React.Fragment>
                ))
              ) : (
                <p className="empty-text">Chưa có phim sắp chiếu.</p>
              )}
            </div>
          </div>
        </section>

        <section className="promotion-section">
          <div className="container">
            <div className="section-header">
              <h2>Khuyến mãi nổi bật</h2>
              <Link to="/promotions">Xem tất cả</Link>
            </div>

            <div className="promo-grid">
              {promotions.length > 0 ? (
                promotions.map((item) => (
                  <React.Fragment key={item._id}>
                    <PromotionCard item={item} />
                  </React.Fragment>
                ))
              ) : (
                <p className="empty-text">Hiện chưa có khuyến mãi nào.</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}