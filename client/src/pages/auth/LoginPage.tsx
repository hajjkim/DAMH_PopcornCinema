import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/LoginPage.css";
import logo from "../../assets/images/logo/logo.png";
import { loginApi } from "../../services/auth.api";
import { saveAuth } from "../../utils/auth";

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
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("❌ Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);

    try {
      const data = await loginApi(form.email, form.password);

      saveAuth(data.token, {
        _id: data.user._id,
        fullName: data.user.fullName,
        email: data.user.email,
        phone: data.user.phone,
        avatar: data.user.avatar,
        role: data.user.role,
        status: data.user.status,
      });

      if (data.user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err: any) {

      setError(err.message || "❌ Sai email hoặc mật khẩu");
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
              Đặt vé nhanh chóng 🎬 <br />
              Nhận ưu đãi hấp dẫn 🍿 <br />
              Trải nghiệm điện ảnh đỉnh cao
            </p>
          </div>
        </div>

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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>

              {error && <p className="login-error">{error}</p>}
              <button className="login-btn" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>

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
