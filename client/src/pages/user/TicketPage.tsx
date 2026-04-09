import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import "../../styles/TicketPage.css";
import { getMyBookings } from "../../services/booking.api";
import { getShowtimeById } from "../../services/showtime.api";
import { getMovieById, type Movie } from "../../services/movie.api";
import { apiRequest } from "../../services/api";

type BookingState = {
  bookingId?: string;
};

type BookingItem = {
  _id: string;
  showtimeId: string;
  seats: string[];
  ticketTotal: number;
  snackTotal?: number;
  finalTotal: number;
  promotionCode?: string;
  status: string;
  createdAt: string;
};

export default function TicketPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const state = (location.state as BookingState) || {};

  const bookingIdFromQuery = searchParams.get("bookingId") || searchParams.get("id") || undefined;
  const bookingIdFromStorage = (() => {
    try {
      const stored = JSON.parse(localStorage.getItem("invoices") || "[]");
      return stored?.[0]?.id as string | undefined;
    } catch {
      return undefined;
    }
  })();

  const bookingId = bookingIdFromQuery || state.bookingId || bookingIdFromStorage;

  const [booking, setBooking] = useState<BookingItem | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtime, setShowtime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBooking = async () => {
    if (!bookingId) {
      setError("Không tìm thấy mã vé");
      setLoading(false);
      return;
    }
    try {
      const list = await getMyBookings();
      const found = list.find((b) => b._id === bookingId);
      if (!found) {
        setError("Không tìm thấy vé của bạn");
        setLoading(false);
        return;
      }
      setBooking(found as any);

      const st = (found as any).showtime;
      if (!st) {
        setError("Không tìm thấy thông tin suất chiếu");
        setLoading(false);
        return;
      }
      setShowtime(st);

      if ((st as any).movieId) {
        const movieData = (st as any).movieId;
        if (typeof movieData === 'object' && movieData._id) {
          setMovie(movieData);
        } else if (typeof movieData === 'string') {
          const mv = await getMovieById(movieData);
          setMovie(mv);
        }
      }
    } catch (err: any) {
      console.error("Error loading ticket:", err);
      setError(err?.message || "Lỗi tải vé");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  // When arriving from SePay redirect, actively verify payment status with SePay API.
  // This confirms the booking immediately without needing IPN/ngrok.
  useEffect(() => {
    if (!bookingIdFromQuery) return; // only on SePay redirect
    const verify = async () => {
      try {
        await apiRequest("/payments/sepay/verify", {
          method: "POST",
          auth: true,
          body: JSON.stringify({ bookingId: bookingIdFromQuery }),
        });
        // Reload booking to pick up confirmed status
        await loadBooking();
      } catch {
        // Silently ignore — polling will still try
      }
    };
    verify();
  }, [bookingIdFromQuery]);

  // Poll every 5s while pending_confirmation — IPN may arrive shortly after redirect
  useEffect(() => {
    if (!booking || booking.status !== "pending_confirmation") return;
    const id = setInterval(() => loadBooking(), 5000);
    return () => clearInterval(id);
  }, [booking?.status]);

  const seatLabel = useMemo(
    () => (booking?.seats || []).join(", "),
    [booking?.seats]
  );

  const discountAmount = useMemo(() => {
    if (!booking) return 0;
    const subtotal = (booking.ticketTotal || 0) + (booking.snackTotal || 0);
    const discount = subtotal - (booking.finalTotal || 0);
    return Math.max(discount, 0);
  }, [booking]);

  const cinemaName: string = (showtime as any)?.auditoriumId?.cinemaId?.name || "";
  const hallName: string = (showtime as any)?.auditoriumId?.name || "";
  const startTime: Date | null = showtime?.startTime ? new Date(showtime.startTime) : null;
  const timeLabel = startTime
    ? startTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    : "";
  const dateLabel = startTime
    ? startTime.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "";

  if (loading) return <div className="ticket-page">Đang tải vé...</div>;
  if (error) return <div className="ticket-page error">{error}</div>;
  if (!booking) return null;

  return (
    <div className="ticket-page">
      <div className="ticket-card">
        <div className="ticket-header">
          <div className="ticket-meta">
            <h2>{movie?.title || (showtime as any)?.movieId?.title || "Vé xem phim"}</h2>
            <p>{cinemaName}</p>
            <p>
              Suất: {timeLabel} - {dateLabel}
            </p>
            <p>Phòng: {hallName}</p>
            <p>Ghế: {seatLabel}</p>
            <p>Mã vé: {booking._id}</p>
            <p>
              Trạng thái:{" "}
              {booking.status === "confirmed" ? (
                <strong style={{ color: "#22c55e" }}>Đã xác nhận ✓</strong>
              ) : booking.status === "pending_confirmation" ? (
                <span style={{ color: "#f59e0b" }}>Đang chờ xác nhận thanh toán…</span>
              ) : (
                booking.status
              )}
            </p>
            {booking.status === "pending_confirmation" && (
              <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                Trang sẽ tự động cập nhật khi thanh toán được xác nhận.
              </p>
            )}
          </div>
          <img
            src={movie?.poster || "/images/logo/logo.png"}
            alt={movie?.title || "poster"}
            className="ticket-poster"
          />
        </div>

        <div className="ticket-body ticket-summary">
          <div className="summary-line">
            <span>Tiền vé</span>
            <span>{booking.ticketTotal.toLocaleString("vi-VN")} đ</span>
          </div>
          <div className="summary-line">
            <span>Bắp nước</span>
            <span>{(booking.snackTotal || 0).toLocaleString("vi-VN")} đ</span>
          </div>
          {booking.promotionCode && discountAmount > 0 && (
            <div className="summary-line discount">
              <span>Giảm giá ({booking.promotionCode})</span>
              <span>-{discountAmount.toLocaleString("vi-VN")} đ</span>
            </div>
          )}
          {!booking.promotionCode && (
            <div className="summary-line">
              <span>Giảm giá</span>
              <span>Không</span>
            </div>
          )}
          <div className="ticket-total">
            Tổng: {booking.finalTotal.toLocaleString("vi-VN")} đ
          </div>

          <div className="ticket-actions">
            <button onClick={() => navigate("/")}>Về trang chủ</button>
          </div>
        </div>
      </div>
    </div>
  );
}
