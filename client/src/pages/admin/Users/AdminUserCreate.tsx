import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/Admin/Users/AdminUser.css";

export default function AdminUserCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "CUSTOMER",
    status: "ACTIVE",
  });
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) throw new Error("Failed to fetch user");
        const data = await response.json();
        setForm({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          role: data.role || "CUSTOMER",
          status: data.status || "ACTIVE",
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `/api/users/${id}` : "/api/users";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Failed to save user");
      alert(`Người dùng ${id ? "cập nhật" : "tạo"} thành công`);
      navigate("/admin/users");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving user");
    }
  };

  if (loading) return <section className="admin-page-section"><p>Đang tải...</p></section>;
  if (error) return <section className="admin-page-section"><p style={{color: 'red'}}>Lỗi: {error}</p></section>;

  return (
    <section className="admin-page-section">
      <div className="admin-card">
        <form className="admin-form-grid" onSubmit={handleSubmit}>

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
            <button type="button" className="admin-btn admin-btn-outline">Hủy</button>
            <button type="submit" className="admin-btn admin-btn-primary">Lưu</button>
          </div>

        </form>
      </div>
    </section>
  );
}