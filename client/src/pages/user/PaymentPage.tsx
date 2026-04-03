import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/PaymentPage.css";
import {
  createBooking,
  getMyBookings,
  type PaymentMeta,
} from "../../services/booking.api";
import { getPaymentConfig, type PaymentConfig } from "../../services/payment.api";
import { getPromotions, type Promotion } from "../../services/promotion.api";
import { getShowtimeById } from "../../services/showtime.api";
import { getMovieById, type Movie } from "../../services/movie.api";

type SnackLine = {
  id: string;
  name: string;
  qty: number;
  total: number;
};

type PaymentState = {
  movieTitle?: string;
  poster?: string;
  date?: string;
  time?: string;
  room?: string;
  format?: string;
  cinema?: string;
  seats?: string[];
  totalPrice?: number;
  snackLines?: SnackLine[];
  snackTotal?: number;
  finalTotal?: number;
  qrImage?: string;
  showtimeId?: string;
};

type InvoiceStatus =
  | "unpaid"
  | "pending_confirmation"
  | "confirmed"
  | "failed";

type InvoiceItem = {
  id: string;
  createdAt: string;
  movieTitle: string;
  cinema: string;
  date: string;
  time: string;
  room: string;
  format: string;
  seats: string[];
  ticketTotal: number;
  snackLines: SnackLine[];
  snackTotal: number;
  finalTotal: number;
  status: InvoiceStatus;
  paymentMethod: "bank_transfer_qr";
  qrImage?: string;
  promoCode?: string;
  discountAmount?: number;
};

type PromoItem = {
  code: string;
  label: string;
  type: "percent" | "amount";
  value: number;
};

const BANK_INFO = {
  bankName: "MB Bank",
  accountNumber: "1234567899",
  accountName: "POPCORN CINEMA",
};

function generateOrderCode() {
  return `PC${Date.now().toString().slice(-8)}`;
}

