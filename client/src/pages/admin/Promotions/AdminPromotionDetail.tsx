import { Link } from "react-router-dom";
import "../../../styles/Admin/Promotions/AdminPromotion.css";

export default function AdminPromotionDetail() {
  const p = {
    id: 1,
    title: "Giảm 50%",
    code: "SALE50",
    discountValue: 50,
    discountType: "PERCENT",
    poster: "/images/promo.jpg",
    startDate: "2026-01-01",
    endDate: "2026-01-10",
    status: "ACTIVE",
  };

  return (
    <section className="admin-page-section">

      <div className="admin-card promotion-detail-layout">

        <img src={p.poster} className="promotion-detail-poster" />

        <div className="detail-grid">
          <p><strong>Tên:</strong> {p.title}</p>
          <p><strong>Mã:</strong> {p.code}</p>
          <p><strong>Giá trị:</strong> {p.discountValue}</p>
          <p><strong>Thời gian:</strong> {p.startDate} - {p.endDate}</p>
        </div>

        <div className="admin-form-actions">
          <Link to={`/admin/promotions/${p.id}/edit`} className="admin-btn admin-btn-primary">
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