import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/Admin/Movies/AdminMovies.css";
import { movieAPI } from "../../../services/admin.api";

export default function AdminMovieDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      try {
        const data = await movieAPI.getById(id);
        setMovie(data);
      } catch (err: any) {
        console.error("Error fetching movie:", err);
        setError(err.message || "Không thể tải dữ liệu phim");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <section className="admin-page-section">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Đang tải dữ liệu...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="admin-page-section">
        <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
          <p>Lỗi: {error}</p>
        </div>
      </section>
    );
  }

  if (!movie) {
    return (
      <section className="admin-page-section">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Phim không tìm thấy</p>
        </div>
      </section>
    );
  }

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
          onClick={() => navigate(`/admin/movies/${id}/edit`)}
        >
          Sửa phim
        </button>
      </div>

      {/* CARD */}
      <div className="admin-card movie-detail-layout">
        
        {/* POSTER */}
        <div className="movie-detail-poster">
          <img
            src={movie.poster || "/images/movies/default.jpg"}
            alt={movie.title}
          />
        </div>

        {/* INFO */}
        <div className="movie-detail-info">
          <h2>{movie.title}</h2>

          <p><strong>Thể loại:</strong> {movie.genres?.join(", ")}</p>
          <p><strong>Thời lượng:</strong> {movie.duration} phút</p>
          <p><strong>Ngày khởi chiếu:</strong> {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString("vi-VN") : "N/A"}</p>
          <p><strong>Phân loại:</strong> {movie.rating}</p>
          <p><strong>Đạo diễn:</strong> {movie.director}</p>
          <p><strong>Diễn viên:</strong> {movie.actors?.join(", ")}</p>
          <p><strong>Ngôn ngữ:</strong> {movie.language}</p>
          <p><strong>Phụ đề:</strong> {movie.subtitle}</p>
          <p><strong>Trailer URL:</strong> {movie.trailerUrl ? <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer">{movie.trailerUrl}</a> : "N/A"}</p>

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