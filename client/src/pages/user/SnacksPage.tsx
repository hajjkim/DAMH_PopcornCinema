import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/SnacksPage.css";
import { getSnacks, type Snack } from "../../services/snack.api";

const qrImage = "/images/payment/qr-demo.png";
const drinkOptions = ["Pepsi", "Nước suối", "Fanta"];

type BookingState = {
  movieTitle?: string;
  poster?: string;
  date?: string;
  time?: string;
  room?: string;
  format?: string;
  cinema?: string;
  seats?: string[];
  totalPrice?: number;
  showtimeId?: string;
};

type SnackLine = {
  id: string;
  name: string;
  qty: number;
  total: number;
};

export default function SnacksPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingInfo = (location.state as BookingState) || {};

  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [drinkChoiceMap, setDrinkChoiceMap] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    const loadSnacks = async () => {
      try {
        setIsLoading(true);
        const data = await getSnacks();
        setSnacks(data);
      } catch (err) {
        console.error("Error loading snacks:", err);
        setSnacks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSnacks();
  }, []);

  const handleQuantityChange = (id: string, type: "increase" | "decrease") => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      if (type === "increase") return { ...prev, [id]: current + 1 };
      if (current <= 0) return prev;
      return { ...prev, [id]: current - 1 };
    });
  };

  const handleDrinkChange = (id: string, value: string) => {
    setDrinkChoiceMap((prev) => ({ ...prev, [id]: value }));
  };

  const snackTotal = useMemo(() => {
    return snacks.reduce((sum, item) => {
      const qty = quantities[item._id] || 0;
      return sum + qty * item.price;
    }, 0);
  }, [snacks, quantities]);

  const finalTotal = (bookingInfo.totalPrice || 0) + snackTotal;

  const selectedSnackLines = useMemo<SnackLine[]>(() => {
    return snacks
      .filter((item) => (quantities[item._id] || 0) > 0)
      .map((item) => {
        const qty = quantities[item._id] || 0;
        const total = qty * item.price;
        return { id: item._id, name: item.name, qty, total };
      });
  }, [snacks, quantities]);

  const handleContinue = () => {
    navigate("/payment", {
      state: {
        ...bookingInfo,
        snacks: quantities,
        snackLines: selectedSnackLines,
        snackTotal,
        finalTotal,
        drinkChoiceMap,
        qrImage,
        showtimeId: bookingInfo.showtimeId,
      },
    });
  };

  return (
    <div className="snacks-page">
      <div className="snacks-container">
        <div className="snacks-stepbar">
          <div className="step done">Chọn ghế</div>
          <div className="step active">Bắp nước</div>
          <div className="step">Thanh toán</div>
        </div>

        <div className="snacks-layout">
          <div className="snacks-left">
            {isLoading ? (
              <p>Đang tải bắp nước...</p>
            ) : snacks.length === 0 ? (
              <p>Không có bắp nước nào</p>
            ) : (
              snacks.map((item) => {
                const qty = quantities[item._id] || 0;

                return (
                  <div className="snack-card" key={item._id}>
                    <div className="snack-image-wrap">
                      <img src={item.image} alt={item.name} />
                    </div>

                    <div className="snack-content">
                      <div className="snack-text">
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <strong>{item.price.toLocaleString("vi-VN")} đ</strong>
                      </div>

                      <div className="qty-control">
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(item._id, "decrease")
                          }
                        >
                          -
                        </button>
                        <span>{qty}</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(item._id, "increase")
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <aside className="snacks-right">
            <div className="summary-card">
              <div className="summary-movie">
                <img
                  src={bookingInfo.poster || "/images/logo/logo.png"}
                  alt={bookingInfo.movieTitle || "movie"}
                  className="summary-poster"
                />

                <div className="summary-info">
                  <h3>{bookingInfo.movieTitle || "Bộ Tứ Báo Thủ"}</h3>
                  <p>{bookingInfo.cinema || "Popcorn Cinema Vincom Bà Triệu"}</p>
                  <p>
                    {bookingInfo.time || "09:00"} - {bookingInfo.date || "2026-03-27"}
                  </p>
                  <p>Ghế: {bookingInfo.seats?.join(", ") || "Chưa chọn"}</p>
                </div>
              </div>

              <div className="summary-divider" />

              {selectedSnackLines.map((line) => (
                <div className="summary-line" key={line.id}>
                  <span>
                    {line.qty}x {line.name}
                  </span>
                  <span>{line.total.toLocaleString("vi-VN")} đ</span>
                </div>
              ))}

              <div className="summary-divider" />

              <div className="summary-line">
                <span>Tổng bắp nước</span>
                <span>{snackTotal.toLocaleString("vi-VN")} đ</span>
              </div>

              <div className="summary-total">
                <span>Tổng cộng</span>
                <strong>{finalTotal.toLocaleString("vi-VN")} đ</strong>
              </div>

              <button className="btn-next" onClick={handleContinue}>
                Tiếp tục
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}