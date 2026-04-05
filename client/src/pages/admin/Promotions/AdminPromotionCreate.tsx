import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { promotionAPI } from "../../../services/admin.api";
import "../../../styles/Admin/Promotions/AdminPromotion.css";

export default function AdminPromotionCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
    description: "",
  });
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchPromotion = async () => {
      try {
        setLoading(true);
        const data = await promotionAPI.getById(id);
        setForm({
          title: data.title || "",
          code: data.code || "",
          discountType: data.discountType || "PERCENTAGE",
          discountValue: data.discountValue || "",
          startDate: data.startDate?.split('T')[0] || "",
          endDate: data.endDate?.split('T')[0] || "",
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
    fetchPromotion();
  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const discountValue = Number(form.discountValue);
      if (form.discountType === "PERCENTAGE" && (discountValue < 0 || discountValue > 100)) {
        alert("Giá trị phần trăm phải từ 0 đến 100");
        return;
      }
      if (form.discountType === "FIXED_AMOUNT" && discountValue < 0) {
        alert("Giá trị giảm cố định không được âm");
        return;
      }
      const payload = { ...form, discountValue };
      if (id) {
        await promotionAPI.update(id, payload);
      } else {
        await promotionAPI.create(payload);
      }
      alert(`Khuyến mãi ${id ? "cập nhật" : "tạo"} thành công`);
      navigate("/admin/promotions");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error saving promotion");
    }
  };

  if (loading) return <section className="admin-page-section"><p>Đang tải...</p></section>;
  if (error) return <section className="admin-page-section"><p style={{color: 'red'}}>Lỗi: {error}</p></section>;

  return (
    <section className="admin-page-section">
      <div className="admin-card">
        <form className="admin-form-grid" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label>Tên khuyến mãi</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Tên khuyến mãi" required />
          </div>
          
          <div className="admin-form-group">
            <label>Mã</label>
            <input name="code" value={form.code} onChange={handleChange} placeholder="Mã" required />
          </div>

          <div className="admin-form-group">
            <label>Loại giảm</label>
            <select name="discountType" value={form.discountType} onChange={handleChange}>
              <option value="PERCENTAGE">% Phần trăm</option>
              <option value="FIXED_AMOUNT">VNĐ Cố định</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label>Giá trị giảm</label>
            <input
              type="number"
              name="discountValue"
              value={form.discountValue}
              onChange={handleChange}
              placeholder="Giá trị giảm"
              min={0}
              max={form.discountType === "PERCENTAGE" ? 100 : undefined}
              required
            />
          </div>
          
          <div className="admin-form-group">
            <label>Ngày bắt đầu</label>
            <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
          </div>
          
          <div className="admin-form-group">
            <label>Ngày kết thúc</label>
            <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required />
          </div>

          <div className="admin-form-group">
            <label>Trạng thái</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          <div className="admin-form-group admin-form-group-full">
            <label>Ảnh</label>
            <input type="file" />
          </div>

          <div className="admin-form-group admin-form-group-full">
            <label>Mô tả</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Mô tả" />
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