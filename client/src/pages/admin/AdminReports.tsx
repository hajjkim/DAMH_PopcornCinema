import { useState } from "react";
import "../../styles/Admin/AdminReport.css";

export default function AdminReports() {
  const [tab, setTab] = useState<"movies" | "snacks">("movies");

  const stats = {
    totalOrders: 120,
    totalTicketSold: 450,
    totalMovieRevenue: 120000000,
    totalSnackRevenue: 30000000,
  };

  const movieReport = [
    {
      id: 1,
      title: "Avengers",
      ticketsSold: 200,
      orders: 120,
      revenue: 60000000,
      poster: "/images/movies/phim1.jpg",
    },
  ];

  const snackReport = [
    {
      id: 1,
      name: "Combo Bắp",
      quantitySold: 150,
      orders: 100,
      revenue: 15000000,
      image: "/images/snacks/snack1.jpg",
    },
  ];

  const formatCurrency = (v: number) =>
    v.toLocaleString("vi-VN") + "đ";

  const calcPercent = (value: number, total: number) =>
    total ? Math.round((value / total) * 100) : 0;

  return (
    <section className="admin-page-section">

      {/* ===== STAT ===== */}
      <div className="report-stat-grid">
        <div className="report-stat-card">
          <span>Tổng đơn</span>
          <strong>{stats.totalOrders}</strong>
        </div>

        <div className="report-stat-card">
          <span>Vé bán</span>
          <strong>{stats.totalTicketSold}</strong>
        </div>

        <div className="report-stat-card">
          <span>Doanh thu vé</span>
          <strong>{formatCurrency(stats.totalMovieRevenue)}</strong>
        </div>

        <div className="report-stat-card">
          <span>Doanh thu bắp</span>
          <strong>{formatCurrency(stats.totalSnackRevenue)}</strong>
        </div>
      </div>

      {/* ===== TAB ===== */}
      <div className="report-tabs">
        <button
          className={tab === "movies" ? "active" : ""}
          onClick={() => setTab("movies")}
        >
          Phim
        </button>

        <button
          className={tab === "snacks" ? "active" : ""}
          onClick={() => setTab("snacks")}
        >
          Bắp nước
        </button>
      </div>

      {/* ===== TABLE ===== */}
      <div className="admin-card">

        {tab === "movies" && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Poster</th>
                <th>Tên</th>
                <th>Vé</th>
                <th>Doanh thu</th>
                <th>%</th>
              </tr>
            </thead>

            <tbody>
              {movieReport.map((m, i) => (
                <tr key={m.id}>
                  <td>#{i + 1}</td>

                  <td>
                    <img src={m.poster} className="admin-thumb" />
                  </td>

                  <td>{m.title}</td>
                  <td>{m.ticketsSold}</td>
                  <td>{formatCurrency(m.revenue)}</td>

                  <td>
                    <div className="report-bar-wrap">
                      <div
                        className="report-bar"
                        style={{
                          width: `${calcPercent(
                            m.ticketsSold,
                            stats.totalTicketSold
                          )}%`,
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "snacks" && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Ảnh</th>
                <th>Tên</th>
                <th>Số lượng</th>
                <th>Doanh thu</th>
                <th>%</th>
              </tr>
            </thead>

            <tbody>
              {snackReport.map((s, i) => (
                <tr key={s.id}>
                  <td>#{i + 1}</td>

                  <td>
                    <img src={s.image} className="admin-thumb" />
                  </td>

                  <td>{s.name}</td>
                  <td>{s.quantitySold}</td>
                  <td>{formatCurrency(s.revenue)}</td>

                  <td>
                    <div className="report-bar-wrap">
                      <div
                        className="report-bar snack"
                        style={{
                          width: `${calcPercent(
                            s.quantitySold,
                            200
                          )}%`,
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </section>
  );
}