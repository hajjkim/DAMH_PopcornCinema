import { useState } from "react";
import "../../../styles/Admin/Showtimes/AdminShowtime.css";

export default function AdminShowtimeEdit() {
  const [form, setForm] = useState({
    movieTitle: "Thỏ ơi!!!",
    cinemaName: "CGV",
    roomName: "Phòng 1",
    showDate: "2025-06-01",
    startTime: "10:00",
    endTime: "12:00",
    format: "2D",
    status: "OPEN",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <section className="admin-page-section">
      <div className="admin-card">
        <form className="admin-form-grid">
          <div className="admin-form-group">
            <label>Tên phim</label>
            <input name="movieTitle" value={form.movieTitle} onChange={handleChange} />
          </div>

          <div className="admin-form-group">
            <label>Rạp</label>
            <input name="cinemaName" value={form.cinemaName} onChange={handleChange} />
          </div>

          <div className="admin-form-group">
            <label>Phòng</label>
            <input name="roomName" value={form.roomName} onChange={handleChange} />
          </div>

          <div className="admin-form-group">
            <label>Ngày</label>
            <input type="date" name="showDate" value={form.showDate} onChange={handleChange} />
          </div>

          <div className="admin-form-group">
            <label>Giờ bắt đầu</label>
            <input type="time" name="startTime" value={form.startTime} onChange={handleChange} />
          </div>

          <div className="admin-form-group">
            <label>Giờ kết thúc</label>
            <input type="time" name="endTime" value={form.endTime} onChange={handleChange} />
          </div>

          <div className="admin-form-group">
            <label>Format</label>
            <input name="format" value={form.format} onChange={handleChange} />
          </div>

          <div className="admin-form-group">
            <label>Trạng thái</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="OPEN">Đang mở bán</option>
              <option value="CLOSED">Đã đóng</option>
            </select>
          </div>

          <div className="admin-form-actions">
            <button className="admin-btn admin-btn-outline">Hủy</button>
            <button className="admin-btn admin-btn-primary">Cập nhật</button>
          </div>
        </form>
      </div>
    </section>
  );
}