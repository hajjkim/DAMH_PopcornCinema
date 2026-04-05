import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "../../../styles/Admin/Promotions/AdminPromotion.css";
import { promotionAPI } from "../../../services/admin.api";

export default function AdminPromotionDetail() {
  const { id } = useParams<{ id: string }>();
  const [promotion, setPromotion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPromotion = async () => {
      if (!id) return;
      try {
        const data = await promotionAPI.getById(id);
        setPromotion(data);
      } catch (err: any) {
        console.error("Error fetching promotion:", err);
        setError(err.message || "Không thể tải dữ liệu khuyến mãi");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotion();
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

  if (!promotion) {
    return (
      <section className="admin-page-section">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Khuyến mãi không tìm thấy</p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page-section">

      <div className="admin-card promotion-detail-layout">

        {promotion.imageUrl && <img src={promotion.imageUrl} className="promotion-detail-poster" alt={promotion.title} />}

        <div className="detail-grid">
          <p><strong>Tên:</strong> {promotion.title}</p>
          <p><strong>Mã:</strong> {promotion.code}</p>
          <p><strong>Loại:</strong> {promotion.discountType === "PERCENTAGE" ? "Phần trăm" : "Số tiền cố định"}</p>
          <p><strong>Giá trị:</strong> {promotion.discountValue} {promotion.discountType === "PERCENTAGE" ? "%" : "₫"}</p>
          <p><strong>Thời gian:</strong> {new Date(promotion.startDate).toLocaleDateString("vi-VN")} - {new Date(promotion.endDate).toLocaleDateString("vi-VN")}</p>
          <p><strong>Trạng thái:</strong> {promotion.status}</p>
          <p><strong>Mô tả:</strong> {promotion.description}</p>
        </div>

        <div className="admin-form-actions">
          <Link to={`/admin/promotions/${id}/edit`} className="admin-btn admin-btn-primary">
            Sửa
          </Link>

          <Link to="/admin/promotions" className="admin-btn admin-btn-outline">
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