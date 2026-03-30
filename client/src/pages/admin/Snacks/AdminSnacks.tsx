import { Link } from "react-router-dom";
import "../../../styles/Admin/Snacks/AdminSnack.css";

const snacks = [
  {
    id: 1,
    name: "Combo 1",
    type: "COMBO",
    price: 50000,
    status: "ACTIVE",
    image: "https://placehold.co/100x100",
    description: "Combo bắp + nước",
  },
];

export default function AdminSnacks() {
  return (
    <section className="admin-page-section">

      {/* FILTER + ACTION */}
      <div className="admin-page-actions snack-actions">
        <div className="snack-filter">
          <input placeholder="Tìm theo tên..." />

          <select>
            <option>Tất cả loại</option>
            <option>Combo</option>
            <option>Bắp</option>
            <option>Nước</option>
          </select>

          <select>
            <option>Tất cả trạng thái</option>
            <option>Đang bán</option>
            <option>Ngưng bán</option>
          </select>
        </div>

        <Link to="/admin/snacks/create" className="admin-btn admin-btn-primary">
          + Thêm món
        </Link>
      </div>

      {/* TABLE */}
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ảnh</th>
              <th>Tên</th>
              <th>Loại</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {snacks.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>

                <td>
                  <img src={s.image} className="snack-thumb" />
                </td>

                <td>
                  <strong>{s.name}</strong>
                  <br />
                  <small>{s.description}</small>
                </td>

                <td>{s.type}</td>

                <td>{s.price.toLocaleString()}đ</td>

                <td>
                  <span className={`admin-badge ${
                    s.status === "ACTIVE"
                      ? "admin-badge-success"
                      : "admin-badge-danger"
                  }`}>
                    {s.status === "ACTIVE" ? "Đang bán" : "Ngưng"}
                  </span>
                </td>

                <td>
                  <div className="admin-table-actions">
                    <Link to={`/admin/snacks/${s.id}`} className="admin-btn admin-btn-sm admin-btn-outline">
                      Chi tiết
                    </Link>

                    <Link to={`/admin/snacks/${s.id}/edit`} className="admin-btn admin-btn-sm admin-btn-outline">
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