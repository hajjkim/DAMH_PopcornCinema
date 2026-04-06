import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/MovieDetailPage.css";
import { getMovieById, type Movie } from "../../services/movie.api";
import { getShowtimes, type Showtime } from "../../services/showtime.api";

const formatDate = (value?: string | Date) => {
  if (!value) return "--/--/----";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("vi-VN");
};

const formatActors = (actors?: string[] | string) => {
  if (Array.isArray(actors)) return actors.join(", ");
  if (typeof actors === "string") {
    return actors.includes(",")
      ? actors
      : actors.replace(/([a-zà-ỹ])([A-ZÀ-Ỹ])/g, "$1, $2");
  }
  return "Đang cập nhật";
};

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!id) {
          setError("Không tìm thấy ID phim");
          return;
        }
        setIsLoading(true);
        const movieData = await getMovieById(id);
        setMovie(movieData);

        const showtimesData = await getShowtimes();
        setShowtimes(showtimesData);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Có lỗi xảy ra";
        setError(message);
        console.error("Error loading data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="movie-detail-page">
        <div className="movie-detail-container">
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="movie-detail-page">
        <div className="movie-detail-container">
          <div className="movie-not-found">
            <h2>{error || "Không tìm thấy phim"}</h2>
            <Link to="/movies" className="movie-back-btn">
              Quay lại trang phim
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const movieShowtimes = showtimes.filter((item) => item.movieId === movie._id);

  return (
    <div className="movie-detail-page">
      <div className="movie-detail-container">
        <div className="movie-detail-breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span>/</span>
          <Link to="/movies">Phim</Link>
          <span>/</span>
          <span>{movie.title}</span>
        </div>

        <div className="movie-detail-card">
          <div className="movie-detail-poster">
            <img src={movie.poster} alt={movie.title} />
          </div>

          <div className="movie-detail-content">
            <div className="movie-detail-top">
              <span
                className={`movie-status-badge ${
                  (movie.status || "NOW_SHOWING") === "NOW_SHOWING"
                    ? "showing"
                    : "coming"
                }`}
              >
                {(movie.status || "NOW_SHOWING") === "NOW_SHOWING"
                  ? "Đang chiếu"
                  : "Sắp chiếu"}
              </span>

              <span className="movie-rating-badge">{movie.rating}</span>
            </div>

            <h1>{movie.title}</h1>

            <div className="movie-info-list">
              <p>
                <strong>Thể loại:</strong> {(movie.genres || []).join(", ")}
              </p>
              <p>
                <strong>Thời lượng:</strong>{" "}
                {movie.duration ? `${movie.duration} phút` : "Đang cập nhật"}
              </p>
              <p>
                <strong>Khởi chiếu:</strong> {formatDate(movie.releaseDate as any)}
              </p>
              <p>
                <strong>Đạo diễn:</strong> {movie.director || "Đang cập nhật"}
              </p>
              <p>
                <strong>Diễn viên:</strong> {formatActors(movie.actors as any)}
              </p>
              <p>
                <strong>Ngôn ngữ:</strong> {movie.language || "Đang cập nhật"}
              </p>
            </div>

            <div className="movie-description-box">
              <h3>Nội dung phim</h3>
              <p>{movie.description}</p>
            </div>

            <div className="movie-detail-actions">
              {(movie.status || "NOW_SHOWING") === "NOW_SHOWING" ? (
                <button
                  type="button"
                  className="movie-book-btn"
                  onClick={() =>
                    navigate("/booking", {
                      state: {
                        movieId: movie._id,
                        movieTitle: movie.title,
                        poster: movie.poster,
                        date: movieShowtimes[0]?.date,
                        time: movieShowtimes[0]?.time,
                        cinema: movieShowtimes[0]?.cinema,
                        showtimeId: movieShowtimes[0]?._id,
                      },
                    })
                  }
                >
                  Đặt vé ngay
                </button>
              ) : (
                <button type="button" className="movie-coming-btn" disabled>
                  Sắp ra mắt
                </button>
              )}

              <Link to="/movies" className="movie-back-btn">
                Quay lại
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
