import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/Admin/Cinemas/AdminCinemas.css";
export default function AdminCinemaCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    totalRooms: "",
    phone: "",
    status: "ACTIVE",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(form);
    navigate("/admin/cinemas");
  };

  return (
    <section className="admin-page-section">
      <div className="admin-card">
        <form className="admin-form-grid" onSubmit={handleSubmit}>

          <div className="admin-form-group">
            <label>Tên rạp</label>
            <input name="name" onChange={handleChange} required />
          </div>

          <div className="admin-form-group">
            <label>Thành phố</label>
            <select name="city" value={form.city} onChange={handleChange} required>
                <option value="">-- Chọn thành phố --</option>
                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Cần Thơ">Cần Thơ</option>
                </select>
          </div>

          <div className="admin-form-group admin-form-group-full">
            <label>Địa chỉ</label>
            <input name="address" onChange={handleChange} required />
          </div>

          <div className="admin-form-group">
            <label>Số phòng</label>
            <input type="number" name="totalRooms" min={1} onChange={handleChange} required />
          </div>

          <div className="admin-form-group">
            <label>Hotline</label>
            <input name="phone" onChange={handleChange} required />
          </div>

          <div className="admin-form-group">
            <label>Trạng thái</label>
            <select name="status" onChange={handleChange}>
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Tạm ngưng</option>
            </select>
          </div>

          <div className="admin-form-actions">
            <button type="button" onClick={() => navigate(-1)} className="admin-btn admin-btn-outline">
              Hủy
            </button>

            <button className="admin-btn admin-btn-primary">
              Lưu rạp
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}