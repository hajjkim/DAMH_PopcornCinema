import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "../../services/api";

export default function PaymentCancelPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const bookingId = searchParams.get("bookingId");
    const cancel = async () => {
      if (bookingId) {
        try {
          await apiRequest(`/bookings/${bookingId}/cancel`, {
            method: "PATCH",
            auth: true,
          });
        } catch {
          // already cancelled or confirmed — ignore
        }
      }
      setDone(true);
    };
    cancel();
  }, []);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => navigate("/booking-history"), 3000);
    return () => clearTimeout(t);
  }, [done, navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: "16px",
        textAlign: "center",
        padding: "40px",
      }}
    >
      <div style={{ fontSize: "48px" }}>❌</div>
      <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a" }}>
        Giao dịch đã bị huỷ
      </h2>
      <p style={{ color: "#64748b" }}>
        Vé của bạn đã được chuyển sang trạng thái <strong>Thất bại</strong>.
        <br />
        Bạn sẽ được chuyển đến lịch sử giao dịch sau vài giây...
      </p>
      <button
        style={{
          marginTop: "8px",
          padding: "10px 24px",
          background: "#facc15",
          border: "none",
          borderRadius: "8px",
          fontWeight: 700,
          cursor: "pointer",
          fontSize: "15px",
        }}
        onClick={() => navigate("/booking-history")}
      >
        Xem lịch sử đặt vé
      </button>
    </div>
  );
}
