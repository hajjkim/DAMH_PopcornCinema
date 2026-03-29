import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/LoginPage.css";
import logo from "../../assets/images/logo/logo.png";

type RegisterForm = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // validate
    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      setError("❌ Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (form.password.length < 6) {
      setError("❌ Mật khẩu phải ≥ 6 ký tự");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("❌ Mật khẩu không khớp");
      return;
    }

    console.log("Register data:", form);

    // TODO: gọi API

    alert("🎉 Đăng ký thành công!");
    navigate("/auth/login");
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
              Tạo tài khoản 🎬 <br />
              Nhận ưu đãi 🍿 <br />
              Trải nghiệm điện ảnh đỉnh cao
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="login-right">
          <div className="login-card">

            <h2>Đăng ký</h2>
            <p className="login-sub">Tạo tài khoản mới 🚀</p>

            <form onSubmit={handleSubmit} className="login-form">

              <div className="input-group">
                <label>Họ và tên</label>
                <input
                  name="fullName"
                  type="text"
                  placeholder="Nhập họ và tên..."
                  value={form.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Nhập email..."
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Mật khẩu</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu..."
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Xác nhận mật khẩu</label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu..."
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              {error && <p className="login-error">{error}</p>}

              <button type="submit" className="login-btn">
                Đăng ký
              </button>

              <p className="login-footer">
                Đã có tài khoản?{" "}
                <Link to="/auth/login">
                  Đăng nhập
                </Link>
              </p>

            </form>

          </div>
        </div>

      </div>
    </div>
  );
}