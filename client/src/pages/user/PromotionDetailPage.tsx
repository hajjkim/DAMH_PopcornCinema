import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../../styles/PromotionDetailPage.css";
import { promotions } from "../../data/promotions";
import {
  isPromotionSaved,
  savePromotion,
} from "../../utils/promotionStorage";

export default function PromotionDetailPage() {
  const { id } = useParams<{ id: string }>();

  const promotion = useMemo(() => {
    return promotions.find((item) => item.id === Number(id));
  }, [id]);

  const [saved, setSaved] = useState<boolean>(() =>
    promotion ? isPromotionSaved(String(promotion.id)) : false
  );

  if (!promotion) {
    return (
      <div className="promotion-detail-page">
        <div className="promotion-detail-container">
          <div className="promotion-not-found">
            <h2>Không tìm thấy khuyến mãi</h2>
            <Link to="/promotions" className="back-promotion-btn">
              Quay lại trang khuyến mãi
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSavePromotion = () => {
    // chưa login
    const user = localStorage.getItem("currentUser");
    if (!user) {
      alert("Vui lòng đăng nhập để lưu khuyến mãi!");
      return;
    }

    const success = savePromotion(String(promotion.id));

    if (!success) {
      alert("Bạn đã lưu khuyến mãi này rồi!");
      return;
    }

    setSaved(true);
    alert("Lưu khuyến mãi thành công!");
  };

  return (
    <div className="promotion-detail-page">
      <div className="promotion-detail-container">

        {/* Breadcrumb */}
        <div className="promotion-breadcrumb">
          <Link to="/promotions">Khuyến mãi</Link>
          <span>/</span>
          <span>{promotion.title}</span>
        </div>

        {/* Content */}
        <div className="promotion-detail-card">
          <div className="promotion-detail-image">
            <img src={promotion.image} alt={promotion.title} />
          </div>

          <div className="promotion-detail-content">
            <span className="promotion-badge">{promotion.discount}</span>
            <h1>{promotion.title}</h1>

            <div className="promotion-meta">
              <p>
                <strong>Thời gian áp dụng:</strong> {promotion.validFrom} - {promotion.validTo}
              </p>
              <p>
                <strong>Điều kiện:</strong> {promotion.condition}
              </p>
            </div>

            <div className="promotion-description">
              <h3>Mô tả chương trình</h3>
              <p>{promotion.description}</p>
            </div>

            {/* ACTION */}
            <div className="promotion-detail-actions">
              <button
                type="button"
                disabled={saved}
                className={`save-promotion-btn ${saved ? "saved disabled" : ""}`}
                onClick={handleSavePromotion}
              >
                {saved ? "Đã lưu khuyến mãi" : "Lưu khuyến mãi"}
              </button>

              <Link to="/promotions" className="back-promotion-btn">
                Quay lại
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}