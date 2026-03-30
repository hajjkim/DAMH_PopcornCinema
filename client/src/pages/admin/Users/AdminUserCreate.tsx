import { useState } from "react";
import "../../../styles/Admin/Users/AdminUser.css";

export default function AdminUserCreate() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "CUSTOMER",
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
            <label>Họ tên</label>
            <input name="fullName" onChange={handleChange} required />
          </div>

          <div className="admin-form-group">
            <label>Email</label>
            <input type="email" name="email" onChange={handleChange} required />
          </div>

          <div className="admin-form-group">
            <label>SĐT</label>
            <input name="phone" onChange={handleChange} required />
          </div>

          <div className="admin-form-group">
            <label>Vai trò</label>
            <select name="role" onChange={handleChange}>
              <option value="CUSTOMER">Khách</option>
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label>Trạng thái</label>
            <select name="status" onChange={handleChange}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="BLOCKED">Blocked</option>
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