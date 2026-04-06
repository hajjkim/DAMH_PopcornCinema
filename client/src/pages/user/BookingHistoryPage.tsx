import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";
import BookingHistory from "./BookingHistoryModal";

export default function BookingHistoryPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/auth/login");
    }
  }, [navigate]);

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "24px",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <h1
        style={{
          fontSize: "28px",
          fontWeight: 700,
          marginBottom: "24px",
          color: "#0f172a",
        }}
      >
        Lịch sử giao dịch
      </h1>
      <BookingHistory />
    </div>
  );
}
