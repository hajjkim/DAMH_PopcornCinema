import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import "../../styles/TicketPage.css";
import { getMyBookings } from "../../services/booking.api";
import { getShowtimeById } from "../../services/showtime.api";
import { getMovieById, type Movie } from "../../services/movie.api";

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

  useEffect(() => {
    const load = async () => {
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
        const st = await getShowtimeById(found.showtimeId);
        setShowtime(st);
        if ((st as any).movieId) {
          const mv = await getMovieById((st as any).movieId);
          setMovie(mv);
        }
      } catch (err: any) {
        setError(err?.message || "Lỗi tải vé");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [bookingId]);

  const seatLabel = useMemo(
    () => (booking?.seats || []).join(", "),
    [booking?.seats]
  );

  if (loading) return <div className="ticket-page">Đang tải vé...</div>;
  if (error) return <div className="ticket-page error">{error}</div>;
  if (!booking) return null;

  return (
    <div className="ticket-page">
      <div className="ticket-card">
        <div className="ticket-header">
          <div className="ticket-meta">
            <h2>{movie?.title || "Vé xem phim"}</h2>
            <p>{showtime?.cinema}</p>
            <p>
              Suất: {showtime?.time} - {showtime?.date}
            </p>
            <p>Ghế: {seatLabel}</p>
            <p>Mã vé: {booking._id}</p>
            <p>Trạng thái: {booking.status}</p>
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
          <div className="summary-line">
            <span>Giảm giá</span>
            <span>{booking.promotionCode || "Không"}</span>
          </div>
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
