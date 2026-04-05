import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../styles/Admin/Auditoriums/AdminAuditoriums.css";
import { auditoriumAPI } from "../../../services/movie.api";

type Auditorium = {
  _id: string;
  cinemaId: {
    _id: string;
    name: string;
  };
  name: string;
  totalRows: number;
  totalColumns: number;
  seatCapacity: number;
  status: "ACTIVE" | "INACTIVE";
};

export default function AdminAuditoriums() {
  const [auditoriums, setAuditoriums] = useState<Auditorium[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAuditoriums = async () => {
      try {
        setLoading(true);
        const response = await auditoriumAPI.getAll();
        setAuditoriums(response || []);
      } catch (err: any) {
        console.error("Error fetching auditoriums:", err);
        setError(err.message || "Failed to load auditoriums");
      } finally {
        setLoading(false);
      }
    };

    fetchAuditoriums();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn chắc chắn muốn xóa phòng này?")) {
      try {
        await auditoriumAPI.delete(id);
        setAuditoriums(auditoriums.filter((a) => a._id !== id));
        alert("Xóa phòng thành công!");
      } catch (err: any) {
        alert("Lỗi: " + (err.message || "Không thể xóa phòng"));
      }
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(auditoriums.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAuditoriums = auditoriums.slice(startIndex, startIndex + itemsPerPage);

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
        <Link to="/admin/auditoriums/create" className="admin-btn admin-btn-primary">
          + Thêm phòng
        </Link>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên phòng</th>
              <th>Rạp</th>
              <th>Hàng</th>
              <th>Cột</th>
              <th>Sức chứa</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {paginatedAuditoriums.map((a) => (
              <tr key={a._id}>
                <td>{a._id}</td>
                <td><strong>{a.name}</strong></td>
                <td>{a.cinemaId?.name || "N/A"}</td>
                <td>{a.totalRows}</td>
                <td>{a.totalColumns}</td>
                <td>{a.seatCapacity}</td>

                <td>
                  <span className={`admin-badge ${
                    a.status === "ACTIVE"
                      ? "admin-badge-success"
                      : "admin-badge-danger"
                  }`}>
                    {a.status === "ACTIVE" ? "Hoạt động" : "Tạm ngưng"}
                  </span>
                </td>

                <td>
                  <div className="admin-table-actions">
                    <Link to={`/admin/auditoriums/${a._id}`} className="admin-btn admin-btn-sm admin-btn-outline">
                      Chi tiết
                    </Link>

                    <Link to={`/admin/auditoriums/${a._id}/edit`} className="admin-btn admin-btn-sm admin-btn-outline">
                      Sửa
                    </Link>

                    <button 
                      className="admin-btn admin-btn-sm admin-btn-danger"
                      onClick={() => handleDelete(a._id)}
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
            Trang {currentPage} / {totalPages} ({auditoriums.length} phòng)
          </span>
          <div>
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="admin-btn admin-btn-sm admin-btn-outline"
              style={{ marginRight: "5px" }}
            >
              Trước
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="admin-btn admin-btn-sm admin-btn-outline"
            >
              Tiếp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
