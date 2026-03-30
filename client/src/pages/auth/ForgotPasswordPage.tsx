import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/LoginPage.css";
import logo from "../../assets/images/logo/logo.png";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("❌ Vui lòng nhập email");
      return;
    }

    // giả lập gửi mail
    setError("");
    setMessage("📧 Link đặt lại mật khẩu đã được gửi tới email của bạn!");
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
              Khôi phục mật khẩu 🔐 <br />
              An toàn & nhanh chóng ⚡ <br />
              Tiếp tục trải nghiệm 🎬
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="login-right">
          <div className="login-card">

            <h2>Quên mật khẩu</h2>
            <p className="login-sub">
              Nhập email để nhận link đặt lại mật khẩu
            </p>

            <form onSubmit={handleSubmit} className="login-form">

              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Nhập email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && <p className="login-error">{error}</p>}
              {message && <p className="login-success">{message}</p>}

              <button className="login-btn">
                Gửi yêu cầu
              </button>

              <p className="login-footer">
                Nhớ mật khẩu?{" "}
                <Link to="/auth/login">Đăng nhập</Link>
              </p>

            </form>

          </div>
        </div>

      </div>
    </div>
  );
}