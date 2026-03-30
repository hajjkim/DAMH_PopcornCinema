import { Outlet, NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "../styles/Admin/AdminLayout.css";
import logo from "../assets/images/logo/logo.png";

export default function AdminLayout() {
  const [openNoti, setOpenNoti] = useState(false);
  const [openUser, setOpenUser] = useState(false);

  const notiRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const menu = [
    { path: "/admin/dashboard", label: "Thống kê", icon: "▦" },
    { path: "/admin/movies", label: "Quản lý phim", icon: "🎬" },
    { path: "/admin/cinemas", label: "Rạp", icon: "🎯" },
    { path: "/admin/showtimes", label: "Suất chiếu", icon: "🕒" },
    { path: "/admin/orders", label: "Đơn hàng", icon: "📦" },
    { path: "/admin/snacks", label: "Bắp nước", icon: "🍿" },
    { path: "/admin/users", label: "Người dùng", icon: "👤" },
    { path: "/admin/promotions", label: "Khuyến mãi", icon: "🎟️" },
    { path: "/admin/reports", label: "Báo cáo", icon: "📊" },
  ];

  // click ngoài để đóng
  useEffect(() => {
    const handleClick = (e: any) => {
      if (notiRef.current && !notiRef.current.contains(e.target)) {
        setOpenNoti(false);
      }
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

            {/* 🔔 NOTIFICATION */}
            <div
              className={`admin-notification ${openNoti ? "active" : ""}`}
              ref={notiRef}
            >
              <button
                className="notification-btn"
                onClick={() => setOpenNoti(!openNoti)}
              >
                🔔
                <span className="notification-badge">3</span>
              </button>

              <div className="notification-dropdown">
                <div className="noti-header">
                  <h4>🔔 Thông báo</h4>
                </div>

                <div className="noti-item success">
                  <div>🛒</div>
                  <div>
                    <strong>Đơn hàng mới</strong>
                    <span>5 đơn hàng mới</span>
                  </div>
                </div>

                <div className="noti-item warning">
                  <div>🔥</div>
                  <div>
                    <strong>Phim hot</strong>
                    <span>Đang bán chạy</span>
                  </div>
                </div>

                <div className="noti-item info">
                  <div>⚙️</div>
                  <div>
                    <strong>Hệ thống</strong>
                    <span>Cập nhật thành công</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 👤 USER */}
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