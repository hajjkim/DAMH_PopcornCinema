import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/Admin/Auditoriums/AdminAuditoriums.css";
import { auditoriumAPI, cinemaAPI } from "../../../services/movie.api";

export default function AdminAuditoriumCreate() {
  const navigate = useNavigate();
  const [cinemas, setCinemas] = useState<any[]>([]);

  const [form, setForm] = useState({
    cinemaId: "",
    name: "",
    totalRows: "",
    totalColumns: "",
    seatCapacity: "",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const data = await cinemaAPI.getAll();
        setCinemas(data || []);
      } catch (err: any) {
        console.error("Error fetching cinemas:", err);
      }
    };
    fetchCinemas();
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Calculate seatCapacity if not provided
      const seatCapacity = form.seatCapacity || (Number(form.totalRows) * Number(form.totalColumns));
      
      const data = {
        cinemaId: form.cinemaId,
        name: form.name,
        totalRows: Number(form.totalRows),
        totalColumns: Number(form.totalColumns),
        seatCapacity: seatCapacity,
        status: form.status,
      };

      await auditoriumAPI.create(data);
      alert("Thêm phòng thành công!");
      navigate("/admin/auditoriums");
    } catch (err: any) {
      const message = err.message || "Không thể thêm phòng";
      setError(message);
      alert("Lỗi: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-page-section">
      <div className="admin-card">
        <h2>Thêm phòng mới</h2>
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
              disabled={loading}
              className="admin-btn admin-btn-primary"
            >
              {loading ? "Đang lưu..." : "Lưu phòng"}
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}
