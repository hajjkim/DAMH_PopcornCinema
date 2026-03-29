import { Link } from "react-router-dom";
import "../../styles/PromotionPage.css";
import { promotions } from "../../data/promotions";

export default function PromotionPage() {
  return (
    <main className="promotion-page">
      <div className="promotion-container">
        <section className="promotion-section">
          <div className="promotion-heading">
            <h1>Khuyến mãi</h1>
            <p>Cập nhật các ưu đãi mới nhất tại Popcorn Cinema</p>
          </div>

          <div className="promotion-grid">
            {promotions.map((item) => (
            <Link
              to={`/promotions/${item.id}`}
              className="promotion-card"
              key={item.id}
            >
              <div className="promotion-image-wrap">
                <img src={item.image} alt={item.title} />
              </div>

              <div className="promotion-card-body">
                <h3>{item.title}</h3>
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