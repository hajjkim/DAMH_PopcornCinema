import "../styles/layout.css";
import logo from "../assets/images/logo/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("currentUser");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  // đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="navbar">
      <div className="container nav-wrapper">
        {/* LOGO */}
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Popcorn Cinema" />
          </Link>
        </div>

        {/* MENU */}
        <nav className="nav-menu">
          <Link to="/">Trang chủ</Link>
          <Link to="/movies">Phim</Link>
          <Link to="/showtimes">Lịch chiếu</Link>
          <Link to="/promotions">Khuyến mãi</Link>
        </nav>

        {/* ACTIONS */}
        <div className="nav-actions">
          {user ? (
            <div className="nav-user" ref={dropdownRef}>
              <button
                className="nav-user-trigger"
                onClick={() => setOpen(!open)}
              >
                Xin chào, {user.fullName}
              </button>

              {open && (
                <div className="nav-user-dropdown">
                  <Link to="/profile" onClick={() => setOpen(false)}>
                    Thông tin cá nhân
                  </Link>

                  {user.role === "ADMIN" && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setOpen(false)}
                    >
                      Quản trị
                    </Link>
                  )}

                  <button
                    className="nav-logout-btn"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/auth/login" className="nav-auth-btn">
                Đăng nhập
              </Link>

              <Link to="/auth/register" className="nav-auth-btn">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}