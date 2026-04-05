import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { snackAPI } from "../../../services/admin.api";
import "../../../styles/Admin/Snacks/AdminSnack.css";

export default function AdminSnackCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    category: "OTHER",
    price: "",
    status: "ACTIVE",
    description: "",
  });
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchSnack = async () => {
      try {
        setLoading(true);
        const data = await snackAPI.getById(id);
        setForm({
          name: data.name || "",
          category: data.category || "OTHER",
          price: data.price || "",
          status: data.status || "ACTIVE",
          description: data.description || "",
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchSnack();
  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: Number(form.price) };
      if (id) {
        await snackAPI.update(id, payload);
      } else {
        await snackAPI.create(payload);
      }
      alert(`Món ăn ${id ? "cập nhật" : "tạo"} thành công`);
      navigate("/admin/snacks");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving snack");
    }
  };

  if (loading) return <section className="admin-page-section"><p>Đang tải...</p></section>;
  if (error) return <section className="admin-page-section"><p style={{color: 'red'}}>Lỗi: {error}</p></section>;

  return (
    <section className="admin-page-section">
      <div className="admin-card">
        <form className="admin-form-grid" onSubmit={handleSubmit}>

          <div className="admin-form-group">
            <label>Tên món</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div className="admin-form-group">
            <label>Loại</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="POPCORN">Bắp rang</option>
              <option value="DRINK">Nước uống</option>
              <option value="CANDY">Kẹo / Snack</option>
              <option value="HOT_FOOD">Đồ ăn nóng</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label>Giá</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} required />
          </div>

          <div className="admin-form-group">
            <label>Trạng thái</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="ACTIVE">Đang bán</option>
              <option value="INACTIVE">Ngưng</option>
            </select>
          </div>

          <div className="admin-form-group admin-form-group-full">
            <label>Ảnh</label>
            <input type="file" />
          </div>

          <div className="admin-form-group admin-form-group-full">
            <label>Mô tả</label>
            <textarea name="description" value={form.description} onChange={handleChange} />
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