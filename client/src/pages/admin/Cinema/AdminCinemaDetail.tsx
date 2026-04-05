import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../../../styles/Admin/Cinemas/AdminCinemas.css";
import { cinemaAPI } from "../../../services/admin.api";

export default function AdminCinemaDetail() {
  const { id } = useParams<{ id: string }>();
  const [cinema, setCinema] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCinema = async () => {
      if (!id) return;
      try {
        const data = await cinemaAPI.getById(id);
        setCinema(data);
      } catch (err: any) {
        console.error("Error fetching cinema:", err);
        setError(err.message || "Không thể tải dữ liệu rạp");
      } finally {
        setLoading(false);
      }
    };

    fetchCinema();
  }, [id]);

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

  if (!cinema) {
    return (
      <section className="admin-page-section">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Rạp không tìm thấy</p>
        </div>
      </section>
    );
  }

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