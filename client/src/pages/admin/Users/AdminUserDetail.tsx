import { Link } from "react-router-dom";
import "../../../styles/Admin/Users/AdminUser.css";

export default function AdminUserDetail() {
  const user = {
    id: 1,
    fullName: "Nguyễn Văn A",
    email: "a@gmail.com",
    phone: "0123456789",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: "2026-01-01",
  };

  return (
    <section className="admin-page-section">
      <div className="admin-card">

        <div className="detail-grid">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Tên:</strong> {user.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>SĐT:</strong> {user.phone}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Status:</strong> {user.status}</p>
          <p><strong>Ngày tạo:</strong> {user.createdAt}</p>
        </div>

        <div className="admin-form-actions">
          <Link to={`/admin/users/${user.id}/edit`} className="admin-btn admin-btn-primary">
            Sửa
          </Link>

          <Link to="/admin/users" className="admin-btn admin-btn-outline">
            Quay lại
          </Link>

          <button className="admin-btn admin-btn-danger">
            Xóa
          </button>
        </div>

      </div>
    </section>
  );
}