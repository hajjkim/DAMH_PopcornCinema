import { useState } from "react";
import "../../../styles/Admin/Snacks/AdminSnack.css";

export default function AdminSnackEdit() {
  const [form, setForm] = useState({
    name: "Combo 1",
    type: "COMBO",
    price: 50000,
    status: "ACTIVE",
    description: "",
  });

  return (
    <section className="admin-page-section">
      <div className="admin-card">
        <form className="admin-form-grid">

          <div className="admin-form-group">
            <label>Tên</label>
            <input value={form.name} />
          </div>

          <div className="admin-form-group">
            <label>Loại</label>
            <select value={form.type}>
              <option>Combo</option>
              <option>Bắp</option>
              <option>Nước</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label>Giá</label>
            <input value={form.price} />
          </div>

          <div className="admin-form-group">
            <label>Trạng thái</label>
            <select value={form.status}>
              <option>ACTIVE</option>
              <option>INACTIVE</option>
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