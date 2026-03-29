import { Link } from "react-router-dom";
import "../../../styles/Admin/Orders/AdminOrder.css";

const orders = [
  {
    id: 1,
    orderCode: "ORD001",
    customerName: "Nguyễn Văn A",
    movieTitle: "Thỏ ơi!!!",
    cinemaName: "CGV",
    totalAmount: 120000,
    paymentMethod: "Momo",
    status: "PAID",
  },
];

export default function AdminOrders() {
  return (
    <section className="admin-page-section">

      {/* FILTER */}
      <div className="admin-card">
        <div className="admin-filter-form">
          <div className="admin-form-group">
            <label>Từ khóa</label>
            <input placeholder="Mã đơn, khách hàng..." />
          </div>

          <div className="admin-form-group">
            <label>Trạng thái</label>
            <select>
              <option>Tất cả</option>
              <option value="PENDING">Chờ thanh toán</option>
              <option value="PAID">Đã thanh toán</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Phim</th>
              <th>Rạp</th>
              <th>Tổng tiền</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td><strong>{o.orderCode}</strong></td>
                <td>{o.customerName}</td>
                <td>{o.movieTitle}</td>
                <td>{o.cinemaName}</td>
                <td>{o.totalAmount.toLocaleString()}đ</td>
                <td>{o.paymentMethod}</td>

                <td>
                  <span className={`admin-badge ${
                    o.status === "PAID"
                      ? "admin-badge-success"
                      : o.status === "PENDING"
                      ? "admin-badge-warning"
                      : "admin-badge-danger"
                  }`}>
                    {o.status === "PAID"
                      ? "Đã thanh toán"
                      : o.status === "PENDING"
                      ? "Chờ thanh toán"
                      : "Đã hủy"}
                  </span>
                </td>

                <td>
                  <div className="admin-table-actions">
                    <Link to={`/admin/orders/${o.id}`} className="admin-btn admin-btn-sm admin-btn-outline">
                      Chi tiết
                    </Link>

                    <Link to={`/admin/orders/${o.id}/edit`} className="admin-btn admin-btn-sm admin-btn-outline">
                      Sửa
                    </Link>

                    <button className="admin-btn admin-btn-sm admin-btn-danger">
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}