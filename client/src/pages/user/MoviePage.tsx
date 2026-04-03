import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/MoviePage.css";
import { getMovies, type Movie } from "../../services/movie.api";

type TabType = "nowShowing" | "comingSoon";

export default function MoviePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("nowShowing");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        const data = await getMovies();
        setMovies(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load movies";
        setError(message);
        console.error("Error loading movies:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, []);

  const filteredMovies = movies.filter((movie) => {
    const status = movie.status || "NOW_SHOWING";
    if (activeTab === "nowShowing") return status === "NOW_SHOWING";
    return status === "COMING_SOON" || status === "ENDED";
  });

  return (
    <div className="movie-page">
      <div className="movie-page-container">
        <div className="movie-page-header">
          <h1>PHIM</h1>

          <div className="movie-tabs">
            <button
              type="button"
              className={activeTab === "nowShowing" ? "movie-tab active" : "movie-tab"}
              onClick={() => setActiveTab("nowShowing")}
            >
              Đang Chiếu
            </button>

            <button
              type="button"
              className={activeTab === "comingSoon" ? "movie-tab active" : "movie-tab"}
              onClick={() => setActiveTab("comingSoon")}
            >
              Sắp Chiếu
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="movie-loading">
            <p>Đang tải phim...</p>
          </div>
        )}

        {error && (
          <div className="movie-error">
            <p>Lỗi: {error}</p>
          </div>
        )}

        {!isLoading && !error && filteredMovies.length === 0 && (
          <div className="movie-empty">
            <p>Không có phim nào</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="movie-grid-page">
          {filteredMovies.map((movie) => (
              <div className="movie-poster-card" key={movie._id}>
  
                {/* DETAIL */}
                <Link to={`/movies/${movie._id}`} className="movie-card-link">
                  <img src={movie.poster || "/images/logo/logo.png"} alt={movie.title} />
                </Link>

                <h3>{movie.title}</h3>

              {/* BUTTON */}
              { (movie.status || "NOW_SHOWING") === "NOW_SHOWING" ? (
                <button
                  type="button"
                  className="movie-book-btn"
                  onClick={() =>
                    navigate("/booking", {
                      state: {
                        movieId: movie._id,
                        movieTitle: movie.title,
                        poster: movie.poster,
                      },
                    })
                  }
                >
                  Đặt vé
                </button>
              ) : (
                <button type="button" className="coming-btn" disabled>
                  Sắp ra mắt
                </button>
              )}
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}
