import { useEffect, useMemo, useState } from "react";
import { getMyBookings, type Booking } from "../../services/booking.api";
import "../../styles/BookingHistoryModal.css";

// Normalised showtime data extracted from aggregation response
type NormShowtime = {
  _id: string;
  time: string;
  timeEnd: string;
  date: string;
  cinema: string;
  room: string;
  movieTitle: string;
  moviePoster: string;
};

type EnrichedBooking = Booking & { norm?: NormShowtime };

/** Transform raw booking (with populated showtime from /bookings/me) → EnrichedBooking */
function enrich(raw: any): EnrichedBooking {
  const st = raw.showtime;
  let norm: NormShowtime | undefined;

  if (st && typeof st === "object") {
    const startTime = st.startTime ? new Date(st.startTime) : null;
    const endTime = st.endTime ? new Date(st.endTime) : null;
    const date = startTime ? startTime.toLocaleDateString("vi-VN") : "—";
    const time = startTime
      ? `${String(startTime.getHours()).padStart(2, "0")}:${String(startTime.getMinutes()).padStart(2, "0")}`
      : "—";
    const timeEnd = endTime
      ? `${String(endTime.getHours()).padStart(2, "0")}:${String(endTime.getMinutes()).padStart(2, "0")}`
      : "—";

    norm = {
      _id: st._id,
      time,
      timeEnd,
      date,
      cinema: st.auditoriumId?.cinemaId?.name ?? "—",
      room: st.auditoriumId?.name ?? "—",
      movieTitle: st.movieId?.title ?? "Vé xem phim",
      moviePoster: st.movieId?.poster ?? "/images/logo/logo.png",
    };
  }

  return { ...raw, norm };
}

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  confirmed: { text: "Đã xác nhận", color: "#22c55e" },
  pending_payment: { text: "Chờ thanh toán", color: "#f59e0b" },
  pending_confirmation: { text: "Đang xác nhận", color: "#f59e0b" },
  failed: { text: "Thất bại", color: "#ef4444" },
  cancelled: { text: "Đã huỷ", color: "#94a3b8" },
};

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function TicketDetailModal({
  booking,
  onClose,
}: {
  booking: EnrichedBooking;
  onClose: () => void;
}) {
  const { norm } = booking;
  const seatLabel = (booking.seats || []).join(", ");
  const status = STATUS_LABEL[booking.status] ?? { text: booking.status, color: "#94a3b8" };

  const discountAmount = useMemo(() => {
    const subtotal = (booking.ticketTotal || 0) + (booking.snackTotal || 0);
    return Math.max(subtotal - (booking.finalTotal || 0), 0);
  }, [booking]);

  return (
    <div className="bh-modal-overlay" onClick={onClose}>
      <div className="bh-modal" onClick={(e) => e.stopPropagation()}>
        <button className="bh-modal__close" onClick={onClose} aria-label="Đóng">
          ✕
        </button>

        <h2 className="bh-modal__title">Chi tiết vé</h2>

        <div className="bh-modal__header">
          <img
            src={norm?.moviePoster || "/images/logo/logo.png"}
            alt={norm?.movieTitle}
            className="bh-modal__poster"
          />
          <div className="bh-modal__meta">
            <h3 className="bh-modal__movie-title">
              {norm?.movieTitle || "Vé xem phim"}
            </h3>
            <p>{norm?.cinema || "—"}</p>
            <p>Phòng chiếu: {norm?.room || "—"}</p>
            <p>Ngày {norm?.date || "—"}</p>
            <p>Giờ: <strong>{norm?.time || "—"}</strong> – <strong>{norm?.timeEnd || "—"}</strong></p>
            <p>
              Ghế: <strong>{seatLabel || "—"}</strong>
            </p>
            <p className="bh-modal__code">Mã đặt vé: {booking._id}</p>
            <p>
              Trạng thái:{" "}
              <strong style={{ color: status.color }}>{status.text}</strong>
            </p>
          </div>
        </div>

        <div className="bh-modal__body">
          <div className="bh-modal__row">
            <span>Tiền vé</span>
            <span>{(booking.ticketTotal || 0).toLocaleString("vi-VN")} đ</span>
          </div>
          <div className="bh-modal__row">
            <span>Bắp nước</span>
            <span>{(booking.snackTotal || 0).toLocaleString("vi-VN")} đ</span>
          </div>
          {booking.promotionCode && discountAmount > 0 && (
            <div className="bh-modal__row bh-modal__row--discount">
              <span>Giảm giá ({booking.promotionCode})</span>
              <span>-{discountAmount.toLocaleString("vi-VN")} đ</span>
            </div>
          )}
          <div className="bh-modal__total">
            <span>Tổng tiền</span>
            <span className="bh-modal__total-value">
              {(booking.finalTotal || 0).toLocaleString("vi-VN")} đ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Booking History List ─────────────────────────────────────────────────────
export default function BookingHistory() {
  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<EnrichedBooking | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const raw = await getMyBookings();
        const enriched = (raw as any[]).map(enrich);
        enriched.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setBookings(enriched);
      } catch (err: any) {
        setError(err.message || "Không tải được lịch sử đặt vé");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleOpen = (b: EnrichedBooking) => { setSelected(b); setOpen(true); };
  const handleClose = () => { setOpen(false); setSelected(null); };

  if (loading) {
    return <p className="bh-empty">Đang tải lịch sử đặt vé...</p>;
  }
  if (error) {
    return <p className="bh-error">{error}</p>;
  }
  if (bookings.length === 0) {
    return <p className="bh-empty">Bạn chưa có vé nào.</p>;
  }

  return (
    <>
      <div className="bh-list">
        {bookings.map((b) => {
          const { norm } = b;
          const status = STATUS_LABEL[b.status] ?? { text: b.status, color: "#94a3b8" };

          return (
            <div key={b._id} className="bh-item" onClick={() => handleOpen(b)}>
              <img
                src={norm?.moviePoster || "/images/logo/logo.png"}
                alt={norm?.movieTitle}
                className="bh-item__poster"
              />
              <div className="bh-item__info">
                <p className="bh-item__title">{norm?.movieTitle || "Vé xem phim"}</p>
                <p className="bh-item__meta">
                  {norm?.date || "—"} • {norm?.cinema || "—"}
                </p>
                <p className="bh-item__meta">
                  Giờ: <strong>{norm?.time || "—"}</strong> – <strong>{norm?.timeEnd || "—"}</strong>
                </p>
                <p className="bh-item__meta">
                  Phòng: {norm?.room || "—"} &nbsp;|&nbsp; Ghế:{" "}
                  {(b.seats || []).join(", ") || "—"}
                </p>
                <p className="bh-item__status">
                  Trạng thái:{" "}
                  <strong style={{ color: status.color }}>{status.text}</strong>
                </p>
              </div>
              <div className="bh-item__price">
                <p className="bh-item__price-value">
                  {(b.finalTotal || 0).toLocaleString("vi-VN")} đ
                </p>
                <p className="bh-item__price-date">
                  {new Date(b.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {open && selected && (
        <TicketDetailModal booking={selected} onClose={handleClose} />
      )}
    </>
  );
}
