import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../styles/Admin/Orders/AdminOrder.css";
import { bookingAPI } from "../../../services/admin.api";

type Order = {
  _id: string;
  bookingCode?: string;
  user?: { fullName: string };
  userId?: string;
  showtime?: any;
  showtimeId?: string;
  totalAmount?: number;
  paymentMethod?: string;
  status: "PENDING" | "PAID" | "CANCELLED";
  createdAt?: string;
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await bookingAPI.getAll();
        setOrders(response || []);
        setFilteredOrders(response || []);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Search by code or customer name
    if (search) {
      filtered = filtered.filter(
        (o) =>
          (o.bookingCode || "").toLowerCase().includes(search.toLowerCase()) ||
          (o.user?.fullName || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus) {
      filtered = filtered.filter((o) => o.status === filterStatus);
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [search, filterStatus, orders]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn chắc chắn muốn xóa đơn hàng này?")) {
      try {
        await bookingAPI.delete(id);
        setOrders(orders.filter((o) => o._id !== id));
        alert("Xóa đơn hàng thành công!");
      } catch (err: any) {
        alert("Lỗi: " + (err.message || "Không thể xóa đơn hàng"));
      }
    }
  };

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

      {/* FILTER */}
      <div className="admin-card">
        <div className="admin-filter-form">
          <div className="admin-form-group">
            <label>Từ khóa</label>
            <input
              placeholder="Mã đơn, khách hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label>Trạng thái</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">Tất cả</option>
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
            {paginatedOrders.map((o) => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td><strong>{o.bookingCode || "N/A"}</strong></td>
                <td>{o.user?.fullName || "Unknown"}</td>
                <td>{o.showtime?.movie?.title || "N/A"}</td>
                <td>{o.showtime?.cinema?.name || "N/A"}</td>
                <td>{(o.totalAmount || 0).toLocaleString()}đ</td>
                <td>{o.paymentMethod || "N/A"}</td>

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
                    <Link to={`/admin/orders/${o._id}`} className="admin-btn admin-btn-sm admin-btn-outline">
                      Chi tiết
                    </Link>

                    <Link to={`/admin/orders/${o._id}/edit`} className="admin-btn admin-btn-sm admin-btn-outline">
                      Sửa
                    </Link>

                    <button
                      className="admin-btn admin-btn-sm admin-btn-danger"
                      onClick={() => handleDelete(o._id)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="admin-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
        <p style={{ margin: 0 }}>
          Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredOrders.length)} trên {filteredOrders.length} đơn hàng
        </p>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            className="admin-btn admin-btn-outline"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Trước
          </button>
          <span style={{ padding: "0 15px" }}>Trang {currentPage} / {Math.max(totalPages, 1)}</span>
          <button
            className="admin-btn admin-btn-outline"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Sau →
          </button>
        </div>
      </div>
    </section>
  );
}