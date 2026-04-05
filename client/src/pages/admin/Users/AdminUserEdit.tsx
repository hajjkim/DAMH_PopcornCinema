import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/Admin/Users/AdminUser.css";
import { userAPI } from "../../../services/admin.api";

export default function AdminUserEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "CUSTOMER",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        const user = await userAPI.getById(id);
        setForm({
          fullName: user.fullName || "",
          email: user.email || "",
          phone: user.phone || "",
          role: user.role || "CUSTOMER",
          status: user.status || "ACTIVE",
        });
      } catch (err: any) {
        console.error("Error fetching user:", err);
        setError(err.message || "Không thể tải dữ liệu người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSubmitting(true);
    setError("");

    try {
      await userAPI.update(id, form);
      alert("Cập nhật người dùng thành công!");
      navigate("/admin/users");
    } catch (err: any) {
      setError(err.message || "Lỗi khi cập nhật người dùng");
      alert("Lỗi: " + (err.message || "Không thể cập nhật người dùng"));
    } finally {
      setSubmitting(false);
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

  return (
    <section className="admin-page-section">
      <div className="admin-card">
        <form className="admin-form-grid" onSubmit={handleSubmit}>
          {error && (
            <div
              className="admin-form-group"
              style={{ gridColumn: "1 / -1", color: "red", marginBottom: "10px" }}
            >
              {error}
            </div>
          )}

          <div className="admin-form-group">
            <label>Họ tên</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>SĐT</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="admin-form-group">
            <label>Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="STAFF">STAFF</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="BLOCKED">BLOCKED</option>
            </select>
          </div>

          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-btn admin-btn-outline"
              onClick={() => navigate("/admin/users")}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={submitting}
            >
              {submitting ? "Đang lưu..." : "Cập nhật"}
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}