import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "../../../styles/Admin/Users/AdminUser.css";
import { userAPI } from "../../../services/admin.api";

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        const data = await userAPI.getById(id);
        setUser(data);
      } catch (err: any) {
        console.error("Error fetching user:", err);
        setError(err.message || "Không thể tải dữ liệu người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

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

  if (!user) {
    return (
      <section className="admin-page-section">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Người dùng không tìm thấy</p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page-section">
      <div className="admin-card">

        <div className="detail-grid">
          <p><strong>ID:</strong> {user._id}</p>
          <p><strong>Tên:</strong> {user.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>SĐT:</strong> {user.phone}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Status:</strong> {user.status}</p>
          <p><strong>Ngày tạo:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "N/A"}</p>
        </div>

        <div className="admin-form-actions">
          <Link to={`/admin/users/${id}/edit`} className="admin-btn admin-btn-primary">
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