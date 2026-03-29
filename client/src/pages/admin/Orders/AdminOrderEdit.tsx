import { useState } from "react";
import "../../../styles/Admin/Orders/AdminOrder.css";

export default function AdminOrderEdit() {
  const [form, setForm] = useState({
    paymentMethod: "Momo",
    status: "PAID",
  });

  return (
    <section className="admin-page-section">
      <div className="admin-card">
        <form className="admin-form-grid">

          <div className="admin-form-group">
            <label>Mã đơn</label>
            <input value="ORD001" disabled />
          </div>

          <div className="admin-form-group">
            <label>Khách hàng</label>
            <input value="Nguyễn Văn A" disabled />
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