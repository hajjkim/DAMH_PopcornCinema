import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../styles/Admin/Promotions/AdminPromotion.css";
import { promotionAPI } from "../../../services/admin.api";

type Promotion = {
  _id: string;
  title: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "INACTIVE";
  poster: string;
};

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const response = await promotionAPI.getAll();
        setPromotions(response || []);
        setFilteredPromotions(response || []);
      } catch (err: any) {
        console.error("Error fetching promotions:", err);
        setError(err.message || "Failed to load promotions");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  useEffect(() => {
    let filtered = promotions;

    // Search by title or code
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.code.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by type
    if (filterType) {
      filtered = filtered.filter((p) => p.discountType === filterType);
    }

    // Filter by status
    if (filterStatus) {
      filtered = filtered.filter((p) => p.status === filterStatus);
    }

    setFilteredPromotions(filtered);
    setCurrentPage(1);
  }, [search, filterType, filterStatus, promotions]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPromotions = filteredPromotions.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn chắc chắn muốn xóa khuyến mãi này?")) {
      try {
        await promotionAPI.delete(id);
        setPromotions(promotions.filter((p) => p._id !== id));
        alert("Xóa khuyến mãi thành công!");
      } catch (err: any) {
        alert("Lỗi: " + (err.message || "Không thể xóa khuyến mãi"));
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
          <input
            placeholder="Tên hoặc mã..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">Tất cả loại</option>
            <option value="PERCENTAGE">Phần trăm</option>
            <option value="FIXED_AMOUNT">Tiền mặt</option>
          </select>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
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
            {paginatedPromotions.map((p) => (
              <tr key={p._id}>
                <td>{p._id}</td>

                <td>
                  <img src={p.poster} className="admin-promotion-thumb" alt={p.title} />
                </td>

                <td><strong>{p.title}</strong></td>
                <td>{p.code}</td>

                <td>
                  {p.discountType === "PERCENTAGE" ? "Phần trăm" : "Tiền"}
                </td>

                <td>
                  {p.discountType === "PERCENTAGE"
                    ? `${p.discountValue}%`
                    : `${p.discountValue.toLocaleString()}đ`}
                </td>

                <td>{new Date(p.startDate).toLocaleDateString("vi-VN")} - {new Date(p.endDate).toLocaleDateString("vi-VN")}</td>

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
                    <Link to={`/admin/promotions/${p._id}`} className="admin-btn admin-btn-sm admin-btn-outline">
                      Chi tiết
                    </Link>

                    <Link to={`/admin/promotions/${p._id}/edit`} className="admin-btn admin-btn-sm admin-btn-outline">
                      Sửa
                    </Link>

                    <button
                      className="admin-btn admin-btn-sm admin-btn-danger"
                      onClick={() => handleDelete(p._id)}
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
            Hiển thị {filteredPromotions.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + itemsPerPage, filteredPromotions.length)} trên {filteredPromotions.length} khuyến mãi
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