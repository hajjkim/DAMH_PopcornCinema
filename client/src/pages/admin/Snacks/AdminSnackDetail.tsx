import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "../../../styles/Admin/Snacks/AdminSnack.css";
import { snackAPI } from "../../../services/admin.api";

export default function AdminSnackDetail() {
  const { id } = useParams<{ id: string }>();
  const [snack, setSnack] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSnack = async () => {
      if (!id) return;
      try {
        const data = await snackAPI.getById(id);
        setSnack(data);
      } catch (err: any) {
        console.error("Error fetching snack:", err);
        setError(err.message || "Không thể tải dữ liệu đồ ăn");
      } finally {
        setLoading(false);
      }
    };

    fetchSnack();
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

  if (!snack) {
    return (
      <section className="admin-page-section">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Đồ ăn không tìm thấy</p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page-section">

      <div className="admin-card snack-detail">
        {snack.imageUrl && <img src={snack.imageUrl} className="snack-detail-img" alt={snack.name} />}

        <div>
          <h2>{snack.name}</h2>

          <p>Loại: {snack.category}</p>
          <p>Giá: {snack.price?.toLocaleString()}₫</p>
          <p>Trạng thái: {snack.status}</p>
          <p>{snack.description}</p>

          <div className="admin-form-actions">
            <Link to="/admin/snacks" className="admin-btn admin-btn-outline">Quay lại</Link>
            <Link to={`/admin/snacks/${id}/edit`} className="admin-btn admin-btn-primary">Sửa</Link>
          </div>
        </div>
      </div>
    </section>
  );
}