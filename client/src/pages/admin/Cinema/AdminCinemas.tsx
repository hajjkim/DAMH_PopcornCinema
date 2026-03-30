import { Link } from "react-router-dom";
import "../../../styles/Admin/Cinemas/AdminCinemas.css";

type Cinema = {
  id: number;
  name: string;
  address: string;
  city: string;
  totalRooms: number;
  phone: string;
  status: "ACTIVE" | "INACTIVE";
};

const cinemas: Cinema[] = [
  {
    id: 1,
    name: "CGV Vincom",
    address: "Quận 1",
    city: "Hồ Chí Minh",
    totalRooms: 5,
    phone: "0123456789",
    status: "ACTIVE",
  },
];

export default function AdminCinemas() {
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
            {cinemas.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
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
                    <Link to={`/admin/cinemas/${c.id}`} className="admin-btn admin-btn-sm admin-btn-outline">
                      Chi tiết
                    </Link>

                    <Link to={`/admin/cinemas/${c.id}/edit`} className="admin-btn admin-btn-sm admin-btn-outline">
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