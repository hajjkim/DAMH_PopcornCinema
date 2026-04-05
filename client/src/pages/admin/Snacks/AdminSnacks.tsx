import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../styles/Admin/Snacks/AdminSnack.css";
import { snackAPI } from "../../../services/admin.api";

type Snack = {
  _id: string;
  name: string;
  category: string;
  price: number;
  status: "ACTIVE" | "INACTIVE";
  image: string;
  description: string;
};

export default function AdminSnacks() {
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [filteredSnacks, setFilteredSnacks] = useState<Snack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchSnacks = async () => {
      try {
        setLoading(true);
        const response = await snackAPI.getAll();
        setSnacks(response || []);
        setFilteredSnacks(response || []);
      } catch (err: any) {
        console.error("Error fetching snacks:", err);
        setError(err.message || "Failed to load snacks");
      } finally {
        setLoading(false);
      }
    };

    fetchSnacks();
  }, []);

  useEffect(() => {
    let filtered = snacks;

    // Search by name
    if (search) {
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by category
    if (filterType) {
      filtered = filtered.filter((s) => s.category === filterType);
    }

    // Filter by status
    if (filterStatus) {
      filtered = filtered.filter((s) => s.status === filterStatus);
    }

    setFilteredSnacks(filtered);
    setCurrentPage(1);
  }, [search, filterType, filterStatus, snacks]);

  // Pagination logic
  const totalPages = Math.ceil(filteredSnacks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSnacks = filteredSnacks.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn chắc chắn muốn xóa món này?")) {
      try {
        await snackAPI.delete(id);
        setSnacks(snacks.filter((s) => s._id !== id));
        alert("Xóa món ăn thành công!");
      } catch (err: any) {
        alert("Lỗi: " + (err.message || "Không thể xóa món ăn"));
      }
    }
  };

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

  // Get unique categories for filter dropdown
  const uniqueTypes = Array.from(new Set(snacks.map((s) => s.category)));

  return (
    <section className="admin-page-section">

      {/* FILTER + ACTION */}
      <div className="admin-page-actions snack-actions">
        <div className="snack-filter">
          <input
            placeholder="Tìm theo tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">Tất cả loại</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang bán</option>
            <option value="INACTIVE">Ngưng bán</option>
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
            {paginatedSnacks.map((s) => (
              <tr key={s._id}>
                <td>{s._id}</td>

                <td>
                  <img src={s.image} className="snack-thumb" alt={s.name} />
                </td>

                <td>
                  <strong>{s.name}</strong>
                  <br />
                  <small>{s.description}</small>
                </td>

                <td>{s.category}</td>

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
                    <Link to={`/admin/snacks/${s._id}`} className="admin-btn admin-btn-sm admin-btn-outline">
                      Chi tiết
                    </Link>

                    <Link to={`/admin/snacks/${s._id}/edit`} className="admin-btn admin-btn-sm admin-btn-outline">
                      Sửa
                    </Link>

                    <button
                      className="admin-btn admin-btn-sm admin-btn-danger"
                      onClick={() => handleDelete(s._id)}
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
            Hiển thị {filteredSnacks.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + itemsPerPage, filteredSnacks.length)} trên {filteredSnacks.length} món
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