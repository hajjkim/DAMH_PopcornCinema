import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/Admin/Promotions/AdminPromotion.css";
import { promotionAPI } from "../../../services/admin.api";

export default function AdminPromotionEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState({
    code: "",
    title: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: 0,
    maxDiscount: 0,
    minOrderValue: 0,
    usageLimit: 0,
    applicableTo: "ALL",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPromotion = async () => {
      if (!id) return;
      try {
        const promotion = await promotionAPI.getById(id);
        setForm({
          code: promotion.code || "",
          title: promotion.title || "",
          description: promotion.description || "",
          discountType: promotion.discountType || "PERCENTAGE",
          discountValue: promotion.discountValue || 0,
          maxDiscount: promotion.maxDiscount || 0,
          minOrderValue: promotion.minOrderValue || 0,
          usageLimit: promotion.usageLimit || 0,
          applicableTo: promotion.applicableTo || "ALL",
          startDate: promotion.startDate ? new Date(promotion.startDate).toISOString().split('T')[0] : "",
          endDate: promotion.endDate ? new Date(promotion.endDate).toISOString().split('T')[0] : "",
          status: promotion.status || "ACTIVE",
          imageUrl: promotion.imageUrl || "",
        });
      } catch (err: any) {
        console.error("Error fetching promotion:", err);
        setError(err.message || "Không thể tải dữ liệu khuyến mãi");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotion();
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
      await promotionAPI.update(id, form);
      alert("Cập nhật khuyến mãi thành công!");
      navigate("/admin/promotions");
    } catch (err: any) {
      setError(err.message || "Lỗi khi cập nhật khuyến mãi");
      alert("Lỗi: " + (err.message || "Không thể cập nhật khuyến mãi"));
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
            <label>Mã khuyến mãi</label>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              required
              disabled
            />
          </div>

          <div className="admin-form-group">
            <label>Tên khuyến mãi</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-group admin-form-group-full">
            <label>Mô tả</label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="admin-form-group">
            <label>Loại giảm giá</label>
            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
            >
              <option value="PERCENTAGE">Phần trăm (%)</option>
              <option value="FIXED_AMOUNT">Số tiền cố định (₫)</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label>Giá trị giảm</label>
            <input
              type="number"
              name="discountValue"
              value={form.discountValue}
              onChange={handleChange}
              min="0"
              max={form.discountType === "PERCENTAGE" ? 100 : undefined}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Giảm giá tối đa (₫)</label>
            <input
              type="number"
              name="maxDiscount"
              value={form.maxDiscount}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="admin-form-group">
            <label>Giá trị đơn hàng tối thiểu (₫)</label>
            <input
              type="number"
              name="minOrderValue"
              value={form.minOrderValue}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="admin-form-group">
            <label>Số lần sử dụng tối đa</label>
            <input
              type="number"
              name="usageLimit"
              value={form.usageLimit}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="admin-form-group">
            <label>Áp dụng cho</label>
            <select
              name="applicableTo"
              value={form.applicableTo}
              onChange={handleChange}
            >
              <option value="ALL">Tất cả</option>
              <option value="TICKETS">Vé xem phim</option>
              <option value="SNACKS">Đồ ăn thức uống</option>
              <option value="BOTH">Cả hai</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label>Ngày bắt đầu</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Ngày kết thúc</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
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
              <option value="EXPIRED">Hết hạn</option>
            </select>
          </div>

          <div className="admin-form-group admin-form-group-full">
            <label>Hình ảnh URL</label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-btn admin-btn-outline"
              onClick={() => navigate("/admin/promotions")}
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