import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/PaymentPage.css";
import { apiRequest } from "../../services/api";
import {
  createBooking,
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
  seatHoldId?: string;
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
  const [showtimeMeta, setShowtimeMeta] = useState<{ date?: string; time?: string; cinema?: string; room?: string; movieId?: string }>({});
  const [movieMeta, setMovieMeta] = useState<Movie | null>(null);
  const sePayFormRef = useRef<HTMLFormElement>(null);
  const [sePayCheckoutUrl, setSePayCheckoutUrl] = useState<string>("");
  const [sePayFormData, setSePayFormData] = useState<Record<string, string | number> | null>(null);

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
      .then((data) => setPromotions(data || []))
      .catch((err) => console.error("Error loading promotions:", err));
  }, []);

  // Load showtime/movie info for display
  useEffect(() => {
    if (!paymentInfo.showtimeId) return;
    (async () => {
      try {
        const st = await getShowtimeById(paymentInfo.showtimeId as string);
        setShowtimeMeta({ ...(st as any), room: (st as any).auditoriumId?.name || "Phòng 1" });
        
        // movieId might be already populated as an object or just an ID string
        const movieData = (st as any).movieId;
        if (movieData) {
          if (typeof movieData === 'object' && movieData._id) {
            // Already populated as an object
            setMovieMeta(movieData);
          } else if (typeof movieData === 'string') {
            // Just an ID, need to fetch the movie
            const mv = await getMovieById(movieData);
            setMovieMeta(mv);
          }
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
    if (!selectedPromoCode || typeof selectedPromoCode !== "string") {
      setAppliedPromo(null);
      setPromoMessage("Vui lòng chọn mã giảm giá.");
      return;
    }

    const code = selectedPromoCode.trim().toUpperCase();
    const foundPromo = promotions.find(
      (item) => item.code?.toUpperCase() === code
    );

    if (!foundPromo) {
      setAppliedPromo(null);
      setPromoMessage("Mã giảm giá không hợp lệ.");
      return;
    }

    // Parse discountType and discountValue from promotion, ensure value is a number
    const discountType = (foundPromo as any).discountType || "FIXED_AMOUNT";
    const discountValue = Number((foundPromo as any).discountValue ?? 0);

    let type: "percent" | "amount" = "amount";
    let value = discountValue;

    if (discountType === "PERCENTAGE") {
      type = "percent";
    } else if (discountType === "FIXED_AMOUNT") {
      type = "amount";
    }

    const newPromo: PromoItem = {
      code: foundPromo.code || code,
      label: foundPromo.description || (foundPromo as any).title || foundPromo.code,
      type,
      value,
    };

    setAppliedPromo(newPromo);
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
        seatHoldId: paymentInfo.seatHoldId,
      });

      const { booking, payment } = result;
      const invoiceNumber = payment?.orderCode || orderCode;

      // Call server to generate signed SePay checkout fields
      const sePayRes = await apiRequest<{ checkoutUrl: string; fields: Record<string, string | number> }>(
        "/payments/sepay/init",
        {
          method: "POST",
          auth: true,
          body: JSON.stringify({
            order_invoice_number: invoiceNumber,
            order_amount: finalTotal,
            order_description: `Dat ve phim ${movieMeta?.title || paymentInfo.movieTitle || ""}`,
            success_url: `${window.location.origin}/ticket?bookingId=${booking._id}`,
            error_url: `${window.location.origin}/movies?payment=error`,
            cancel_url: `${window.location.origin}/movies?payment=cancel`,
          }),
        }
      );
      setSePayCheckoutUrl(sePayRes.checkoutUrl);
      setSePayFormData(sePayRes.fields);
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

  // Auto-submit SePay form once fields are ready
  useEffect(() => {
    if (sePayFormData && sePayFormRef.current) {
      sePayFormRef.current.submit();
    }
  }, [sePayFormData]);

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

          <p>Thanh toán an toàn qua cổng SePay.</p>
        </div>

        <div className="payment-layout">
          <div className="payment-left">
            <div className="payment-card qr-card">
              <h2>Thanh toán qua SePay</h2>

              <div className="payment-note">
                Nhấn <strong>Thanh toán với SePay</strong> để được chuyển đến cổng thanh
                toán an toàn. Đơn hàng sẽ được xác nhận tự động sau khi giao dịch thành công.
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
                    {promotions.map((promo, idx) => {
                      const discountDisplay = promo.discountType === "PERCENTAGE" 
                        ? `${promo.discountValue}%` 
                        : `${promo.discountValue.toLocaleString('vi-VN')}đ`;
                      return (
                        <option key={promo._id || idx} value={promo.code}>
                          {promo.code} - Giảm {discountDisplay}
                        </option>
                      );
                    })}
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

              <div className="payment-actions">
                <button
                  type="button"
                  className="paid-btn"
                  onClick={handlePaid}
                  disabled={invoiceStatus !== "unpaid" || isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Thanh toán với SePay"}
                </button>

                <button
                  type="button"
                  className="back-btn"
                  onClick={() => navigate(-1)}
                >
                  Quay lại
                </button>
              </div>

              {sePayFormData && (
                <form
                  ref={sePayFormRef}
                  action={sePayCheckoutUrl}
                  method="POST"
                  style={{ display: "none" }}
                >
                  {Object.keys(sePayFormData).map((field) => (
                    <input
                      key={field}
                      type="hidden"
                      name={field}
                      value={String(sePayFormData[field])}
                    />
                  ))}
                </form>
              )}
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

              {appliedPromo && (
                <div className="summary-line">
                  <span>{appliedPromo.type === "percent" ? `Giảm ${appliedPromo.value}%` : "Giảm"}</span>
                  <span>- {discountAmount.toLocaleString("vi-VN")} đ</span>
                </div>
              )}

              {!appliedPromo && (
                <div className="summary-line">
                  <span>Giảm giá</span>
                  <span>- {discountAmount.toLocaleString("vi-VN")} đ</span>
                </div>
              )}

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
