import "../../../styles/Admin/Promotions/AdminPromotion.css";

export default function AdminPromotionEdit() {
  return (
    <section className="admin-page-section">
      <div className="admin-card">

        <form className="admin-form-grid">

          <input defaultValue="SALE50" />
          <input defaultValue="Giảm 50%" />

          <select>
            <option>PERCENT</option>
            <option>AMOUNT</option>
          </select>

          <input type="number" defaultValue="50" />
          <input type="date" />
          <input type="date" />

          <div className="admin-form-actions">
            <button className="admin-btn admin-btn-outline">Hủy</button>
            <button className="admin-btn admin-btn-primary">Cập nhật</button>
          </div>

        </form>

      </div>
    </section>
  );
}