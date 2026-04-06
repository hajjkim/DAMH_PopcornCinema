import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../styles/Admin/Showtimes/AdminShowtime.css";
import { showtimeAPI } from "../../../services/admin.api";

type Showtime = {
  _id: string;
  movieId: string | { _id: string; title: string };
  auditoriumId: string | { _id: string; name: string; cinemaId?: { _id: string; name: string } };
  movie?: { title: string };
  auditorium?: { name: string; cinemaId?: { name: string } };
  startTime: string;
  endTime: string;
  format?: string;
  status: "OPEN" | "CLOSED";
};

export default function AdminShowtimes() {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [filteredShowtimes, setFilteredShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterMovie, setFilterMovie] = useState("");
  const [filterCinema, setFilterCinema] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        setLoading(true);
        const response = await showtimeAPI.getAll();
        setShowtimes(response || []);
        setFilteredShowtimes(response || []);
      } catch (err: any) {
        console.error("Error fetching showtimes:", err);
        setError(err.message || "Failed to load showtimes");
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, []);

  useEffect(() => {
    let filtered = showtimes;

    // Filter by movie
    if (filterMovie) {
      filtered = filtered.filter((s) => {
        const movieTitle = typeof s.movieId === "object" ? s.movieId?.title : s.movie?.title || s.movieId;
        return (movieTitle || "").toString().toLowerCase().includes(filterMovie.toLowerCase());
      });
    }

    // Filter by cinema
    if (filterCinema) {
      filtered = filtered.filter((s) => {
        const cinemaName = typeof s.auditoriumId === "object"
          ? s.auditoriumId?.cinemaId?.name
          : s.auditorium?.cinemaId?.name;
        return (cinemaName || "").toLowerCase().includes(filterCinema.toLowerCase());
      });
    }

    // Filter by date
    if (filterDate) {
      const filterDateStr = new Date(filterDate).toLocaleDateString("vi-VN");
      filtered = filtered.filter((s) => 
        new Date(s.startTime).toLocaleDateString("vi-VN") === filterDateStr
      );
    }

    // Sort: Currently showing first, then by newest showtimes
    const now = new Date();
    filtered.sort((a, b) => {
      const aStart = new Date(a.startTime);
      const aEnd = new Date(a.endTime);
      const bStart = new Date(b.startTime);
      const bEnd = new Date(b.endTime);

      // Check if currently showing
      const aIsShowing = aStart <= now && now <= aEnd;
      const bIsShowing = bStart <= now && now <= bEnd;

      // Currently showing comes first
      if (aIsShowing && !bIsShowing) return -1;
      if (!aIsShowing && bIsShowing) return 1;

      // If both showing or both not showing, sort by newest (startTime descending)
      return bStart.getTime() - aStart.getTime();
    });

    setFilteredShowtimes(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filterMovie, filterCinema, filterDate, showtimes]);

  // Pagination logic
  const totalPages = Math.ceil(filteredShowtimes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedShowtimes = filteredShowtimes.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn chắc chắn muốn xóa suất chiếu này?")) {
      try {
        await showtimeAPI.delete(id);
        setShowtimes(showtimes.filter((s) => s._id !== id));
        alert("Xóa suất chiếu thành công!");
      } catch (err: any) {
        alert("Lỗi: " + (err.message || "Không thể xóa suất chiếu"));
      }
    }
  };

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

  return (
    <section className="admin-page-section">
      {/* ACTION */}
      <div className="admin-page-actions">
        <Link to="/admin/showtimes/create" className="admin-btn admin-btn-primary">
          + Thêm suất chiếu
        </Link>
      </div>

      {/* FILTER */}
      <div className="admin-card">
        <div className="admin-filter-form">
          <div className="admin-form-group">
            <label>Phim</label>
            <input
              placeholder="Nhập tên phim..."
              value={filterMovie}
              onChange={(e) => setFilterMovie(e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label>Rạp</label>
            <input
              placeholder="Nhập tên rạp..."
              value={filterCinema}
              onChange={(e) => setFilterCinema(e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label>Ngày chiếu</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Phim</th>
              <th>Rạp</th>
              <th>Phòng</th>
              <th>Ngày</th>
              <th>Giờ</th>
              <th>Format</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {paginatedShowtimes.map((s) => {
              const getMovieTitle = () => {
                if (typeof s.movieId === "object" && s.movieId?.title) return s.movieId.title;
                if (s.movie?.title) return s.movie.title;
                return "Unknown Movie";
              };

              const getCinemaName = () => {
                if (typeof s.auditoriumId === "object" && s.auditoriumId?.cinemaId?.name) 
                  return s.auditoriumId.cinemaId.name;
                if (s.auditorium?.cinemaId?.name) return s.auditorium.cinemaId.name;
                return "N/A";
              };

              const getAuditoriumName = () => {
                if (typeof s.auditoriumId === "object" && s.auditoriumId?.name) return s.auditoriumId.name;
                if (s.auditorium?.name) return s.auditorium.name;
                return typeof s.auditoriumId === "string" ? s.auditoriumId : "Unknown";
              };

              // Check if currently showing
              const now = new Date();
              const startTime = new Date(s.startTime);
              const endTime = new Date(s.endTime);
              const isCurrentlyShowing = startTime <= now && now <= endTime;

              return (
                <tr key={s._id} style={isCurrentlyShowing ? { backgroundColor: "#fff3cd" } : {}}>
                  <td>{s._id}</td>
                  <td>{getMovieTitle()}</td>
                  <td>{getCinemaName()}</td>
                  <td>{getAuditoriumName()}</td>
                  <td>{new Date(s.startTime).toLocaleDateString("vi-VN")}</td>
                  <td>{new Date(s.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - {new Date(s.endTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</td>
                  <td>{s.format || "2D"}</td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      {isCurrentlyShowing && (
                        <span className="admin-badge admin-badge-warning">
                          🔴 Đang chiếu
                        </span>
                      )}
                      <span className={`admin-badge ${s.status === "OPEN" ? "admin-badge-success" : "admin-badge-danger"}`}>
                        {s.status === "OPEN" ? "Đang mở bán" : "Đã đóng"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <Link to={`/admin/showtimes/${s._id}`} className="admin-btn admin-btn-sm admin-btn-outline">Chi tiết</Link>
                      <Link to={`/admin/showtimes/${s._id}/edit`} className="admin-btn admin-btn-sm admin-btn-outline">Sửa</Link>
                      <button
                        className="admin-btn admin-btn-sm admin-btn-danger"
                        onClick={() => handleDelete(s._id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px",
          borderTop: "1px solid #ddd",
        }}>
          <span>
            Hiển thị {filteredShowtimes.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + itemsPerPage, filteredShowtimes.length)} trên {filteredShowtimes.length} suất chiếu
          </span>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="admin-btn admin-btn-outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              ← Trước
            </button>

            <span style={{ padding: "8px 12px", display: "flex", alignItems: "center" }}>
              Trang {currentPage} / {totalPages || 1}
            </span>

            <button
              className="admin-btn admin-btn-outline"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Sau →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}