import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../../../styles/Admin/Auditoriums/AdminAuditoriums.css";
import { auditoriumAPI } from "../../../services/movie.api";

export default function AdminAuditoriumDetail() {
  const { id } = useParams<{ id: string }>();
  const [auditorium, setAuditorium] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAuditorium = async () => {
      if (!id) return;
      try {
        const data = await auditoriumAPI.getById(id);
        setAuditorium(data);
      } catch (err: any) {
        console.error("Error fetching auditorium:", err);
        setError(err.message || "Không thể tải dữ liệu phòng");
      } finally {
        setLoading(false);
      }
    };

    fetchAuditorium();
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

  if (!auditorium) {
    return (
      <section className="admin-page-section">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Phòng không tìm thấy</p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page-section">

      <div className="admin-page-actions">
        <Link to="/admin/auditoriums" className="admin-btn admin-btn-outline">
          ← Quay lại
        </Link>

        <Link to={`/admin/auditoriums/${id}/edit`} className="admin-btn admin-btn-primary">
          Sửa phòng
        </Link>
      </div>

      <div className="admin-card">
        <h2>Chi tiết phòng chiếu</h2>
        <div className="auditorium-detail-grid">

          <div>
            <strong>Mã phòng:</strong> {auditorium._id}
          </div>

          <div>
            <strong>Tên phòng:</strong> {auditorium.name}
          </div>

          <div>
            <strong>Rạp:</strong> {auditorium.cinemaId?.name || "N/A"}
          </div>

          <div>
            <strong>Số hàng:</strong> {auditorium.totalRows}
          </div>

          <div>
            <strong>Số cột:</strong> {auditorium.totalColumns}
          </div>

          <div>
            <strong>Sức chứa:</strong> {auditorium.seatCapacity} ghế
          </div>

          <div>
            <strong>Trạng thái:</strong>{" "}
            <span className={`admin-badge ${
              auditorium.status === "ACTIVE"
                ? "admin-badge-success"
                : "admin-badge-danger"
            }`}>
              {auditorium.status === "ACTIVE" ? "Hoạt động" : "Tạm ngưng"}
            </span>
          </div>

          <div>
            <strong>Ngày tạo:</strong> {new Date(auditorium.createdAt).toLocaleString('vi-VN')}
          </div>

          <div>
            <strong>Cập nhật lần cuối:</strong> {new Date(auditorium.updatedAt).toLocaleString('vi-VN')}
          </div>

        </div>
      </div>
    </section>
  );
}
