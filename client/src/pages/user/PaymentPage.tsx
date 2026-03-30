import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/PaymentPage.css";

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

const AVAILABLE_PROMOS: PromoItem[] = [
  {
    code: "GIAM10",
    label: "GIAM10 - Giảm 10%",
    type: "percent",
    value: 10,
  },
  {
    code: "GIAM20K",
    label: "GIAM20K - Giảm 20.000đ",
    type: "amount",
    value: 20000,
  },
  {
    code: "GIAM50K",
    label: "GIAM50K - Giảm 50.000đ",
    type: "amount",
    value: 50000,
  },
];

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

  const [orderCode] = useState<string>(generateOrderCode());
  const [invoiceStatus, setInvoiceStatus] = useState<InvoiceStatus>("unpaid");
  const [timeLeft, setTimeLeft] = useState(180);

  const [selectedPromoCode, setSelectedPromoCode] = useState<string>("");
  const [appliedPromo, setAppliedPromo] = useState<PromoItem | null>(null);
  const [promoMessage, setPromoMessage] = useState<string>("");

  const snackLines = paymentInfo.snackLines || [];
  const seats = paymentInfo.seats || [];

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

  useEffect(() => {
    if (invoiceStatus !== "unpaid") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setInvoiceStatus("failed");
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

    const foundPromo = AVAILABLE_PROMOS.find(
      (item) => item.code === selectedPromoCode
    );

    if (!foundPromo) {
      setAppliedPromo(null);
      setPromoMessage("Mã giảm giá không hợp lệ.");
      return;
    }

    setAppliedPromo(foundPromo);
    setPromoMessage(`Áp dụng thành công mã ${foundPromo.code}.`);
  };

  const handleRemovePromo = () => {
    setSelectedPromoCode("");
    setAppliedPromo(null);
    setPromoMessage("");
  };

  const handlePaid = () => {
    const invoice: InvoiceItem = {
      id: orderCode,
      createdAt: new Date().toISOString(),
      movieTitle: paymentInfo.movieTitle || "Chưa có tên phim",
      cinema: paymentInfo.cinema || "Chưa có rạp",
      date: paymentInfo.date || "",
      time: paymentInfo.time || "",
      room: paymentInfo.room || "",
      format: paymentInfo.format || "",
      seats,
      ticketTotal: paymentInfo.totalPrice || 0,
      snackLines,
      snackTotal: paymentInfo.snackTotal || 0,
      finalTotal,
      status: "pending_confirmation",
      paymentMethod: "bank_transfer_qr",
      qrImage: paymentInfo.qrImage,
      promoCode: appliedPromo?.code || "",
      discountAmount,
    };

    const oldInvoices = JSON.parse(localStorage.getItem("invoices") || "[]");
    localStorage.setItem("invoices", JSON.stringify([invoice, ...oldInvoices]));

    setInvoiceStatus("pending_confirmation");
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const countdownClass =
    timeLeft <= 30 && invoiceStatus === "unpaid"
      ? "countdown flash"
      : "countdown";

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
                {paymentInfo.qrImage ? (
                  <img
                    src={paymentInfo.qrImage}
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
                  <strong>{BANK_INFO.bankName}</strong>
                </div>
                <div className="bank-line">
                  <span>Số tài khoản</span>
                  <strong>{BANK_INFO.accountNumber}</strong>
                </div>
                <div className="bank-line">
                  <span>Chủ tài khoản</span>
                  <strong>{BANK_INFO.accountName}</strong>
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
                    {AVAILABLE_PROMOS.map((promo) => (
                      <option key={promo.code} value={promo.code}>
                        {promo.label}
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
                  disabled={invoiceStatus !== "unpaid"}
                >
                  {invoiceStatus === "pending_confirmation"
                    ? "Đã ghi nhận thanh toán"
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
                  <h3>{paymentInfo.movieTitle || "Chưa có tên phim"}</h3>
                  <p>{paymentInfo.cinema || "Chưa có rạp"}</p>
                  <p>
                    {paymentInfo.time || "--:--"} - {paymentInfo.date || "--/--/----"}
                  </p>
                  <p>
                    {paymentInfo.room || "Phòng ?"} - {paymentInfo.format || "2D"}
                  </p>
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
                <Link to="/movie">Quay về trang phim</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}