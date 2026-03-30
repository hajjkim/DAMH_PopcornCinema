import { useParams, Link } from "react-router-dom";
import "../../../styles/Admin/Cinemas/AdminCinemas.css";
export default function AdminCinemaDetail() {
  const { id } = useParams();

  const cinema = {
    id,
    name: "CGV Vincom",
    city: "HCM",
    address: "Quận 1",
    totalRooms: 5,
    phone: "0123456789",
    status: "ACTIVE",
  };

  return (
    <section className="admin-page-section">

      <div className="admin-page-actions">
        <Link to="/admin/cinemas" className="admin-btn admin-btn-outline">
          ← Quay lại
        </Link>

        <Link to={`/admin/cinemas/${id}/edit`} className="admin-btn admin-btn-primary">
          Sửa rạp
        </Link>
      </div>

      <div className="admin-card">
        <div className="cinema-detail-grid">

          <div>
            <strong>Tên rạp:</strong> {cinema.name}
          </div>

          <div>
            <strong>Thành phố:</strong> {cinema.city}
          </div>

          <div className="cinema-detail-item-full">
            <strong>Địa chỉ:</strong> {cinema.address}
          </div>

          <div>
            <strong>Số phòng:</strong> {cinema.totalRooms}
          </div>

          <div>
            <strong>Hotline:</strong> {cinema.phone}
          </div>

          <div>
            <strong>Trạng thái:</strong>{" "}
            <span className={`admin-badge ${
              cinema.status === "ACTIVE"
                ? "admin-badge-success"
                : "admin-badge-danger"
            }`}>
              {cinema.status === "ACTIVE" ? "Hoạt động" : "Tạm ngưng"}
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}