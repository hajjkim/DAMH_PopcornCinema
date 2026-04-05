import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/LoginPage.css";
import logo from "../../assets/images/logo/logo.png";
import { registerApi } from "../../services/auth.api";
import { saveAuth } from "../../utils/auth";

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
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      setError("❌ Vui lòng nhập đầy đủ thông tin");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("❌ Mật khẩu phải ≥ 6 ký tự");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("❌ Mật khẩu không khớp");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await registerApi(form.fullName, form.email, form.password);

      saveAuth(data.token, {
        _id: data.user._id,
        fullName: data.user.fullName,
        email: data.user.email,
        phone: data.user.phone,
        avatar: data.user.avatar,
        role: data.user.role,
        status: data.user.status,
      });

      navigate("/");
    } catch (err: any) {
      setError(err.message || "❌ Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>

              {error && <p className="login-error">{error}</p>}

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Đang đăng ký..." : "Đăng ký"}
              </button>

              <p className="login-footer">
                Đã có tài khoản? <Link to="/auth/login">Đăng nhập</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}