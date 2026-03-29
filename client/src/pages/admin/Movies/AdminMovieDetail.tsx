import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/Admin/Movies/AdminMovies.css";

export default function AdminMovieDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  // 👉 mock data (sau này thay API)
  const movie = {
    id,
    title: "Thỏ ơi!!!",
    genre: "Hoạt hình",
    duration: 120,
    release_date: "2025-06-01",
    age_rating: "P",
    director: "ABC",
    actors: "XYZ",
    language: "Tiếng Việt",
    subtitle: "English",
    trailer_url: "https://youtube.com",
    status: "NOW_SHOWING",
    description: "Phim rất hay...",
    poster_url: "/images/movies/phim1.jpg",
  };

  return (
    <section className="admin-page-section">
      
      {/* ACTION */}
      <div className="admin-page-actions">
        <button
          className="admin-btn admin-btn-outline"
          onClick={() => navigate("/admin/movies")}
        >
          ← Quay lại
        </button>

        <button
          className="admin-btn admin-btn-primary"
          onClick={() => navigate(`/admin/movies/${movie.id}/edit`)}
        >
          Sửa phim
        </button>
      </div>

      {/* CARD */}
      <div className="admin-card movie-detail-layout">
        
        {/* POSTER */}
        <div className="movie-detail-poster">
          <img
            src={movie.poster_url || "/images/movies/default.jpg"}
            alt={movie.title}
          />
        </div>

        {/* INFO */}
        <div className="movie-detail-info">
          <h2>{movie.title}</h2>

          <p><strong>Thể loại:</strong> {movie.genre}</p>
          <p><strong>Thời lượng:</strong> {movie.duration} phút</p>
          <p><strong>Ngày khởi chiếu:</strong> {movie.release_date}</p>
          <p><strong>Phân loại:</strong> {movie.age_rating}</p>
          <p><strong>Đạo diễn:</strong> {movie.director}</p>
          <p><strong>Diễn viên:</strong> {movie.actors}</p>
          <p><strong>Ngôn ngữ:</strong> {movie.language}</p>
          <p><strong>Phụ đề:</strong> {movie.subtitle}</p>

          {/* <p>
            <strong>Trailer:</strong>{" "}
            <a href={movie.trailer_url} target="_blank">
              {movie.trailer_url}
            </a>
          </p> */}

          <p>
            <strong>Trạng thái:</strong>{" "}
            {movie.status === "NOW_SHOWING" ? (
              <span className="admin-badge admin-badge-success">
                Đang chiếu
              </span>
            ) : (
              <span className="admin-badge admin-badge-warning">
                Sắp chiếu
              </span>
            )}
          </p>

          {/* DESCRIPTION */}
          <div className="movie-detail-description">
            <h3>Mô tả</h3>
            <p>{movie.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}