function getStatusLabel(status: InvoiceStatus) {
  switch (status) {
    case "unpaid":
      return "Chưa thanh toán";
    case "pending_confirmation":
      return "Chờ xác nhận thanh toán";
    case "confirmed":
      return "Đã xác nhận";
    case "failed":
      return "Thanh toán thất bại";
    default:
      return "Không xác định";
  }
}

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentInfo = (location.state as PaymentState) || {};

  const [orderCode, setOrderCode] = useState<string>(generateOrderCode());
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceStatus, setInvoiceStatus] = useState<InvoiceStatus>("unpaid");
  const [timeLeft, setTimeLeft] = useState(180);

  const [selectedPromoCode, setSelectedPromoCode] = useState<string>("");
  const [appliedPromo, setAppliedPromo] = useState<PromoItem | null>(null);
  const [promoMessage, setPromoMessage] = useState<string>("");
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [showtimeMeta, setShowtimeMeta] = useState<{ date?: string; time?: string; cinema?: string; movieId?: string }>({});
  const [movieMeta, setMovieMeta] = useState<Movie | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  const snackLines = paymentInfo.snackLines || [];
  const seats = paymentInfo.seats || [];
  const roomLabel = paymentInfo.room || showtimeMeta.room || "Phòng 1";

  const originalTotal = useMemo(() => {
    return paymentInfo.finalTotal || 0;
  }, [paymentInfo.finalTotal]);

  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;

    if (appliedPromo.type === "percent") {
      return Math.floor((originalTotal * appliedPromo.value) / 100);
    }

    return appliedPromo.value;
  }, [appliedPromo, originalTotal]);

  const finalTotal = useMemo(() => {
    const totalAfterDiscount = originalTotal - discountAmount;
    return totalAfterDiscount > 0 ? totalAfterDiscount : 0;
  }, [originalTotal, discountAmount]);

  // Load payment config (QR/bank) from BE
  useEffect(() => {
    getPaymentConfig()
      .then((cfg) => setPaymentConfig(cfg))
      .catch((err) => console.error("Error loading payment config:", err));
  }, []);

  // Load promotions from BE
  useEffect(() => {
    getPromotions()
      .then((data) => setPromotions(data))
      .catch((err) => console.error("Error loading promotions:", err));
  }, []);

  // Load showtime/movie info for display
  useEffect(() => {
    if (!paymentInfo.showtimeId) return;
    (async () => {
      try {
        const st = await getShowtimeById(paymentInfo.showtimeId);
        setShowtimeMeta({ ...(st as any), room: (st as any).cinema });
        if ((st as any).movieId) {
          const mv = await getMovieById((st as any).movieId);
          setMovieMeta(mv);
        }
      } catch (err) {
        console.error("Error loading showtime/movie:", err);
      }
    })();
  }, [paymentInfo.showtimeId]);

  useEffect(() => {
    if (invoiceStatus !== "unpaid") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setInvoiceStatus("failed");
          setPromoMessage("Hết thời gian thanh toán. Vui lòng thực hiện lại.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [invoiceStatus]);

  const handleApplyPromo = () => {
    if (!selectedPromoCode) {
      setAppliedPromo(null);
      setPromoMessage("Vui lòng chọn mã giảm giá.");
      return;
    }

    const code = selectedPromoCode.trim().toUpperCase();
    const foundPromo = promotions.find(
      (item) => item.code.toUpperCase() === code
    );

    if (!foundPromo) {
      setAppliedPromo(null);
      setPromoMessage("Mã giảm giá không hợp lệ.");
      return;
    }

    // normalize discount string, e.g. "30%" hoặc "20000"
    let type: "percent" | "amount" = "amount";
    let value = 0;
    const discountText = (foundPromo as any).discount?.toString().trim() || "";
    if (discountText.endsWith("%")) {
      type = "percent";
      value = Number(discountText.replace("%", "")) || 0;
    } else {
      value = Number(discountText) || 0;
    }

    setAppliedPromo({
      code: foundPromo.code,
      label: (foundPromo as any).title || foundPromo.code,
      type,
      value,
    });
    setPromoMessage(`Áp dụng thành công mã ${foundPromo.code}.`);
  };

  const handleRemovePromo = () => {
    setSelectedPromoCode("");
    setAppliedPromo(null);
    setPromoMessage("");
  };

  const handlePaid = async () => {
    if (!paymentInfo.showtimeId) {
      setPromoMessage("Lỗi: Không tìm thấy showtime ID");
      return;
    }

    setIsLoading(true);
    try {
      // Gọi API tạo đặt vé
      const snacksData = snackLines.map((line) => ({
        snackId: line.id,
        qty: line.qty,
      }));

      const result = await createBooking({
        showtimeId: paymentInfo.showtimeId,
        seats: seats,
        snacks: snacksData,
        promotionCode: appliedPromo?.code,
        ticketTotal: paymentInfo.totalPrice || 0,
        snackTotal: paymentInfo.snackTotal || 0,
        finalTotal: finalTotal,
      });

      const { booking, payment } = result;
      console.log("Booking created successfully:", booking);
      setBookingId(booking._id);
      // Đồng bộ nội dung chuyển khoản/order code từ BE
      if (payment?.orderCode) {
        setOrderCode(payment.orderCode);
      }
      if (payment?.qrImageUrl && !paymentInfo.qrImage) {
        paymentInfo.qrImage = payment.qrImageUrl;
      }

      // Lưu vào localStorage (optional, cho tracking)
      const invoice: InvoiceItem = {
        id: booking._id,
        createdAt: booking.createdAt,
        movieTitle:
          movieMeta?.title || paymentInfo.movieTitle || "Chưa có tên phim",
        cinema: showtimeMeta.cinema || paymentInfo.cinema || "Chưa có rạp",
        date: showtimeMeta.date || paymentInfo.date || "",
        time: showtimeMeta.time || paymentInfo.time || "",
        room: roomLabel,
        format: paymentInfo.format || "",
        seats,
        ticketTotal: paymentInfo.totalPrice || 0,
        snackLines,
        snackTotal: paymentInfo.snackTotal || 0,
        finalTotal,
        status: "pending_confirmation",
        paymentMethod: "bank_transfer_qr",
        qrImage: paymentConfig?.qrImage || paymentInfo.qrImage,
        promoCode: appliedPromo?.code || "",
        discountAmount,
      };

      const oldInvoices = JSON.parse(localStorage.getItem("invoices") || "[]");
      localStorage.setItem("invoices", JSON.stringify([invoice, ...oldInvoices]));

      setInvoiceStatus("pending_confirmation");
      setPromoMessage("Đặt vé thành công! Vui lòng chuyển khoản để hoàn tất.");

      // Nếu đã thanh toán (confirmed ngay), điều hướng sang trang vé
      if (booking.status === "confirmed") {
        navigate("/ticket", { state: { bookingId: booking._id } });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Có lỗi xảy ra";
      setPromoMessage(`Lỗi: ${errorMessage}`);
      setInvoiceStatus("unpaid");
      console.error("Booking error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Poll booking status until confirmed
  useEffect(() => {
    if (!bookingId || invoiceStatus !== "pending_confirmation") return;
    const interval = setInterval(async () => {
      try {
        const myBookings = await getMyBookings();
        const found = myBookings.find((b) => b._id === bookingId);
        if (found) {
          setConfirmedBooking(found);
          if (found.status === "confirmed") {
            setInvoiceStatus("confirmed");
            navigate("/ticket", { state: { bookingId: found._id } });
          } else if (found.status === "pending_confirmation") {
            setInvoiceStatus("pending_confirmation");
          }
        }
      } catch (err) {
        console.error("Error polling booking status:", err);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [bookingId, invoiceStatus]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const countdownClass =
    timeLeft <= 30 && invoiceStatus === "unpaid"
      ? "countdown flash"
      : "countdown";

  if (invoiceStatus === "failed") {
    return (
      <div className="payment-page failed">
        <div className="payment-failed-card">
          <h2>Thanh toán thất bại</h2>
          <p>Đơn của bạn đã hết thời gian thanh toán (3 phút).</p>
          <button className="primary-btn" onClick={() => navigate("/")}>
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-stepbar">
          <div className="step done">Chọn ghế</div>
          <div className="step done">Bắp nước</div>
          <div className="step active">Thanh toán</div>
        </div>

        <div className="payment-header">
          <h1>Thanh toán</h1>

          {invoiceStatus === "unpaid" && (
            <p>
              Vui lòng thanh toán trong:{" "}
              <strong className={countdownClass}>{formatTime(timeLeft)}</strong>
            </p>
          )}

          {invoiceStatus === "pending_confirmation" && (
            <p className="payment-pending">Đang chờ hệ thống xác nhận...</p>
          )}

          {invoiceStatus === "failed" && (
            <p className="payment-failed">Thanh toán thất bại!</p>
          )}

          <p>Quét mã QR để chuyển khoản và hoàn tất đơn hàng.</p>
        </div>

        <div className="payment-layout">
          <div className="payment-left">
            <div className="payment-card qr-card">
              <h2>Quét mã QR chuyển khoản</h2>

              <div className="qr-box">
    {paymentConfig?.qrImage || paymentInfo.qrImage ? (
      <img
        src={paymentConfig?.qrImage || paymentInfo.qrImage || ""}
        alt="QR thanh toán"
        className="payment-qr-image"
      />
                ) : (
                  <div className="qr-placeholder">Chưa có ảnh QR</div>
                )}
              </div>

              <div className="bank-info">
                <div className="bank-line">
                  <span>Ngân hàng</span>
                  <strong>{paymentConfig?.bankName || BANK_INFO.bankName}</strong>
                </div>
                <div className="bank-line">
                  <span>Số tài khoản</span>
                  <strong>{paymentConfig?.accountNumber || BANK_INFO.accountNumber}</strong>
                </div>
                <div className="bank-line">
                  <span>Chủ tài khoản</span>
                  <strong>{paymentConfig?.accountName || BANK_INFO.accountName}</strong>
                </div>
                <div className="bank-line">
                  <span>Nội dung</span>
                  <strong>{orderCode}</strong>
                </div>
              </div>

              <div className="promo-box">
                <label htmlFor="promo-select" className="promo-label">
                  Chọn mã giảm giá
                </label>

                <div className="promo-actions-row">
                  <select
                    id="promo-select"
                    className="promo-select"
                    value={selectedPromoCode}
                    onChange={(e) => setSelectedPromoCode(e.target.value)}
                    disabled={invoiceStatus !== "unpaid"}
                  >
                    <option value="">-- Chọn mã giảm giá --</option>
                    {promotions.map((promo, idx) => (
                      <option key={promo._id || idx} value={promo.code}>
                        {promo.code} - {(promo as any).title || promo.description || "Khuyến mãi"}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="promo-apply-btn"
                    onClick={handleApplyPromo}
                    disabled={invoiceStatus !== "unpaid"}
                  >
                    Áp dụng
                  </button>
                </div>

                {appliedPromo && (
                  <div className="promo-applied">
                    <span>Đã áp dụng: {appliedPromo.label}</span>
                    <button
                      type="button"
                      className="promo-remove-btn"
                      onClick={handleRemovePromo}
                      disabled={invoiceStatus !== "unpaid"}
                    >
                      Bỏ mã
                    </button>
                  </div>
                )}

                {promoMessage && <p className="promo-message">{promoMessage}</p>}
              </div>

              <div className="payment-note">
                Sau khi chuyển khoản xong, vui lòng bấm <strong>Đã thanh toán</strong>.
                Hệ thống sẽ ghi nhận đơn ở trạng thái <strong>Chờ xác nhận thanh toán</strong>.
              </div>

              <div className="payment-actions">
                <button
                  type="button"
                  className="paid-btn"
                  onClick={handlePaid}
                  disabled={invoiceStatus !== "unpaid" || isLoading}
                >
                  {isLoading
                    ? "Đang xử lý..."
                    : invoiceStatus === "pending_confirmation"
                    ? "Đã ghi nhận, chờ xác nhận..."
                    : invoiceStatus === "confirmed"
                    ? "Đã xác nhận"
                    : "Đã thanh toán"}
                </button>

                <button
                  type="button"
                  className="back-btn"
                  onClick={() => navigate(-1)}
                >
                  Quay lại
                </button>
              </div>
            </div>
          </div>

          <aside className="payment-right">
            <div className="payment-card summary-card">
              <div className="summary-top">
                <img
                  src={paymentInfo.poster || "/images/logo/logo.png"}
                  alt={paymentInfo.movieTitle || "movie"}
                  className="summary-poster"
                />

                <div className="summary-info">
                  <h3>{movieMeta?.title || paymentInfo.movieTitle || "Chưa có tên phim"}</h3>
                  <p>{paymentInfo.cinema || showtimeMeta.cinema || "Chưa có rạp"}</p>
                  <p>
                    {showtimeMeta.time || paymentInfo.time || "--:--"} - {showtimeMeta.date || paymentInfo.date || "--/--/----"}
                  </p>
                  <p>{roomLabel} - {paymentInfo.format || "2D"}</p>
                  <p>Ghế: {seats.length > 0 ? seats.join(", ") : "Chưa có"}</p>
                </div>
              </div>

              <div className="summary-divider" />

              <div className="summary-line">
                <span>Tiền vé</span>
                <span>{(paymentInfo.totalPrice || 0).toLocaleString("vi-VN")} đ</span>
              </div>

              {snackLines.length > 0 && (
                <>
                  <div className="summary-subtitle">Bắp nước</div>
                  {snackLines.map((item) => (
                    <div className="summary-line small" key={item.id}>
                      <span>
                        {item.qty}x {item.name}
                      </span>
                      <span>{item.total.toLocaleString("vi-VN")} đ</span>
                    </div>
                  ))}
                  <div className="summary-line">
                    <span>Tổng bắp nước</span>
                    <span>{(paymentInfo.snackTotal || 0).toLocaleString("vi-VN")} đ</span>
                  </div>
                </>
              )}

              <div className="summary-divider" />

              <div className="summary-line">
                <span>Tạm tính</span>
                <span>{originalTotal.toLocaleString("vi-VN")} đ</span>
              </div>

              <div className="summary-line">
                <span>Giảm giá</span>
                <span>- {discountAmount.toLocaleString("vi-VN")} đ</span>
              </div>

              <div className="summary-total">
                <span>Tổng thanh toán</span>
                <strong>{finalTotal.toLocaleString("vi-VN")} đ</strong>
              </div>

              <div className={`invoice-status ${invoiceStatus}`}>
                Trạng thái: {getStatusLabel(invoiceStatus)}
              </div>

              {invoiceStatus === "pending_confirmation" && (
                <div className="payment-success-box">
                  Thanh toán đã được gửi. Hóa đơn đang chờ xác nhận từ hệ thống.
                </div>
              )}

              <div className="summary-bottom-link">
                <Link to="/movies">Quay về trang phim</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
