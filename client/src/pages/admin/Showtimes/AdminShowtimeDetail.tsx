import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "../../../styles/Admin/Showtimes/AdminShowtime.css";
import { showtimeAPI } from "../../../services/admin.api";

export default function AdminShowtimeDetail() {
  const { id } = useParams<{ id: string }>();
  const [showtime, setShowtime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShowtime = async () => {
      if (!id) return;
      try {
        const data = await showtimeAPI.getById(id);
        setShowtime(data);
      } catch (err: any) {
        console.error("Error fetching showtime:", err);
        setError(err.message || "Không thể tải dữ liệu suất chiếu");
      } finally {
        setLoading(false);
      }
    };

    fetchShowtime();
  }, [id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return "admin-badge-success";
      case "CLOSED":
        return "admin-badge-warning";
      case "CANCELLED":
        return "admin-badge-danger";
      default:
        return "admin-badge-default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "OPEN":
        return "Đang mở bán";
      case "CLOSED":
        return "Đã đóng";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
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

  if (!showtime) {
    return (
      <section className="admin-page-section">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Suất chiếu không tìm thấy</p>
        </div>
      </section>
    );
  }

  const startDate = new Date(showtime.startTime);
  const endDate = new Date(showtime.endTime);
  const movieTitle = typeof showtime.movieId === "object" ? showtime.movieId.title : showtime.movie?.title;
  const auditoriumName = typeof showtime.auditoriumId === "object" ? showtime.auditoriumId.name : showtime.auditorium?.name;
  const cinemaName = typeof showtime.auditoriumId === "object" ? showtime.auditoriumId.cinemaId?.name : showtime.auditorium?.cinemaId?.name;

  return (
    <section className="admin-page-section">
      <div className="admin-page-actions">
        <Link to="/admin/showtimes" className="admin-btn admin-btn-outline">← Quay lại</Link>
        <Link to={`/admin/showtimes/${id}/edit`} className="admin-btn admin-btn-primary">Sửa</Link>
      </div>

      <div className="admin-card">
        <div className="detail-grid">
          <p><b>Phim:</b> {movieTitle || "N/A"}</p>
          <p><b>Rạp:</b> {cinemaName || "N/A"}</p>
          <p><b>Phòng:</b> {auditoriumName || "N/A"}</p>
          <p><b>Ngày:</b> {startDate.toLocaleDateString("vi-VN")}</p>
          <p><b>Giờ:</b> {startDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - {endDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</p>
          <p><b>Giá:</b> {showtime.basePrice?.toLocaleString("vi-VN")} ₫</p>
          <p>
            <b>Trạng thái:</b>{" "}
            <span className={`admin-badge ${getStatusBadge(showtime.status)}`}>
              {getStatusText(showtime.status)}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}