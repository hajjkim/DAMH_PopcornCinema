import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/SnacksPage.css";

const qrImage = "/images/payment/qr-demo.png";

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
};

type ProductItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "combo" | "single";
  hasDrinkChoice?: boolean;
};

type SnackLine = {
  id: string;
  name: string;
  qty: number;
  total: number;
};

const snackProducts: ProductItem[] = [
  {
    id: "combo-solo",
    name: "Combo Solo",
    description: "1 bắp + 1 nước",
    price: 65000,
    image: "/images/combo/combo1.png",
    category: "combo",
    hasDrinkChoice: true,
  },
  {
    id: "combo-couple",
    name: "Combo Couple",
    description: "1 bắp lớn + 2 nước",
    price: 120000,
    image: "/images/combo/combo2.png",
    category: "combo",
    hasDrinkChoice: true,
  },
  {
    id: "combo-family",
    name: "Combo Family",
    description: "2 bắp + 4 nước",
    price: 220000,
    image: "/images/combo/combo3.png",
    category: "combo",
    hasDrinkChoice: true,
  },
  {
    id: "single-popcorn",
    name: "1 Bắp",
    description: "1 bắp vị truyền thống",
    price: 45000,
    image: "/images/combo/popcorn.png",
    category: "single",
    hasDrinkChoice: true,
  },
  {
    id: "single-drink",
    name: "1 Nước",
    description: "Chọn Pepsi, Nước suối hoặc Fanta",
    price: 30000,
    image: "/images/combo/drink.png",
    category: "single",
    hasDrinkChoice: true,
  },
];

const drinkOptions = ["Pepsi", "Nước suối", "Fanta"];

export default function SnacksPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingInfo = (location.state as BookingState) || {};

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [drinkChoiceMap, setDrinkChoiceMap] = useState<Record<string, string>>(
    {}
  );

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
    return snackProducts.reduce((sum, item) => {
      const qty = quantities[item.id] || 0;
      return sum + qty * item.price;
    }, 0);
  }, [quantities]);

  const finalTotal = (bookingInfo.totalPrice || 0) + snackTotal;

  const selectedSnackLines = useMemo<SnackLine[]>(() => {
    return snackProducts
      .filter((item) => (quantities[item.id] || 0) > 0)
      .map((item) => {
        const qty = quantities[item.id] || 0;
        const total = qty * item.price;
        let name = item.name;

        if (item.hasDrinkChoice) {
          const selectedDrink = drinkChoiceMap[item.id] || drinkOptions[0];
          name = `${item.name} (${selectedDrink})`;
        }

        return { id: item.id, name, qty, total };
      });
  }, [quantities, drinkChoiceMap]);

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
            {snackProducts.map((item) => {
              const qty = quantities[item.id] || 0;
              const selectedDrink = drinkChoiceMap[item.id] || drinkOptions[0];

              return (
                <div className="snack-card" key={item.id}>
                  <div className="snack-image-wrap">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="snack-content">
                    <div className="snack-text">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <strong>{item.price.toLocaleString("vi-VN")} đ</strong>

                      {item.hasDrinkChoice && (
                        <div className="drink-choice">
                          <label>Chọn nước</label>
                          <select
                            value={selectedDrink}
                            onChange={(e) =>
                              handleDrinkChange(item.id, e.target.value)
                            }
                          >
                            {drinkOptions.map((drink) => (
                              <option key={drink} value={drink}>
                                {drink}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="qty-control">
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(item.id, "decrease")
                        }
                      >
                        -
                      </button>
                      <span>{qty}</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(item.id, "increase")
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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