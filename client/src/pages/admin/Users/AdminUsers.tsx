import { Link } from "react-router-dom";
import "../../../styles/Admin/Users/AdminUser.css";

const users = [
  {
    id: 1,
    fullName: "Nguyễn Văn A",
    email: "a@gmail.com",
    phone: "0123456789",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: "2026-01-01",
  },
];

export default function AdminUsers() {
  return (
    <section className="admin-page-section">

      {/* ACTION */}
      <div className="admin-page-actions">
        <Link to="/admin/users/create" className="admin-btn admin-btn-primary">
          + Thêm người dùng
        </Link>
      </div>

      {/* FILTER */}
      <div className="admin-card">
        <div className="admin-user-filter">
          <input placeholder="Tên, email..." />

          <select>
            <option>Tất cả role</option>
            <option>Admin</option>
            <option>Staff</option>
            <option>Customer</option>
          </select>

          <select>
            <option>Tất cả trạng thái</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Blocked</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td><strong>{u.fullName}</strong></td>
                <td>{u.email}</td>
                <td>{u.phone}</td>

                <td>
                  <span className={`admin-badge ${
                    u.role === "ADMIN"
                      ? "admin-badge-danger"
                      : u.role === "STAFF"
                      ? "admin-badge-warning"
                      : "admin-badge-info"
                  }`}>
                    {u.role}
                  </span>
                </td>

                <td>
                  <span className={`admin-badge ${
                    u.status === "ACTIVE"
                      ? "admin-badge-success"
                      : u.status === "INACTIVE"
                      ? "admin-badge-secondary"
                      : "admin-badge-danger"
                  }`}>
                    {u.status}
                  </span>
                </td>

                <td>{u.createdAt}</td>

                <td>
                  <div className="admin-table-actions">
                    <Link to={`/admin/users/${u.id}`} className="admin-btn admin-btn-sm admin-btn-outline">
                      Chi tiết
                    </Link>

                    <Link to={`/admin/users/${u.id}/edit`} className="admin-btn admin-btn-sm admin-btn-outline">
                      Sửa
                    </Link>

                    <button className="admin-btn admin-btn-sm admin-btn-danger">
                      Xóa
                    </button>
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