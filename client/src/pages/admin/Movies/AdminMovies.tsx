import { useState, useEffect } from "react";
import "../../../styles/Admin/Movies/AdminMovies.css";
import { Link } from "react-router-dom";
import { movieAPI } from "../../../services/movie.api";

type Movie = {
  _id: string;
  title: string;
  genres: string[];
  duration: number;
  releaseDate: string;
  status: "NOW_SHOWING" | "COMING_SOON" | "ENDED";
};

export default function AdminMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await movieAPI.getAll();
        setMovies(response || []);
      } catch (err: any) {
        console.error("Error fetching movies:", err);
        setError(err.message || "Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa phim này?")) {
      try {
        await movieAPI.delete(id);
        setMovies(movies.filter((m) => m._id !== id));
        alert("Xóa phim thành công!");
      } catch (err: any) {
        alert("Lỗi: " + (err.message || "Không thể xóa phim"));
      }
    }
  };

  const filtered = movies.filter((m) => {
    return (
      m.title.toLowerCase().includes(keyword.toLowerCase()) &&
      (status ? m.status === status : true)
    );
  });

  return (
    <section className="admin-page-section">
      {loading && <div style={{ textAlign: "center", padding: "40px" }}><p>Đang tải dữ liệu...</p></div>}
      {error && <div style={{ textAlign: "center", padding: "40px", color: "red" }}><p>Lỗi: {error}</p></div>}
      
      {!loading && !error && (
        <>
          {/* ACTION */}
          <div className="admin-page-actions">
            <Link to="/admin/movies/create" className="admin-btn admin-btn-primary">
              + Thêm phim
            </Link>
          </div>

          {/* FILTER */}
          <div className="admin-card">
            <div className="admin-filter-form">
              <div className="admin-form-group">
                <label>Từ khóa</label>
                <input
                  type="text"
                  placeholder="Nhập tên phim..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>Trạng thái</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="">Tất cả</option>
                  <option value="NOW_SHOWING">Đang chiếu</option>
                  <option value="COMING_SOON">Sắp chiếu</option>
                </select>
              </div>

              <div className="admin-filter-actions">
                <button className="admin-btn admin-btn-outline" onClick={() => {}}>
                  Lọc
                </button>
                <button
                  className="admin-btn admin-btn-outline"
                  onClick={() => {
                    setKeyword("");
                    setStatus("");
                  }}
                >
                  Đặt lại
                </button>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="admin-card">
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên phim</th>
                    <th>Thể loại</th>
                    <th>Thời lượng</th>
                    <th>Ngày chiếu</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((movie) => (
                      <tr key={movie._id}>
                        <td>{movie._id}</td>
                        <td><strong>{movie.title}</strong></td>
                        <td>{movie.genres?.join(", ")}</td>
                        <td>{movie.duration} phút</td>
                        <td>{new Date(movie.releaseDate).toLocaleDateString("vi-VN")}</td>
                        <td>
                          {movie.status === "NOW_SHOWING" ? (
                            <span className="admin-badge admin-badge-success">
                              Đang chiếu
                            </span>
                          ) : (
                            <span className="admin-badge admin-badge-danger">
                              Sắp chiếu
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="admin-table-actions">
                        
                        <Link
                          to={`/admin/movies/${movie._id}`}
                          className="admin-btn admin-btn-sm admin-btn-outline"
                        >
                          Chi tiết
                        </Link>

                        <Link
                          to={`/admin/movies/${movie._id}/edit`}
                          className="admin-btn admin-btn-sm admin-btn-outline"
                        >
                          Sửa
                        </Link>

                        <button
                          className="admin-btn admin-btn-sm admin-btn-danger"
                          onClick={() => handleDelete(movie._id)}
                        >
                          Xóa
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="admin-empty">
                    Không có phim
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}
    </section>
  );
}