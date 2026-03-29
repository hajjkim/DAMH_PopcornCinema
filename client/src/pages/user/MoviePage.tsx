import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/MoviePage.css";
import { movieList } from "../../data/movies";

type TabType = "nowShowing" | "comingSoon";

export default function MoviePage() {
  const [activeTab, setActiveTab] = useState<TabType>("nowShowing");

  const filteredMovies = movieList.filter((movie) => movie.status === activeTab);

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

        <div className="movie-grid-page">
          {filteredMovies.map((movie) => (
            <div className="movie-poster-card" key={movie.id}>
  
              {/* DETAIL */}
              <Link to={`/movies/${movie.id}`} className="movie-card-link">
                <img src={movie.poster} alt={movie.title} />
              </Link>

              <h3>{movie.title}</h3>

              {/* BUTTON */}
              {movie.status === "nowShowing" ? (
                <Link
                  to={`/booking/${movie.id}`}
                  className="movie-book-btn"
                >
                  Đặt vé
                </Link>
              ) : (
                <button type="button" className="coming-btn" disabled>
                  Sắp ra mắt
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}