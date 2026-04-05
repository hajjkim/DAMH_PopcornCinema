import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../styles/Admin/Users/AdminUser.css";
import { userAPI } from "../../../services/admin.api";

type User = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
  createdAt: string;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getAll();
        setUsers(response || []);
        setFilteredUsers(response || []);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    // Search by name or email
    if (search) {
      filtered = filtered.filter(
        (u) =>
          u.fullName.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by role
    if (filterRole) {
      filtered = filtered.filter((u) => u.role === filterRole);
    }

    // Filter by status
    if (filterStatus) {
      filtered = filtered.filter((u) => u.status === filterStatus);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [search, filterRole, filterStatus, users]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn chắc chắn muốn xóa người dùng này?")) {
      try {
        await userAPI.delete(id);
        setUsers(users.filter((u) => u._id !== id));
        alert("Xóa người dùng thành công!");
      } catch (err: any) {
        alert("Lỗi: " + (err.message || "Không thể xóa người dùng"));
      }
    }
  };

  if (loading) {
    return (
      <section className="admin-page-section">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Đang tải dữ liệu...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="admin-page-section">
        <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
          <p>Lỗi: {error}</p>
        </div>
      </section>
    );
  }

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
          <input
            placeholder="Tên, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="">Tất cả role</option>
            <option value="ADMIN">Admin</option>
            <option value="STAFF">Staff</option>
            <option value="CUSTOMER">Customer</option>
          </select>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="BLOCKED">Blocked</option>
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
            {paginatedUsers.map((u) => (
              <tr key={u._id}>
                <td>{u._id}</td>
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

                <td>{new Date(u.createdAt).toLocaleDateString("vi-VN")}</td>

                <td>
                  <div className="admin-table-actions">
                    <Link to={`/admin/users/${u._id}`} className="admin-btn admin-btn-sm admin-btn-outline">
                      Chi tiết
                    </Link>

                    <Link to={`/admin/users/${u._id}/edit`} className="admin-btn admin-btn-sm admin-btn-outline">
                      Sửa
                    </Link>

                    <button
                      className="admin-btn admin-btn-sm admin-btn-danger"
                      onClick={() => handleDelete(u._id)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px",
          borderTop: "1px solid #ddd",
        }}>
          <span>
            Hiển thị {filteredUsers.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + itemsPerPage, filteredUsers.length)} trên {filteredUsers.length} người dùng
          </span>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="admin-btn admin-btn-outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              ← Trước
            </button>

            <span style={{ padding: "8px 12px", display: "flex", alignItems: "center" }}>
              Trang {currentPage} / {totalPages || 1}
            </span>

            <button
              className="admin-btn admin-btn-outline"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Sau →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}