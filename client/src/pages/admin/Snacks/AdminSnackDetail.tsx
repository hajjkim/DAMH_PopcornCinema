import { Link } from "react-router-dom";
import "../../../styles/Admin/Snacks/AdminSnack.css";

export default function AdminSnackDetail() {
  const snack = {
    id: 1,
    name: "Combo 1",
    image: "https://placehold.co/300",
    type: "COMBO",
    price: 50000,
    status: "ACTIVE",
    description: "Combo bắp + nước",
  };

  return (
    <section className="admin-page-section">

      <div className="admin-card snack-detail">
        <img src={snack.image} className="snack-detail-img" />

        <div>
          <h2>{snack.name}</h2>

          <p>Loại: {snack.type}</p>
          <p>Giá: {snack.price.toLocaleString()}đ</p>
          <p>Trạng thái: {snack.status}</p>
          <p>{snack.description}</p>

          <div className="admin-form-actions">
            <Link to="/admin/snacks" className="admin-btn admin-btn-outline">Quay lại</Link>
            <Link to={`/admin/snacks/${snack.id}/edit`} className="admin-btn admin-btn-primary">Sửa</Link>
          </div>
        </div>
      </div>
    </section>
  );
}