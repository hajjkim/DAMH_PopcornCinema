import "../styles/layout.css";
import logo from "../assets/images/logo/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getCurrentUser, logout, isAuthenticated, type CurrentUser } from "../utils/auth";

export default function Header() {
  const navigate = useNavigate();

  const [user, setUser] = useState<CurrentUser | null>(getCurrentUser());
  const [authed, setAuthed] = useState(isAuthenticated());
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const syncAuthState = () => {
      setUser(getCurrentUser());
      setAuthed(isAuthenticated());
    };

    window.addEventListener("auth-changed", syncAuthState);

    return () => {
      window.removeEventListener("auth-changed", syncAuthState);
    };
  }, []);

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
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Popcorn Cinema" />
          </Link>
        </div>

        <nav className="nav-menu">
          <Link to="/">Trang chủ</Link>
          <Link to="/movies">Phim</Link>
          <Link to="/promotions">Khuyến mãi</Link>
        </nav>

        <div className="nav-actions">
          {authed && user ? (
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

                  <button className="nav-logout-btn" onClick={handleLogout}>
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
