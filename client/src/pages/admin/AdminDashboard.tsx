import { useEffect, useMemo, useState } from "react";
import "../../styles/Admin/AdminDashboard.css";
import { adminAPI } from "../../services/admin.api";

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
  revenue: number;
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

  const [chartPeriod, setChartPeriod] = useState<"7d" | "14d" | "30d">("7d");

  // Simulated chart data — seeded by period so it's stable but looks realistic
  const chartData = useMemo(() => {
    const days = chartPeriod === "7d" ? 7 : chartPeriod === "14d" ? 14 : 30;
    const base = 8_000_000;
    const amp = 6_000_000;
    // Simple deterministic wave: sine + small pseudo-random bumps per index
    return Array.from({ length: days }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      const wave = Math.sin((i / (days - 1)) * Math.PI * 2.5) * amp;
      const bump = ((((i * 17 + 31) % 7) - 3) / 3) * 2_000_000;
      const revenue = Math.max(500_000, Math.round(base + wave + bump));
      return { date: d.toISOString().slice(0, 10), revenue };
    });
  }, [chartPeriod]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch admin stats
        const statsResponse = await adminAPI.getStats();
        setStats(statsResponse);

        // Fetch top movies
        const topMoviesResponse = await adminAPI.getTopMovies(5);
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

  const formatRevenue = (value: number) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)} tỷ`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} triệu`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)} nghìn`;
    return `${value.toLocaleString("vi-VN")}đ`;
  };

  const chartPoints = useMemo(() => {
    if (chartData.length < 2) return "";
    const maxVal = Math.max(...chartData.map((d) => d.revenue), 1);
    const W = 100, H = 100, pad = 5;
    return chartData
      .map((d, i) => {
        const x = pad + (i / (chartData.length - 1)) * (W - pad * 2);
        const y = H - pad - (d.revenue / maxVal) * (H - pad * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [chartData]);

  const chartMaxRevenue = useMemo(
    () => Math.max(...chartData.map((d) => d.revenue), 0),
    [chartData]
  );

  const periodLabels: Record<string, string> = {
    "7d": "7 ngày qua",
    "14d": "2 tuần qua",
    "30d": "1 tháng qua",
  };

  const xLabels = useMemo(() => {
    if (chartData.length === 0) return [];
    const step = chartData.length <= 7 ? 1 : chartData.length <= 14 ? 2 : 5;
    return chartData
      .filter((_, i) => i % step === 0 || i === chartData.length - 1)
      .map((d) => {
        const date = new Date(d.date);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      });
  }, [chartData]);

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
              <h3>Doanh thu {periodLabels[chartPeriod]}</h3>
              <div className="chart-period-btns">
                {(["7d", "14d", "30d"] as const).map((p) => (
                  <button
                    key={p}
                    className={`dashboard-chip-btn${chartPeriod === p ? " active" : ""}`}
                    onClick={() => setChartPeriod(p)}
                  >
                    {p === "7d" ? "7 ngày" : p === "14d" ? "2 tuần" : "1 tháng"}
                  </button>
                ))}
              </div>
            </div>

            {chartData.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", opacity: 0.5 }}>Chưa có dữ liệu doanh thu</div>
            ) : (
              <>
                <div className="revenue-chart-wrap">
                  <div className="chart-y-axis">
                    {[1, 0.75, 0.5, 0.25, 0].map((ratio) => (
                      <span key={ratio}>{formatRevenue(chartMaxRevenue * ratio)}</span>
                    ))}
                  </div>

                  <div className="chart-main">
                    <div className="chart-grid">
                      <span /><span /><span /><span /><span />
                      <div className="chart-vertical-lines">
                        <span /><span /><span /><span /><span />
                      </div>
                      <svg
                        className="revenue-line-svg"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#facc15" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <polygon
                          fill="url(#chartGradient)"
                          points={`${chartPoints} 95,95 5,95`}
                        />
                        <polyline
                          fill="none"
                          stroke="#facc15"
                          strokeWidth="2.5"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          points={chartPoints}
                        />
                      </svg>
                    </div>

                    <div className="chart-x-axis">
                      {xLabels.map((label, i) => (
                        <span key={i}>{label}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="chart-legend">
                  <span className="legend-dot" />
                  <span>Doanh thu (VNĐ) — Tổng: {formatRevenue(chartData.reduce((s, d) => s + d.revenue, 0))}</span>
                </div>
              </>
            )}
          </div>

          {/* TOP MOVIES */}
          <div className="dashboard-movie-card">
            <div className="dashboard-card-header">
              <h3>Top 5 Phim Bán Chạy</h3>
              <a href="/admin/reports?type=movies" className="dashboard-chip-link">
                Xem tất cả
              </a>
            </div>

            <div className="top-movie-list">
              {topMovies.map((movie, index) => (
                <div className="top-movie-item" key={movie._id}>
                  <span className="top-movie-rank">#{index + 1}</span>
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
                    <div className="top-movie-stats">
                      <span className="top-movie-ticket-count">
                        🎟 {movie.bookingCount} vé
                      </span>
                    </div>
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
                <strong>{formatRevenue(revenue.totalRevenue)}</strong>
              </div>

              <div className="summary-stat-item">
                <span>Doanh thu vé</span>
                <strong>{formatRevenue(revenue.ticketRevenue)}</strong>
              </div>

              <div className="summary-stat-item">
                <span>Doanh thu bắp nước</span>
                <strong>{formatRevenue(revenue.snackRevenue)}</strong>
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