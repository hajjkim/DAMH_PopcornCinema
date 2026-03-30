import { Link } from "react-router-dom";
import "../../../styles/Admin/Showtimes/AdminShowtime.css";

const showtimes = [
  {
    id: 1,
    movieTitle: "Thỏ ơi!!!",
    cinemaName: "CGV Vincom",
    roomName: "Phòng 1",
    showDate: "2025-06-01",
    startTime: "10:00",
    endTime: "12:00",
    format: "2D",
    status: "OPEN",
  },
];

export default function AdminShowtimes() {
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
            <input placeholder="Nhập tên phim..." />
          </div>

          <div className="admin-form-group">
            <label>Rạp</label>
            <input placeholder="Nhập tên rạp..." />
          </div>

          <div className="admin-form-group">
            <label>Ngày chiếu</label>
            <input type="date" />
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
            {showtimes.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.movieTitle}</td>
                <td>{s.cinemaName}</td>
                <td>{s.roomName}</td>
                <td>{s.showDate}</td>
                <td>{s.startTime} - {s.endTime}</td>
                <td>{s.format}</td>
                <td>
                  <span className={`admin-badge ${s.status === "OPEN" ? "admin-badge-success" : "admin-badge-danger"}`}>
                    {s.status === "OPEN" ? "Đang mở bán" : "Đã đóng"}
                  </span>
                </td>
                <td>
                  <div className="admin-table-actions">
                    <Link to={`/admin/showtimes/${s.id}`} className="admin-btn admin-btn-sm admin-btn-outline">Chi tiết</Link>
                    <Link to={`/admin/showtimes/${s.id}/edit`} className="admin-btn admin-btn-sm admin-btn-outline">Sửa</Link>
                    <button className="admin-btn admin-btn-sm admin-btn-danger">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}