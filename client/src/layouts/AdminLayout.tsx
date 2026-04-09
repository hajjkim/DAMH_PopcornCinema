import { Outlet, NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "../styles/Admin/AdminLayout.css";
import logo from "../assets/images/logo/logo.png";

export default function AdminLayout() {
  const [openUser, setOpenUser] = useState(false);

  const userRef = useRef<HTMLDivElement>(null);

  const menu = [
    { path: "/admin/dashboard", label: "Thống kê", icon: "" },
    { path: "/admin/movies", label: "Quản lý phim", icon: "" },
    { path: "/admin/cinemas", label: "Rạp", icon: "" },
    { path: "/admin/auditoriums", label: "Phòng chiếu", icon: "" },
    { path: "/admin/showtimes", label: "Suất chiếu", icon: "" },
    { path: "/admin/orders", label: "Đơn hàng", icon: "" },
    { path: "/admin/snacks", label: "Bắp nước", icon: "" },
    { path: "/admin/users", label: "Người dùng", icon: "" },
    { path: "/admin/promotions", label: "Khuyến mãi", icon: "" },
    { path: "/admin/reports", label: "Báo cáo", icon: "" },
  ];

  // click ngoài để đóng
  useEffect(() => {
    const handleClick = (e: any) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setOpenUser(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <img src={logo} alt="Popcorn Cinema" />
        </div>

        <nav className="admin-sidebar-nav">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "active" : ""}`
              }
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          © 2026 Popcorn Cinema
        </div>
      </aside>

      {/* RIGHT */}
      <div className="admin-right">

        {/* HEADER */}
        <header className="admin-header">
          <div className="header-left">
            <button className="hamburger">☰</button>
            <input placeholder="Tìm kiếm..." />
          </div>

          <div className="header-right">

            {/*  USER */}
            <div
              className={`admin-user-dropdown ${openUser ? "active" : ""}`}
              ref={userRef}
            >
              <div
                className="admin-user"
                onClick={() => setOpenUser(!openUser)}
              >
                Admin ⬇
              </div>

              <div className="user-dropdown-menu">
                <button
                  onClick={() => {
                    localStorage.removeItem("currentUser");
                    window.location.href = "/auth/login";
                  }}
                >
                  🚪 Đăng xuất
                </button>
              </div>
            </div>

          </div>
        </header>

        {/* CONTENT */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}