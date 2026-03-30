import { Link } from "react-router-dom";
import "../../../styles/Admin/Orders/AdminOrder.css";

export default function AdminOrderDetail() {
  const order = {
    id: 1,
    orderCode: "ORD001",
    customerName: "Nguyễn Văn A",
    email: "a@gmail.com",
    phone: "0123456789",
    movieTitle: "Thỏ ơi!!!",
    cinemaName: "CGV",
    showDate: "2025-06-01",
    showTime: "10:00",
    seats: ["A1", "A2"],
    totalAmount: 120000,
    paymentMethod: "Momo",
    status: "PAID",
    createdAt: "2025-05-01",
  };

  return (
    <section className="admin-page-section">

      <div className="admin-page-actions">
        <Link to="/admin/orders" className="admin-btn admin-btn-outline">← Quay lại</Link>
        <Link to={`/admin/orders/${order.id}/edit`} className="admin-btn admin-btn-primary">Sửa</Link>
      </div>

      <div className="admin-card">
        <div className="detail-grid">
          <p><b>Mã đơn:</b> {order.orderCode}</p>
          <p><b>Khách:</b> {order.customerName}</p>
          <p><b>Email:</b> {order.email}</p>
          <p><b>Phone:</b> {order.phone}</p>
          <p><b>Phim:</b> {order.movieTitle}</p>
          <p><b>Rạp:</b> {order.cinemaName}</p>
          <p><b>Ngày:</b> {order.showDate}</p>
          <p><b>Giờ:</b> {order.showTime}</p>
          <p><b>Ghế:</b> {order.seats.join(", ")}</p>
          <p><b>Tổng:</b> {order.totalAmount.toLocaleString()}đ</p>
          <p><b>Thanh toán:</b> {order.paymentMethod}</p>

          <p>
            <b>Trạng thái:</b>{" "}
            <span className="admin-badge admin-badge-success">
              Đã thanh toán
            </span>
          </p>

          <p><b>Ngày tạo:</b> {order.createdAt}</p>
        </div>
      </div>
    </section>
  );
}