import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { bookingAPI } from "../../../services/admin.api";
import "../../../styles/Admin/Orders/AdminOrder.css";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error("Order ID is required");
        const data = await bookingAPI.getById(id);
        setOrder(data);
        setError(null);
      } catch (err: any) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (loading) return <section className="admin-page-section"><p>Đang tải...</p></section>;
  if (error) return <section className="admin-page-section"><p style={{color: 'red'}}>Lỗi: {error}</p></section>;
  if (!order) return <section className="admin-page-section"><p>Không tìm thấy đơn hàng</p></section>;

  return (
    <section className="admin-page-section">

      <div className="admin-page-actions">
        <Link to="/admin/orders" className="admin-btn admin-btn-outline">← Quay lại</Link>
        <Link to={`/admin/orders/${order._id}/edit`} className="admin-btn admin-btn-primary">Sửa</Link>
      </div>

      <div className="admin-card">
        <div className="detail-grid">
          <p><b>Mã đơn:</b> {order._id}</p>
          <p><b>Khách:</b> {order.user?.fullName || 'N/A'}</p>
          <p><b>Email:</b> {order.user?.email || 'N/A'}</p>
          <p><b>Phone:</b> {order.user?.phone || 'N/A'}</p>
          <p><b>Phim:</b> {order.showtime?.movieId?.title || 'N/A'}</p>
          <p><b>Rạp:</b> {order.showtime?.auditoriumId?.cinemaId?.name || 'N/A'}</p>
          <p><b>Phòng chiếu:</b> {order.showtime?.auditoriumId?.name || 'N/A'}</p>
          <p><b>Ngày chiếu:</b> {order.showtime?.startTime ? new Date(order.showtime.startTime).toLocaleDateString('vi-VN') : 'N/A'}</p>
          <p><b>Giờ chiếu:</b> {order.showtime?.startTime ? new Date(order.showtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</p>
          <p><b>Ghế:</b> {order.seats?.join(", ") || 'N/A'}</p>
          <p><b>Tổng tiền ghế:</b> <strong>{order.ticketTotal?.toLocaleString("vi-VN") || 0} đ</strong></p>
          <p><b>Tổng tiền snack:</b> <strong>{order.snackTotal?.toLocaleString("vi-VN") || 0} đ</strong></p>
          <p><b>Tổng cộng:</b> <strong>{order.finalTotal?.toLocaleString("vi-VN") || 0} đ</strong></p>

          <p>
            <b>Trạng thái:</b>{" "}
            <span className={`admin-badge ${order.status === 'confirmed' ? 'admin-badge-success' : order.status === 'pending_payment' ? 'admin-badge-warning' : 'admin-badge-danger'}`}>
              {order.status === 'confirmed' ? 'Đã xác nhận' : order.status === 'pending_payment' ? 'Chờ thanh toán' : order.status === 'pending_confirmation' ? 'Chờ xác nhận' : 'Thất bại'}
            </span>
          </p>

          <p><b>Ngày tạo:</b> {new Date(order.createdAt).toLocaleDateString('vi-VN') || 'N/A'}</p>
        </div>
      </div>
    </section>
  );
}