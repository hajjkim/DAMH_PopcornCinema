import { useState } from "react";
import "../../../styles/Admin/Snacks/AdminSnack.css";

export default function AdminSnackCreate() {
  const [form, setForm] = useState({
    name: "",
    type: "COMBO",
    price: "",
    status: "ACTIVE",
    description: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <section className="admin-page-section">
      <div className="admin-card">
        <form className="admin-form-grid">

          <div className="admin-form-group">
            <label>Tên món</label>
            <input name="name" onChange={handleChange} required />
          </div>

          <div className="admin-form-group">
            <label>Loại</label>
            <select name="type" onChange={handleChange}>
              <option value="COMBO">Combo</option>
              <option value="POPCORN">Bắp</option>
              <option value="DRINK">Nước</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label>Giá</label>
            <input type="number" name="price" onChange={handleChange} required />
          </div>

          <div className="admin-form-group">
            <label>Trạng thái</label>
            <select name="status" onChange={handleChange}>
              <option value="ACTIVE">Đang bán</option>
              <option value="INACTIVE">Ngưng</option>
            </select>
          </div>

          <div className="admin-form-group admin-form-group-full">
            <label>Ảnh</label>
            <input type="file" />
          </div>

          <div className="admin-form-group admin-form-group-full">
            <label>Mô tả</label>
            <textarea name="description" onChange={handleChange} />
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