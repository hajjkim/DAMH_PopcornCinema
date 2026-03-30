import "../../styles/Admin/AdminDashboard.css";

export default function AdminDashboard() {
  return (
    <section className="admin-page-section">
      {/* ===== STATS ===== */}
      <div className="admin-dashboard-grid">
        <div className="admin-stat-card">
          <h3>Tổng số phim</h3>
          <p>25</p>
        </div>

        <div className="admin-stat-card">
          <h3>Suất chiếu hôm nay</h3>
          <p>48</p>
        </div>

        <div className="admin-stat-card">
          <h3>Đơn hàng</h3>
          <p>132</p>
        </div>

        <div className="admin-stat-card">
          <h3>Người dùng</h3>
          <p>560</p>
        </div>
      </div>

      {/* ===== MAIN GRID ===== */}
      <div className="dashboard-analytics-grid">
        {/* LEFT */}
        <div className="dashboard-left-col">
          {/* CHART */}
          <div className="dashboard-chart-card">
            <div className="dashboard-card-header">
              <h3>Doanh thu 7 ngày qua</h3>
              <button className="dashboard-chip-btn">7 ngày</button>
            </div>

            <div className="revenue-chart-wrap">
              <div className="chart-y-axis">
                <span>500M</span>
                <span>400M</span>
                <span>300M</span>
                <span>200M</span>
                <span>100M</span>
              </div>

              <div className="chart-main">
                <div className="chart-grid">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>

                  <div className="chart-vertical-lines">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                  <svg
                    className="revenue-line-svg"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <polyline
                      fill="none"
                      stroke="#3bd16f"
                      strokeWidth="3"
                      points="0,78 16,70 32,52 48,58 64,36 80,25 100,12"
                    />
                  </svg>
                </div>

                <div className="chart-x-axis">
                  <span>T2</span>
                  <span>T3</span>
                  <span>T4</span>
                  <span>T5</span>
                  <span>T6</span>
                  <span>T7</span>
                  <span>CN</span>
                </div>
              </div>
            </div>

            <div className="chart-legend">
              <span className="legend-dot"></span>
              <span>Doanh thu (VND)</span>
            </div>
          </div>

          {/* TOP MOVIES */}
          <div className="dashboard-movie-card">
            <div className="dashboard-card-header">
              <h3>Top 4 Phim Bán Chạy</h3>
              <a href="/admin/reports?type=movies" className="dashboard-chip-link">
                Xem tất cả
              </a>
            </div>

            <div className="top-movie-list">
              {[
                {
                  title: "Thỏ ơi!!!",
                  sold: "1.240 vé đã bán",
                  img: "/images/movies/phim2.jpg",
                },
                {
                  title: "Nhà Bà Tôi Một Phòng",
                  sold: "1.050 vé đã bán",
                  img: "/images/movies/phim3.jpg",
                },
                {
                  title: "Báu Vật Trời Cho",
                  sold: "920 vé đã bán",
                  img: "/images/movies/phim4.jpg",
                },
                {
                  title: "Biệt Đội Thú Cưng",
                  sold: "815 vé đã bán",
                  img: "/images/movies/phim1.jpg",
                },
              ].map((movie, i) => (
                <div className="top-movie-item" key={i}>
                  <img
                    src={movie.img}
                    alt={movie.title}
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src =
                        "https://placehold.co/56x56?text=Movie")
                    }
                  />
                  <div className="top-movie-info">
                    <strong>{movie.title}</strong>
                    <span>{movie.sold}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="dashboard-right-col">
          <div className="dashboard-summary-card">
            <div className="dashboard-card-header">
              <h3>Tổng quan doanh thu</h3>
            </div>

            <div className="summary-stat-list">
              <div className="summary-stat-item">
                <span>Tổng doanh thu</span>
                <strong>2.48 tỷ</strong>
              </div>

              <div className="summary-stat-item">
                <span>Doanh thu vé</span>
                <strong>1.92 tỷ</strong>
              </div>

              <div className="summary-stat-item">
                <span>Doanh thu bắp nước</span>
                <strong>560 triệu</strong>
              </div>

              <div className="summary-stat-item">
                <span>Tỷ lệ lấp đầy</span>
                <strong>78%</strong>
              </div>
            </div>

            <div className="mini-bars">
              <div className="mini-bar-group">
                <label>Vé phim</label>
                <div className="mini-bar-track">
                  <div className="mini-bar-fill" style={{ width: "78%" }}></div>
                </div>
              </div>

              <div className="mini-bar-group">
                <label>Bắp nước</label>
                <div className="mini-bar-track">
                  <div className="mini-bar-fill gold" style={{ width: "52%" }}></div>
                </div>
              </div>

              <div className="mini-bar-group">
                <label>Khuyến mãi</label>
                <div className="mini-bar-track">
                  <div className="mini-bar-fill red" style={{ width: "35%" }}></div>
                </div>
              </div>
            </div>

            <div className="dashboard-note-box">
              <p>
                Hiệu suất tuần này tăng <strong>12.5%</strong> so với tuần trước.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}