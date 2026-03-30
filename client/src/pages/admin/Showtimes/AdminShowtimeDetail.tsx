import { Link } from "react-router-dom";
import "../../../styles/Admin/Showtimes/AdminShowtime.css";

export default function AdminShowtimeDetail() {
  const s = {
    id: 1,
    movieTitle: "Thỏ ơi!!!",
    cinemaName: "CGV",
    roomName: "Phòng 1",
    showDate: "2025-06-01",
    startTime: "10:00",
    endTime: "12:00",
    format: "2D",
    status: "OPEN",
  };

  return (
    <section className="admin-page-section">
      <div className="admin-page-actions">
        <Link to="/admin/showtimes" className="admin-btn admin-btn-outline">← Quay lại</Link>
        <Link to={`/admin/showtimes/${s.id}/edit`} className="admin-btn admin-btn-primary">Sửa</Link>
      </div>

      <div className="admin-card">
        <div className="detail-grid">
          <p><b>Phim:</b> {s.movieTitle}</p>
          <p><b>Rạp:</b> {s.cinemaName}</p>
          <p><b>Phòng:</b> {s.roomName}</p>
          <p><b>Ngày:</b> {s.showDate}</p>
          <p><b>Giờ:</b> {s.startTime} - {s.endTime}</p>
          <p><b>Format:</b> {s.format}</p>
          <p>
            <b>Trạng thái:</b>{" "}
            <span className="admin-badge admin-badge-success">Đang mở bán</span>
          </p>
        </div>
      </div>
    </section>
  );
}