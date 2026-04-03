import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/PromotionPage.css";
import { getPromotions, type Promotion } from "../../services/promotion.api";

export default function PromotionPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        setIsLoading(true);
        const data = await getPromotions();
        setPromotions(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Không tải được khuyến mãi";
        setError(message);
        console.error("Error loading promotions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPromotions();
  }, []);

  return (
    <main className="promotion-page">
      <div className="promotion-container">
        <section className="promotion-section">
          <div className="promotion-heading">
            <h1>Khuyến mãi</h1>
            <p>Cập nhật các ưu đãi mới nhất tại Popcorn Cinema</p>
          </div>

          <div className="promotion-grid">
            {isLoading && <p>Đang tải khuyến mãi...</p>}
            {error && <p>Lỗi: {error}</p>}
            {!isLoading && !error && promotions.length === 0 && (
              <p>Không có khuyến mãi nào</p>
            )}
            {!isLoading &&
              !error &&
              promotions.map((item) => (
                <Link
                  to={`/promotions/${item._id}`}
                  className="promotion-card"
                  key={item._id}
                >
                  <div className="promotion-image-wrap">
                    <img src={"/images/logo/logo.png"} alt={item.code} />
                  </div>

                  <div className="promotion-card-body">
                    <h3>{item.code}</h3>
                    {item.description && <p>{item.description}</p>}
                    <span className="promotion-btn">Xem chi tiết</span>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}
