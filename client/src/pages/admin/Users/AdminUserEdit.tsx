import { useState } from "react";
import "../../../styles/Admin/Users/AdminUser.css";

export default function AdminUserEdit() {
  const [form, setForm] = useState({
    fullName: "Nguyễn Văn A",
    email: "a@gmail.com",
    phone: "0123456789",
    role: "ADMIN",
    status: "ACTIVE",
  });

  return (
    <section className="admin-page-section">
      <div className="admin-card">
        <form className="admin-form-grid">

          <div className="admin-form-group">
            <label>Họ tên</label>
            <input value={form.fullName} />
          </div>

          <div className="admin-form-group">
            <label>Email</label>
            <input value={form.email} />
          </div>

          <div className="admin-form-group">
            <label>SĐT</label>
            <input value={form.phone} />
          </div>

          <div className="admin-form-group">
            <label>Role</label>
            <select value={form.role}>
              <option>ADMIN</option>
              <option>STAFF</option>
              <option>CUSTOMER</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label>Status</label>
            <select value={form.status}>
              <option>ACTIVE</option>
              <option>INACTIVE</option>
              <option>BLOCKED</option>
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