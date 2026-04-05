import { useEffect, useState } from "react";
import "../../styles/Admin/AdminDashboard.css";
import { adminAPI } from "../../services/admin.api";
import { movieAPI } from "../../services/movie.api";

interface AdminStats {
  totalMovies: number;
  totalShowtimes: number;
  totalBookings: number;
  totalUsers: number;
}

interface TopMovie {
  _id: string;
  title: string;
  posterUrl?: string;
  bookingCount: number;
}

interface RevenueStats {
  totalRevenue: number;
  ticketRevenue: number;
  snackRevenue: number;
  occupancyRate: number;
  weeklyGrowth: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalMovies: 0,
    totalShowtimes: 0,
    totalBookings: 0,
    totalUsers: 0,
  });

  const [topMovies, setTopMovies] = useState<TopMovie[]>([]);

  const [revenue, setRevenue] = useState<RevenueStats>({
    totalRevenue: 0,
    ticketRevenue: 0,
    snackRevenue: 0,
    occupancyRate: 0,
    weeklyGrowth: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch admin stats
        const statsResponse = await adminAPI.getStats();
        setStats(statsResponse);

        // Fetch top movies
        const topMoviesResponse = await adminAPI.getTopMovies();
        setTopMovies(topMoviesResponse);

        // Fetch revenue stats
        const revenueResponse = await adminAPI.getRevenueStats();
        setRevenue(revenueResponse);

      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
  return (
    <section className="admin-page-section">
      {/* ===== STATS ===== */}
      <div className="admin-dashboard-grid">
        <div className="admin-stat-card">
          <h3>Tổng số phim</h3>
          <p>{stats.totalMovies}</p>
        </div>

        <div className="admin-stat-card">
          <h3>Suất chiếu hôm nay</h3>
          <p>{stats.totalShowtimes}</p>
        </div>

        <div className="admin-stat-card">
          <h3>Đơn hàng</h3>
          <p>{stats.totalBookings}</p>
        </div>

        <div className="admin-stat-card">
          <h3>Người dùng</h3>
          <p>{stats.totalUsers}</p>
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
              {topMovies.map((movie) => (
                <div className="top-movie-item" key={movie._id}>
                  <img
                    src={movie.posterUrl || "https://placehold.co/56x56?text=Movie"}
                    alt={movie.title}
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src =
                        "https://placehold.co/56x56?text=Movie")
                    }
                  />
                  <div className="top-movie-info">
                    <strong>{movie.title}</strong>
                    <span>{movie.bookingCount} vé đã bán</span>
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
                <strong>{(revenue.totalRevenue / 1000000000).toFixed(2)} tỷ</strong>
              </div>

              <div className="summary-stat-item">
                <span>Doanh thu vé</span>
                <strong>{(revenue.ticketRevenue / 1000000000).toFixed(2)} tỷ</strong>
              </div>

              <div className="summary-stat-item">
                <span>Doanh thu bắp nước</span>
                <strong>{(revenue.snackRevenue / 1000000).toFixed(0)} triệu</strong>
              </div>

              <div className="summary-stat-item">
                <span>Tỷ lệ lấp đầy</span>
                <strong>{revenue.occupancyRate}%</strong>
              </div>
            </div>

            <div className="mini-bars">
              <div className="mini-bar-group">
                <label>Vé phim</label>
                <div className="mini-bar-track">
                  <div className="mini-bar-fill" style={{ width: `${revenue.occupancyRate}%` }}></div>
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
                Hiệu suất tuần này tăng <strong>{revenue.weeklyGrowth}%</strong> so với tuần trước.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}