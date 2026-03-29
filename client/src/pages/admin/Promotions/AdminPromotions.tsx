import { Link } from "react-router-dom";
import "../../../styles/Admin/Promotions/AdminPromotion.css";

const promotions = [
  {
    id: 1,
    title: "Giảm 50%",
    code: "SALE50",
    discountType: "PERCENT",
    discountValue: 50,
    startDate: "2026-01-01",
    endDate: "2026-01-10",
    status: "ACTIVE",
    poster: "/images/promo.jpg",
  },
];

export default function AdminPromotions() {
  return (
    <section className="admin-page-section">

      <div className="admin-page-actions">
        <Link to="/admin/promotions/create" className="admin-btn admin-btn-primary">
          + Thêm khuyến mãi
        </Link>
      </div>

      {/* FILTER */}
      <div className="admin-card">
        <div className="admin-promotion-filter">
          <input placeholder="Tên hoặc mã..." />

          <select>
            <option>Tất cả loại</option>
            <option>Phần trăm</option>
            <option>Tiền mặt</option>
          </select>

          <select>
            <option>Tất cả trạng thái</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Poster</th>
              <th>Tên</th>
              <th>Mã</th>
              <th>Loại</th>
              <th>Giá trị</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {promotions.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>

                <td>
                  <img src={p.poster} className="admin-promotion-thumb" />
                </td>

                <td><strong>{p.title}</strong></td>
                <td>{p.code}</td>

                <td>
                  {p.discountType === "PERCENT" ? "Phần trăm" : "Tiền"}
                </td>

                <td>
                  {p.discountType === "PERCENT"
                    ? `${p.discountValue}%`
                    : `${p.discountValue.toLocaleString()}đ`}
                </td>

                <td>{p.startDate} - {p.endDate}</td>

                <td>
                  <span className={`admin-badge ${
                    p.status === "ACTIVE"
                      ? "admin-badge-success"
                      : "admin-badge-secondary"
                  }`}>
                    {p.status}
                  </span>
                </td>

                <td>
                  <div className="admin-table-actions">
                    <Link to={`/admin/promotions/${p.id}`} className="admin-btn admin-btn-sm admin-btn-outline">
                      Chi tiết
                    </Link>

                    <Link to={`/admin/promotions/${p.id}/edit`} className="admin-btn admin-btn-sm admin-btn-outline">
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