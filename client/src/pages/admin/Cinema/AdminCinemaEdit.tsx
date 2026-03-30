import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/Admin/Cinemas/AdminCinemas.css";
export default function AdminCinemaEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "CGV Vincom",
    city: "HCM",
    address: "Quận 1",
    totalRooms: 5,
    phone: "0123456789",
    status: "ACTIVE",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <section className="admin-page-section">
      <div className="admin-card">
        <form className="admin-form-grid">

          <div className="admin-form-group">
            <label>Tên rạp</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="admin-form-group">
            <label>Thành phố</label>
            <input name="city" value={form.city} onChange={handleChange} />
          </div>

          <div className="admin-form-group admin-form-group-full">
            <label>Địa chỉ</label>
            <input name="address" value={form.address} onChange={handleChange} />
          </div>

          <div className="admin-form-group">
            <label>Số phòng</label>
            <input type="number" name="totalRooms" value={form.totalRooms} onChange={handleChange} />
          </div>

          <div className="admin-form-group">
            <label>Hotline</label>
            <input name="phone" value={form.phone} onChange={handleChange} />
          </div>

          <div className="admin-form-group">
            <label>Trạng thái</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Tạm ngưng</option>
            </select>
          </div>

          <div className="admin-form-actions">
            <button type="button" onClick={() => navigate(-1)} className="admin-btn admin-btn-outline">
              Hủy
            </button>

            <button className="admin-btn admin-btn-primary">
              Cập nhật
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}