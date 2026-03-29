import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/LoginPage.css";
import logo from "../../assets/images/logo/logo.png";
import { users } from "../../data/users";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("❌ Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const user = users.find(
      (u) => u.email === form.email && u.password === form.password
    );

    if (!user) {
      setError("❌ Sai email hoặc mật khẩu");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    if (user.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* LEFT */}
        <div className="login-left">
          <div className="login-overlay"></div>

          <div className="login-left-content">
            <img src={logo} className="login-logo" />

            <h1>Popcorn Cinema</h1>
            <p>
              Đặt vé nhanh chóng 🎬 <br />
              Nhận ưu đãi hấp dẫn 🍿 <br />
              Trải nghiệm điện ảnh đỉnh cao
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="login-right">
          <div className="login-card">

            <h2>Đăng nhập</h2>
            <p className="login-sub">Chào mừng bạn quay lại 👋</p>

            <form onSubmit={handleSubmit} className="login-form">

              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Nhập email..."
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Nhập mật khẩu..."
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              {/* 🔐 QUÊN MẬT KHẨU */}
              <div className="login-extra">
                <Link to="/auth/forgot-password" className="forgot-link">
                  Quên mật khẩu?
                </Link>
              </div>

              {error && <p className="login-error">{error}</p>}

              <button className="login-btn">Đăng nhập</button>

              {/* 🔗 REGISTER */}
              <p className="login-footer">
                Chưa có tài khoản?{" "}
                <Link to="/auth/register" className="register-link">
                  Đăng ký
                </Link>
              </p>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
}