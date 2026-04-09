import { useEffect, useState } from "react";
import "../../styles/Admin/AdminReport.css";
import { adminAPI } from "../../services/admin.api";

interface MovieReport {
  _id: string;
  title: string;
  ticketsSold: number;
  orders: number;
  revenue: number;
  poster: string;
}

interface SnackReport {
  _id: string;
  name: string;
  quantitySold: number;
  orders: number;
  revenue: number;
  image: string;
}

interface PaymentReport {
  _id: string;
  method: string;
  amount: number;
  status: string;
  transactionId: string;
  createdAt: string;
  userName: string;
  userEmail: string;
  bookingCode: string;
}

interface ReportStats {
  totalOrders: number;
  totalTicketSold: number;
  totalMovieRevenue: number;
  totalSnackRevenue: number;
  totalPayments?: number;
  totalPaymentAmount?: number;
}

export default function AdminReports() {
  const [tab, setTab] = useState<"movies" | "snacks" | "payments">("movies");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState<ReportStats>({
    totalOrders: 0,
    totalTicketSold: 0,
    totalMovieRevenue: 0,
    totalSnackRevenue: 0,
    totalPayments: 0,
    totalPaymentAmount: 0,
  });

  const [movieReport, setMovieReport] = useState<MovieReport[]>([]);
  const [snackReport, setSnackReport] = useState<SnackReport[]>([]);
  const [paymentReport, setPaymentReport] = useState<PaymentReport[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);

        // Fetch movie report
        const moviesRes = await adminAPI.getMoviesReport();
        setMovieReport(moviesRes?.movies || []);

        // Fetch snacks report
        const snacksRes = await adminAPI.getSnacksReport();
        setSnackReport(snacksRes?.snacks || []);

        // Fetch payments report
        const paymentsRes = await adminAPI.getPaymentsReport();
        setPaymentReport(paymentsRes?.payments || []);

        // Calculate stats
        const totalMovieRevenue = moviesRes?.movies?.reduce(
          (sum: number, m: MovieReport) => sum + m.revenue,
          0
        ) || 0;
        const totalSnackRevenue = snacksRes?.snacks?.reduce(
          (sum: number, s: SnackReport) => sum + s.revenue,
          0
        ) || 0;
        const totalTicketSold = moviesRes?.movies?.reduce(
          (sum: number, m: MovieReport) => sum + m.ticketsSold,
          0
        ) || 0;
        const totalPaymentAmount = paymentsRes?.payments?.reduce(
          (sum: number, p: PaymentReport) => sum + p.amount,
          0
        ) || 0;

        setStats({
          totalOrders:
            (moviesRes?.movies?.reduce(
              (sum: number, m: MovieReport) => sum + m.orders,
              0
            ) || 0) +
            (snacksRes?.snacks?.reduce(
              (sum: number, s: SnackReport) => sum + s.orders,
              0
            ) || 0),
          totalTicketSold,
          totalMovieRevenue,
          totalSnackRevenue,
          totalPayments: paymentsRes?.payments?.length || 0,
          totalPaymentAmount,
        });
      } catch (err: any) {
        console.error("Error fetching reports:", err);
        setError(err.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const formatCurrency = (v: number) => v.toLocaleString("vi-VN") + "đ";

  const formatMethod = (method: string) => {
    const map: Record<string, string> = {
      CREDIT_CARD: "Thẻ tín dụng",
      DEBIT_CARD: "Thẻ ghi nợ",
      BANK_TRANSFER: "Chuyển khoản",
      E_WALLET: "Ví điện tử",
      CASH: "Tiền mặt",
    };
    return map[method] ?? method;
  };

  const calcPercent = (value: number, total: number) =>
    total ? Math.round((value / total) * 100) : 0;

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

        <button
          className={tab === "payments" ? "active" : ""}
          onClick={() => setTab("payments")}
        >
          Hóa đơn
        </button>
      </div>

      {/* ===== TABLE ===== */}
      <div className="admin-card">

        {tab === "movies" && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Phim</th>
                <th>Vé</th>
                <th>Doanh thu</th>
                <th>%</th>
              </tr>
            </thead>

            <tbody>
              {movieReport.map((m, i) => (
                <tr key={m._id}>
                  <td>#{i + 1}</td>

                  <td>
                    <span>{m.title}</span>
                  </td>

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
                <tr key={s._id}>
                  <td>#{i + 1}</td>

                  <td>
                    <img src={s.image} className="admin-thumb" alt={s.name} />
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
                            snackReport.reduce((sum) => sum + 1, 0) * 100
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

        {tab === "payments" && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Khách hàng</th>
                <th>Email</th>
                <th>Mã booking</th>
                <th>Phương thức</th>
                <th>Số tiền</th>
                <th>Mã giao dịch</th>
                <th>Ngày</th>
              </tr>
            </thead>

            <tbody>
              {paymentReport.map((p, i) => (
                <tr key={p._id}>
                  <td>#{i + 1}</td>
                  <td>{p.userName}</td>
                  <td>{p.userEmail}</td>
                  <td>{p.bookingCode || "N/A"}</td>
                  <td>{formatMethod(p.method)}</td>
                  <td>{formatCurrency(p.amount)}</td>
                  <td>{p.transactionId}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString("vi-VN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </section>
  );
}