import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/Admin/Auditoriums/AdminAuditoriums.css";
import { auditoriumAPI, cinemaAPI } from "../../../services/movie.api";

export default function AdminAuditoriumEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [cinemas, setCinemas] = useState<any[]>([]);

  const [form, setForm] = useState({
    cinemaId: "",
    name: "",
    totalRows: "",
    totalColumns: "",
    seatCapacity: "",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch cinemas
        const cinemasData = await cinemaAPI.getAll();
        setCinemas(cinemasData || []);

        // Fetch auditorium
        if (id) {
          const auditorium = await auditoriumAPI.getById(id);
          setForm({
            cinemaId: auditorium.cinemaId?._id || "",
            name: auditorium.name || "",
            totalRows: auditorium.totalRows || "",
            totalColumns: auditorium.totalColumns || "",
            seatCapacity: auditorium.seatCapacity || "",
            status: auditorium.status || "ACTIVE",
          });
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSubmitting(true);
    setError("");

    try {
      const seatCapacity = form.seatCapacity || (Number(form.totalRows) * Number(form.totalColumns));
      
      const data = {
        cinemaId: form.cinemaId,
        name: form.name,
        totalRows: Number(form.totalRows),
        totalColumns: Number(form.totalColumns),
        seatCapacity: seatCapacity,
        status: form.status,
      };

      await auditoriumAPI.update(id, data);
      alert("Cập nhật phòng thành công!");
      navigate("/admin/auditoriums");
    } catch (err: any) {
      const message = err.message || "Lỗi khi cập nhật phòng";
      setError(message);
      alert("Lỗi: " + message);
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
        <h2>Chỉnh sửa phòng chiếu</h2>
        {error && <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>}
        
        <form className="admin-form-grid" onSubmit={handleSubmit}>

          <div className="admin-form-group">
            <label>Rạp chiếu phim *</label>
            <select 
              name="cinemaId" 
              value={form.cinemaId} 
              onChange={handleChange} 
              required
            >
              <option value="">-- Chọn rạp --</option>
              {cinemas.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.city})
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Tên phòng *</label>
            <input 
              name="name" 
              value={form.name}
              onChange={handleChange} 
              placeholder="VD: Phòng A1, Phòng IMAX..."
              required 
            />
          </div>

          <div className="admin-form-group">
            <label>Số hàng ghế *</label>
            <input 
              type="number" 
              name="totalRows" 
              value={form.totalRows}
              min={1} 
              onChange={handleChange} 
              placeholder="VD: 10"
              required 
            />
          </div>

          <div className="admin-form-group">
            <label>Số cột ghế *</label>
            <input 
              type="number" 
              name="totalColumns" 
              value={form.totalColumns}
              min={1} 
              onChange={handleChange} 
              placeholder="VD: 15"
              required 
            />
          </div>

          <div className="admin-form-group">
            <label>Sức chứa (nếu khác)</label>
            <input 
              type="number" 
              name="seatCapacity" 
              value={form.seatCapacity}
              min={0}
              onChange={handleChange} 
              placeholder="Để trống = hàng × cột"
            />
          </div>

          <div className="admin-form-group">
            <label>Trạng thái</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Tạm ngưng</option>
            </select>
          </div>

          <div className="admin-form-actions">
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="admin-btn admin-btn-outline"
            >
              Hủy
            </button>

            <button 
              type="submit" 
              disabled={submitting}
              className="admin-btn admin-btn-primary"
            >
              {submitting ? "Đang lưu..." : "Cập nhật phòng"}
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}
