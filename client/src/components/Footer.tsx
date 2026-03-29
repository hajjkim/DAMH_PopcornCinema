import "../styles/layout.css";
import logo from "@/assets/images/logo/logo.png";
import fb from "@/assets/images/logo/FB.png";
import tt from "@/assets/images/logo/TT.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-wrapper">
        
        {/* LEFT */}
        <div className="footer-left">
          <div className="footer-col">
            <h4>GIỚI THIỆU</h4>
            <ul className="footer-links">
              <li><a href="#">Về chúng tôi</a></li>
              <li><a href="#">Điều khoản sử dụng</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>HỖ TRỢ</h4>
            <ul className="footer-links">
              <li><a href="#">Trung tâm trợ giúp</a></li>
              <li><a href="#">Liên hệ</a></li>
              <li><a href="#">Câu hỏi thường gặp</a></li>
            </ul>
          </div>
        </div>

        {/* RIGHT */}
        <div className="footer-right">
          
          {/* ✅ LOGO */}
          <img src={logo} className="footer-brand" alt="logo" />

          {/* ✅ SOCIAL */}
          <div className="footer-socials">
            <img src={fb} alt="Facebook" />
            <img src={tt} alt="TikTok" />
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        © 2026 Popcorn Cinema. All Rights Reserved.
      </div>
    </footer>
  );
}