import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ProfilePage.css";

type User = {
  id: string;
  fullName: string;
  email: string;
  role: "USER" | "ADMIN";
  avatar?: string;
};

type SnackLine = { id: string; name: string; qty: number; total: number };

type Invoice = {
  id: string;
  movieTitle: string;
  cinema: string;
  date: string;
  time: string;
  seats: string[];
  ticketTotal: number;
  snackLines: SnackLine[];
  finalTotal: number;
  status: "unpaid" | "pending_confirmation" | "confirmed" | "failed";
};

type Promo = {
  id: string;
  title: string;
  discount: string;
};

export default function ProfilePage() {
  const navigate = useNavigate();

  // Lấy user từ localStorage
  const storedUser = localStorage.getItem("currentUser");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    navigate("/auth/login");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  // Lịch sử mua vé
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoiceFilter, setInvoiceFilter] = useState("");
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("invoices") || "[]");
    setInvoices(data);
  }, []);

  // Khuyến mãi đã lưu
  const [savedPromos, setSavedPromos] = useState<Promo[]>([]);
  const [promoFilter, setPromoFilter] = useState("");
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedPromos") || "[]");
    setSavedPromos(saved);
  }, []);

  const filteredInvoices = invoices.filter((inv) =>
    inv.movieTitle.toLowerCase().includes(invoiceFilter.toLowerCase())
  );

  const filteredPromos = savedPromos.filter((p) =>
    p.title.toLowerCase().includes(promoFilter.toLowerCase())
  );

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Thông tin cá nhân</h1>

        <div className="profile-card">
          <div className="profile-avatar">
            <img
              src={user.avatar || "/images/avatar/default-avatar.png"}
              alt={user.fullName}
            />
          </div>

          <div className="profile-info">
            <p>
              <strong>Họ và tên:</strong> {user.fullName}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Vai trò:</strong> {user.role === "ADMIN" ? "Quản trị" : "Người dùng"}
            </p>

            <button className="btn-logout" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Lịch sử mua vé */}
        <div className="profile-section">
          <h2>Lịch sử mua vé</h2>
          <input
            type="text"
            placeholder="Tìm phim..."
            value={invoiceFilter}
            onChange={(e) => setInvoiceFilter(e.target.value)}
            className="profile-search-input"
          />
          {filteredInvoices.length === 0 ? (
            <p>Không có vé phù hợp.</p>
          ) : (
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Phim</th>
                  <th>Rạp</th>
                  <th>Ngày - Giờ</th>
                  <th>Ghế</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td>{inv.movieTitle}</td>
                    <td>{inv.cinema}</td>
                    <td>
                      {inv.date} - {inv.time}
                    </td>
                    <td>{inv.seats.join(", ")}</td>
                    <td>{inv.finalTotal.toLocaleString("vi-VN")} đ</td>
                    <td>{inv.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Khuyến mãi đã lưu */}
        <div className="profile-section">
          <h2>Khuyến mãi đã lưu</h2>
          <input
            type="text"
            placeholder="Tìm khuyến mãi..."
            value={promoFilter}
            onChange={(e) => setPromoFilter(e.target.value)}
            className="profile-search-input"
          />
          {filteredPromos.length === 0 ? (
            <p>Không có khuyến mãi phù hợp.</p>
          ) : (
            <ul className="promo-list">
              {filteredPromos.map((promo) => (
                <li key={promo.id}>
                  {promo.title} - {promo.discount}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}