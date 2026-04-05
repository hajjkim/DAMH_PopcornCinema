import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
        const response = await fetch(`/api/bookings/${id}`);
        if (!response.ok) throw new Error("Failed to fetch order");
        const data = await response.json();
        setOrder(data);
        setError(null);
      } catch (err) {
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
          <p><b>Rạp:</b> {order.showtime?.auditoriumId?.cinema || 'N/A'}</p>
          <p><b>Ngày:</b> {order.showtime?.date || 'N/A'}</p>
          <p><b>Giờ:</b> {order.showtime?.time || 'N/A'}</p>
          <p><b>Ghế:</b> {order.seats?.join(", ") || 'N/A'}</p>
          <p><b>Tổng:</b> {order.totalPrice?.toLocaleString() || 0}đ</p>
          <p><b>Thanh toán:</b> {order.paymentMethod || 'N/A'}</p>

          <p>
            <b>Trạng thái:</b>{" "}
            <span className={`admin-badge ${order.status === 'PAID' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
              {order.status || 'N/A'}
            </span>
          </p>

          <p><b>Ngày tạo:</b> {new Date(order.createdAt).toLocaleDateString('vi-VN') || 'N/A'}</p>
        </div>
      </div>
    </section>
  );
}