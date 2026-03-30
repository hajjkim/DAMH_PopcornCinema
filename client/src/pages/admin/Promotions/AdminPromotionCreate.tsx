import { useState } from "react";
import "../../../styles/Admin/Promotions/AdminPromotion.css";

export default function AdminPromotionCreate() {
  const [form, setForm] = useState({
    title: "",
    code: "",
    discountType: "PERCENT",
    discountValue: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
  });

  return (
    <section className="admin-page-section">
      <div className="admin-card">

        <form className="admin-form-grid">

          <input placeholder="Tên khuyến mãi" />
          <input placeholder="Mã" />

          <select>
            <option value="PERCENT">%</option>
            <option value="AMOUNT">VNĐ</option>
          </select>

          <input type="number" placeholder="Giá trị giảm" />
          <input type="date" />
          <input type="date" />

          <select>
            <option>ACTIVE</option>
            <option>INACTIVE</option>
          </select>

          <input type="file" />

          <textarea placeholder="Mô tả" />

          <div className="admin-form-actions">
            <button className="admin-btn admin-btn-outline">Hủy</button>
            <button className="admin-btn admin-btn-primary">Lưu</button>
          </div>

        </form>

      </div>
    </section>
  );
}