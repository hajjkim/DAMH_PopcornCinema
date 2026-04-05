import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/Admin/Cinemas/AdminCinemas.css";
import { cinemaAPI } from "../../../services/admin.api";

export default function AdminCinemaEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    phone: "",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCinema = async () => {
      if (!id) return;
      try {
        const cinema = await cinemaAPI.getById(id);
        setForm({
          name: cinema.name || "",
          city: cinema.city || "",
          address: cinema.address || "",
          phone: cinema.phone || "",
          status: cinema.status || "ACTIVE",
        });
      } catch (err: any) {
        console.error("Error fetching cinema:", err);
        setError(err.message || "Không thể tải dữ liệu rạp");
      } finally {
        setLoading(false);
      }
    };

    fetchCinema();
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
      await cinemaAPI.update(id, form);
      alert("Cập nhật rạp thành công!");
      navigate("/admin/cinemas");
    } catch (err: any) {
      setError(err.message || "Lỗi khi cập nhật rạp");
      alert("Lỗi: " + (err.message || "Không thể cập nhật rạp"));
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
            <label>Tên rạp</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Thành phố</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-group admin-form-group-full">
            <label>Địa chỉ</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Hotline</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="admin-form-group">
            <label>Trạng thái</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Tạm ngưng</option>
            </select>
          </div>

          <div className="admin-form-actions">
            <button
              type="button"
              onClick={() => navigate("/admin/cinemas")}
              className="admin-btn admin-btn-outline"
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