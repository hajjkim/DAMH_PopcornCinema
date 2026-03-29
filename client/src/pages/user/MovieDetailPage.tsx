import { Link, useNavigate, useParams } from "react-router-dom";
import "../../styles/MovieDetailPage.css";
import { movieList } from "../../data/movies";
import { showtimeList } from "../../data/showtimes";

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const movie = movieList.find((item) => item.id === id);

  const movieShowtimes = showtimeList.filter(
    (item) => item.movieTitle === movie?.title
  );

  if (!movie) {
    return (
      <div className="movie-detail-page">
        <div className="movie-detail-container">
          <div className="movie-not-found">
            <h2>Không tìm thấy phim</h2>
            <Link to="/movie" className="movie-back-btn">
              Quay lại trang phim
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-detail-page">
      <div className="movie-detail-container">
        <div className="movie-detail-breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span>/</span>
          <Link to="/movie">Phim</Link>
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
                  movie.status === "nowShowing" ? "showing" : "coming"
                }`}
              >
                {movie.status === "nowShowing" ? "Đang chiếu" : "Sắp chiếu"}
              </span>

              <span className="movie-rating-badge">{movie.rating}</span>
            </div>

            <h1>{movie.title}</h1>

            <div className="movie-info-list">
              <p>
                <strong>Thể loại:</strong> {movie.genre}
              </p>
              <p>
                <strong>Thời lượng:</strong> {movie.duration}
              </p>
              <p>
                <strong>Khởi chiếu:</strong> {movie.releaseDate}
              </p>
              <p>
                <strong>Đạo diễn:</strong> {movie.director}
              </p>
              <p>
                <strong>Diễn viên:</strong> {movie.actors}
              </p>
              <p>
                <strong>Ngôn ngữ:</strong> {movie.language}
              </p>
            </div>

            <div className="movie-description-box">
              <h3>Nội dung phim</h3>
              <p>{movie.description}</p>
            </div>

            <div className="movie-detail-actions">
              {movie.status === "nowShowing" ? (
                <button
                type="button"
                className="movie-book-btn"
                onClick={() =>
                    navigate("/booking", {
                    state: {
                        movieTitle: movie.title,
                        poster: movie.poster,
                        date: movieShowtimes[0]?.date,
                        time: movieShowtimes[0]?.times[0],
                        room: movieShowtimes[0]?.room,
                        format: movieShowtimes[0]?.format,
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

              <Link to="/movie" className="movie-back-btn">
                Quay lại
              </Link>
            </div>
          </div>
        </div>

        {/* <div className="movie-showtime-section">
          <h2>Lịch chiếu nhanh</h2>

          {movie.status === "nowShowing" && movieShowtimes.length > 0 ? (
            <div className="movie-showtime-list">
              {movieShowtimes.map((showtime) => (
                <div className="movie-showtime-card" key={showtime.id}>
                  <div className="movie-showtime-meta">
                    <span>{showtime.date}</span>
                    <span>{showtime.room}</span>
                    <span>{showtime.format}</span>
                  </div>

                  <div className="movie-showtime-times">
                    {showtime.times.map((time) => (
                      <button
                        key={time}
                        type="button"
                        className="movie-showtime-time"
                        onClick={() =>
                          navigate("/booking", {
                            state: {
                              movieTitle: movie.title,
                              poster: movie.poster,
                              date: showtime.date,
                              time: time,
                              room: showtime.room,
                              format: showtime.format,
                            },
                          })
                        }
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="movie-showtime-empty">
              {movie.status === "comingSoon"
                ? "Phim sắp chiếu, lịch chiếu sẽ được cập nhật sớm."
                : "Hiện chưa có lịch chiếu cho phim này."}
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}