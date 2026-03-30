import { useState } from "react";
import "../../../styles/Admin/Showtimes/AdminShowtime.css";

export default function AdminShowtimeCreate() {
  const [form, setForm] = useState({
    movieTitle: "",
    cinemaName: "",
    roomName: "",
    showDate: "",
    startTime: "",
    endTime: "",
    format: "",
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
            <input name="movieTitle" onChange={handleChange} required />
          </div>

          <div className="admin-form-group">
            <label>Rạp</label>
            <input name="cinemaName" onChange={handleChange} required />
          </div>

          <div className="admin-form-group">
            <label>Phòng</label>
            <input name="roomName" onChange={handleChange} required />
          </div>

          <div className="admin-form-group">
            <label>Ngày chiếu</label>
            <input type="date" name="showDate" onChange={handleChange} required />
          </div>

          <div className="admin-form-group">
            <label>Giờ bắt đầu</label>
            <input type="time" name="startTime" onChange={handleChange} required />
          </div>

          <div className="admin-form-group">
            <label>Giờ kết thúc</label>
            <input type="time" name="endTime" onChange={handleChange} required />
          </div>

          <div className="admin-form-group">
            <label>Định dạng</label>
            <input name="format" placeholder="2D / 3D" onChange={handleChange} />
          </div>

          <div className="admin-form-group">
            <label>Trạng thái</label>
            <select name="status" onChange={handleChange}>
              <option value="OPEN">Đang mở bán</option>
              <option value="CLOSED">Đã đóng</option>
            </select>
          </div>

          <div className="admin-form-actions">
            <button className="admin-btn admin-btn-outline">Hủy</button>
            <button className="admin-btn admin-btn-primary">Lưu</button>
          </div>
        </form>
      </div>
    </section>
  );
}