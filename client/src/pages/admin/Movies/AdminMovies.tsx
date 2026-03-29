import { useState } from "react";
import "../../../styles/Admin/Movies/AdminMovies.css";
import { Link } from "react-router-dom";
type Movie = {
  id: number;
  title: string;
  genre: string;
  duration: number;
  releaseDate: string;
  status: "ACTIVE" | "INACTIVE";
};

const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Thỏ ơi!!!",
    genre: "Hoạt hình",
    duration: 120,
    releaseDate: "2025-06-01",
    status: "ACTIVE",
  },
  {
    id: 2,
    title: "Nhà Ba Tôi Một Phòng",
    genre: "Hài",
    duration: 110,
    releaseDate: "2025-06-10",
    status: "INACTIVE",
  },
];

export default function AdminMovies() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
    const handleDelete = (id: number) => {
      if (confirm("Bạn có chắc muốn xóa phim này?")) {
        console.log("Delete movie:", id);
      }
    };
  const filtered = mockMovies.filter((m) => {
    return (
      m.title.toLowerCase().includes(keyword.toLowerCase()) &&
      (status ? m.status === status : true)
    );
  });

  return (
    <section className="admin-page-section">
      {/* ACTION */}
      <div className="admin-page-actions">
        <Link
  to="/admin/movies/create"
  className="admin-btn admin-btn-primary"
>
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
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="ACTIVE">Đang chiếu</option>
              <option value="INACTIVE">Ngừng chiếu</option>
            </select>
          </div>

          <div className="admin-filter-actions">
            <button className="admin-btn admin-btn-primary">
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
                  <tr key={movie.id}>
                    <td>{movie.id}</td>
                    <td><strong>{movie.title}</strong></td>
                    <td>{movie.genre}</td>
                    <td>{movie.duration} phút</td>
                    <td>{movie.releaseDate}</td>
                    <td>
                      {movie.status === "ACTIVE" ? (
                        <span className="admin-badge admin-badge-success">
                          Đang chiếu
                        </span>
                      ) : (
                        <span className="admin-badge admin-badge-danger">
                          Ngừng chiếu
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        
                        <Link
                          to={`/admin/movies/${movie.id}`}
                          className="admin-btn admin-btn-sm admin-btn-outline"
                        >
                          Chi tiết
                        </Link>

                        <Link
                          to={`/admin/movies/${movie.id}/edit`}
                          className="admin-btn admin-btn-sm admin-btn-outline"
                        >
                          Sửa
                        </Link>

                        <button
                          className="admin-btn admin-btn-sm admin-btn-danger"
                          onClick={() => handleDelete(movie.id)}
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
    </section>
  );
}