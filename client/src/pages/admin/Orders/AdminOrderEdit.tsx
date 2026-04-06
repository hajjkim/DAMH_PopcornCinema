import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { bookingAPI } from "../../../services/admin.api";
import "../../../styles/Admin/Orders/AdminOrder.css";

export default function AdminOrderEdit() {
  const { id } = useParams();
  const [form, setForm] = useState({
    paymentMethod: "Momo",
    status: "confirmed",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState("");
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error("Order ID is required");
        const data = await bookingAPI.getById(id);
        setOrderCode(data._id);
        setCustomerName(data.user?.fullName || "");
        setForm({
          paymentMethod: data.paymentMethod || "Momo",
          status: data.status || "confirmed",
        });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await bookingAPI.update(id!, form);
      alert("Cập nhật thành công");
      window.history.back();
    } catch (err: any) {
      alert(err instanceof Error ? err.message : "Error updating booking");
    }
  };

  return (
    <section className="admin-page-section">
      <div className="admin-card">
        <form className="admin-form-grid" onSubmit={handleSubmit}>

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
              <option value="pending_payment">Chờ thanh toán</option>
              <option value="pending_confirmation">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="failed">Thất bại</option>
            </select>
          </div>

          <div className="admin-form-actions">
            <button type="button" className="admin-btn admin-btn-outline" onClick={() => window.history.back()}>Hủy</button>
            <button type="submit" className="admin-btn admin-btn-primary">Cập nhật</button>
          </div>

        </form>
      </div>
    </section>
  );
}