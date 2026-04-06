import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../styles/Admin/Orders/AdminOrder.css";
import { bookingAPI } from "../../../services/admin.api";

type Order = {
  _id: string;
  bookingCode?: string;
  seats?: string[];
  user?: { fullName: string };
  userId?: string;
  showtime?: {
    movieId?: { title: string };
    auditoriumId?: { name: string; cinemaId?: { name: string } };
  };
  showtimeId?: string;
  ticketTotal?: number;
  snackTotal?: number;
  finalTotal?: number;
  paymentMethod?: string;
  status: "pending_payment" | "pending_confirmation" | "confirmed" | "failed";
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

  // Helper function to format seats - handle both ObjectIds and seat strings
  const formatSeats = (seats?: string[]): string => {
    if (!seats || seats.length === 0) return "N/A";
    
    // If seats are readable format (like A1, B2), just join them
    const readableSeats = seats.filter(s => /^[A-Z]\d+$/.test(s));
    if (readableSeats.length === seats.length) {
      return readableSeats.join(", ");
    }
    
    // If we have ObjectIds mixed in, just show count for now
    const hasObjectIds = seats.some(s => /^[0-9a-f]{24}$/.test(s));
    if (hasObjectIds) {
      return `${seats.length} ghế`;
    }
    
    return seats.join(", ");
  };

  const refreshOrders = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await bookingAPI.getAll();
      setOrders(response || []);
      setFilteredOrders(response || []);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      if (!silent) setError(err.message || "Failed to load orders");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    refreshOrders();
  }, []);

  // Auto-poll every 8s while any order is pending_confirmation (waiting for SePay webhook)
  useEffect(() => {
    const hasPending = orders.some((o) => o.status === "pending_confirmation");
    if (!hasPending) return;
    const id = setInterval(() => refreshOrders(true), 8000);
    return () => clearInterval(id);
  }, [orders]);

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
              <option value="pending_payment">Chờ thanh toán</option>
              <option value="pending_confirmation">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="failed">Thất bại</option>
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
              <th>Ghế</th>
              <th>Khách hàng</th>
              <th>Phim</th>
              <th>Rạp</th>
              <th>Phòng chiếu</th>
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
                <td><strong>{formatSeats(o.seats)}</strong></td>
                <td>{o.user?.fullName || "Unknown"}</td>
                <td>{o.showtime?.movieId?.title || "N/A"}</td>
                <td>{o.showtime?.auditoriumId?.cinemaId?.name || "N/A"}</td>
                <td>{o.showtime?.auditoriumId?.name || "N/A"}</td>
                <td><strong>{(o.finalTotal || 0).toLocaleString("vi-VN")} đ</strong></td>
                <td>QR Code</td>

                <td>
                  <span className={`admin-badge ${
                    o.status === "confirmed"
                      ? "admin-badge-success"
                      : o.status === "pending_payment"
                      ? "admin-badge-warning"
                      : "admin-badge-danger"
                  }`}>
                    {o.status === "confirmed"
                      ? "Đã xác nhận"
                      : o.status === "pending_payment"
                      ? "Chờ thanh toán"
                      : o.status === "pending_confirmation"
                      ? "Chờ xác nhận"
                      : "Thất bại"}
                  </span>
                </td>

                <td>
                  <div className="admin-table-actions">
                    <Link to={`/admin/orders/${o._id}`} className="admin-btn admin-btn-sm admin-btn-outline">
                      Chi tiết
                    </Link>


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