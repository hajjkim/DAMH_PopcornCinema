import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../../styles/PromotionDetailPage.css";
import {
  isPromotionSaved,
  savePromotion,
} from "../../utils/promotionStorage";
import {
  getPromotionById,
  type Promotion,
} from "../../services/promotion.api";

export default function PromotionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const promotionId = useMemo(() => id || "", [id]);

  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [saved, setSaved] = useState<boolean>(() =>
    promotionId ? isPromotionSaved(promotionId) : false
  );

  useEffect(() => {
    if (!promotionId) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getPromotionById(promotionId);
        setPromotion(data);
        setError("");
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Không tải được khuyến mãi";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [promotionId]);

  if (loading) {
    return (
      <div className="promotion-detail-page">
        <div className="promotion-detail-container">
          <p>Đang tải khuyến mãi...</p>
        </div>
      </div>
    );
  }

  if (error || !promotion) {
    return (
      <div className="promotion-detail-page">
        <div className="promotion-detail-container">
          <div className="promotion-not-found">
            <h2>{error || "Không tìm thấy khuyến mãi"}</h2>
            <Link to="/promotions" className="back-promotion-btn">
              Quay lại trang khuyến mãi
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSavePromotion = () => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      alert("Vui lòng đăng nhập để lưu khuyến mãi!");
      return;
    }

    const success = savePromotion(promotionId);

    if (!success) {
      alert("Bạn đã lưu khuyến mãi này rồi!");
      return;
    }

    setSaved(true);
    alert("Lưu khuyến mãi thành công!");
  };

  const imageSrc = promotion.imageUrl || (promotion as any).image || "/images/logo/logo.png";
  const badgeText = (promotion as any).discount || "Ưu đãi";
  const title = (promotion as any).title || promotion.code;
  const description =
    (promotion as any).description ||
    "Cập nhật các ưu đãi mới nhất tại Popcorn Cinema.";
  const validFrom =
    (promotion as any).startDate ||
    (promotion as any).validFrom ||
    "Đang cập nhật";
  const validTo =
    (promotion as any).endDate ||
    (promotion as any).validTo ||
    "Đang cập nhật";
  const condition =
    (promotion as any).condition ||
    "Xem chi tiết tại quầy hoặc website.";

  return (
    <div className="promotion-detail-page">
      <div className="promotion-detail-container">
        <div className="promotion-breadcrumb">
          <Link to="/promotions">Khuyến mãi</Link>
          <span>/</span>
          <span>{title}</span>
        </div>

        <div className="promotion-detail-card">
          <div className="promotion-detail-image">
            <img src={imageSrc} alt={title} />
          </div>

          <div className="promotion-detail-content">
            <span className="promotion-badge">{badgeText}</span>
            <h1>{title}</h1>

            <div className="promotion-meta">
              <p>
                <strong>Thời gian áp dụng:</strong> {validFrom} -{" "}
                {validTo}
              </p>
              <p>
                <strong>Điều kiện:</strong> {condition}
              </p>
            </div>

            <div className="promotion-description">
              <h3>Mô tả chương trình</h3>
              <p>{description}</p>
            </div>

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
