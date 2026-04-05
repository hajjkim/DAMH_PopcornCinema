import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../../styles/Admin/Orders/AdminOrder.css";

export default function AdminOrderEdit() {
  const { id } = useParams();
  const [form, setForm] = useState({
    paymentMethod: "Momo",
    status: "PAID",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState("");
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/bookings/${id}`);
        if (!response.ok) throw new Error("Failed to fetch order");
        const data = await response.json();
        setOrderCode(data._id);
        setCustomerName(data.user?.fullName || "");
        setForm({
          paymentMethod: data.paymentMethod || "Momo",
          status: data.status || "PAID",
        });
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

  return (
    <section className="admin-page-section">
      <div className="admin-card">
        <form className="admin-form-grid">

          <div className="admin-form-group">
            <label>Mã đơn</label>
            <input value={orderCode} disabled />
          </div>

          <div className="admin-form-group">
            <label>Khách hàng</label>
            <input value={customerName} disabled />
          </div>

          <div className="admin-form-group">
            <label>Thanh toán</label>
            <select
              value={form.paymentMethod}
              onChange={(e) => setForm({...form, paymentMethod: e.target.value})}
            >
              <option>Momo</option>
              <option>ZaloPay</option>
              <option>VNPay</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label>Trạng thái</label>
            <select
              value={form.status}
              onChange={(e) => setForm({...form, status: e.target.value})}
            >
              <option value="PENDING">Chờ</option>
              <option value="PAID">Đã thanh toán</option>
              <option value="CANCELLED">Hủy</option>
            </select>
          </div>

          <div className="admin-form-actions">
            <button className="admin-btn admin-btn-outline">Hủy</button>
            <button className="admin-btn admin-btn-primary">Cập nhật</button>
          </div>

        </form>
      </div>
    </section>
  );
}