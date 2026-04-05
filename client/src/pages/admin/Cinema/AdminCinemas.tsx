import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../styles/Admin/Cinemas/AdminCinemas.css";
import { cinemaAPI } from "../../../services/admin.api";

type Cinema = {
  _id: string;
  name: string;
  address: string;
  city: string;
  totalRooms: number;
  phone: string;
  status: "ACTIVE" | "INACTIVE";
};

export default function AdminCinemas() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        setLoading(true);
        const response = await cinemaAPI.getAll();
        setCinemas(response || []);
      } catch (err: any) {
        console.error("Error fetching cinemas:", err);
        setError(err.message || "Failed to load cinemas");
      } finally {
        setLoading(false);
      }
    };

    fetchCinemas();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn chắc chắn muốn xóa rạp này?")) {
      try {
        await cinemaAPI.delete(id);
        setCinemas(cinemas.filter((c) => c._id !== id));
        alert("Xóa rạp thành công!");
      } catch (err: any) {
        alert("Lỗi: " + (err.message || "Không thể xóa rạp"));
      }
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(cinemas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCinemas = cinemas.slice(startIndex, startIndex + itemsPerPage);

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

  return (
    <section className="admin-page-section">

      <div className="admin-page-actions">
        <Link to="/admin/cinemas/create" className="admin-btn admin-btn-primary">
          + Thêm rạp
        </Link>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên rạp</th>
              <th>Địa chỉ</th>
              <th>Thành phố</th>
              <th>Số phòng</th>
              <th>Hotline</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCinemas.map((c) => (
              <tr key={c._id}>
                <td>{c._id}</td>
                <td><strong>{c.name}</strong></td>
                <td>{c.address}</td>
                <td>{c.city}</td>
                <td>{c.totalRooms}</td>
                <td>{c.phone}</td>

                <td>
                  <span className={`admin-badge ${
                    c.status === "ACTIVE"
                      ? "admin-badge-success"
                      : "admin-badge-danger"
                  }`}>
                    {c.status === "ACTIVE" ? "Hoạt động" : "Tạm ngưng"}
                  </span>
                </td>

                <td>
                  <div className="admin-table-actions">
                    <Link to={`/admin/cinemas/${c._id}`} className="admin-btn admin-btn-sm admin-btn-outline">
                      Chi tiết
                    </Link>

                    <Link to={`/admin/cinemas/${c._id}/edit`} className="admin-btn admin-btn-sm admin-btn-outline">
                      Sửa
                    </Link>

                    <button 
                      className="admin-btn admin-btn-sm admin-btn-danger"
                      onClick={() => handleDelete(c._id)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px",
          borderTop: "1px solid #ddd",
        }}>
          <span>
            Hiển thị {cinemas.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + itemsPerPage, cinemas.length)} trên {cinemas.length} rạp
          </span>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="admin-btn admin-btn-outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              ← Trước
            </button>

            <span style={{ padding: "8px 12px", display: "flex", alignItems: "center" }}>
              Trang {currentPage} / {totalPages || 1}
            </span>

            <button
              className="admin-btn admin-btn-outline"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Sau →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}