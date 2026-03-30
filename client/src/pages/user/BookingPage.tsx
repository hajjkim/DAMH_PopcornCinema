import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/BookingPage.css";

type SeatStatus = "available" | "selected" | "booked";
type SeatType = "normal" | "couple";

type Seat = {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  type: SeatType;
};

type CinemaItem = {
  id: string;
  name: string;
  area: string;
};

type BookingState = {
  movieTitle?: string;
  poster?: string;
  date?: string;
  time?: string;
  room?: string;
  format?: string;
  rating?: string;
  cinema?: string;
};

const showtimeOptions = ["09:00", "13:30", "19:45", "20:25", "21:05"];

const cinemaList: CinemaItem[] = [
  { id: "c1", name: "Popcorn Cinema Vincom Bà Triệu", area: "Hai Bà Trưng" },
  { id: "c2", name: "Popcorn Cinema Royal City", area: "Thanh Xuân" },
  { id: "c3", name: "Popcorn Cinema Times City", area: "Hai Bà Trưng" },
  { id: "c4", name: "Popcorn Cinema Nguyễn Chí Thanh", area: "Đống Đa" },
  { id: "c5", name: "Popcorn Cinema Hà Đông", area: "Hà Đông" },
  { id: "c6", name: "Popcorn Cinema Long Biên", area: "Long Biên" },
];

const bookedSeatIds = ["A2", "A5", "B4", "C7", "D2", "E8"];
const defaultSelectedSeat = "G3";

const PRICE = {
  normal: 99000,
  couple: 180000,
};

function createSeats(): Seat[] {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "K", "L"];
  const result: Seat[] = [];

  rows.forEach((row) => {
    const seatsPerRow = row === "L" ? 5 : 10;

    for (let i = 1; i <= seatsPerRow; i++) {
      const id = `${row}${i}`;

      let status: SeatStatus = "available";
      let type: SeatType = "normal";

      if (bookedSeatIds.includes(id)) {
        status = "booked";
      }

      if (id === defaultSelectedSeat) {
        status = "selected";
      }

      if (row === "L") {
        type = "couple";
      }

      result.push({
        id,
        row,
        number: i,
        status,
        type,
      });
    }
  });

  return result;
}

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingInfo = (location.state as BookingState) || {};

  const [selectedTime, setSelectedTime] = useState<string>(
    bookingInfo.time || "19:45"
  );
  const [searchCinema, setSearchCinema] = useState("");
  const [selectedArea, setSelectedArea] = useState("Tất cả");
  const [selectedCinema, setSelectedCinema] = useState(
    bookingInfo.cinema || "Popcorn Cinema Vincom Bà Triệu"
  );
  const [seats, setSeats] = useState<Seat[]>(createSeats());

  const areaOptions = useMemo(() => {
    return ["Tất cả", ...new Set(cinemaList.map((item) => item.area))];
  }, []);

  const filteredCinemas = useMemo(() => {
    const keyword = searchCinema.trim().toLowerCase();

    return cinemaList.filter((cinema) => {
      const matchArea =
        selectedArea === "Tất cả" ? true : cinema.area === selectedArea;

      const matchKeyword =
        cinema.name.toLowerCase().includes(keyword) ||
        cinema.area.toLowerCase().includes(keyword);

      return matchArea && matchKeyword;
    });
  }, [searchCinema, selectedArea]);

  useEffect(() => {
    if (filteredCinemas.length === 0) return;

    const stillExists = filteredCinemas.some(
      (cinema) => cinema.name === selectedCinema
    );

    if (!stillExists) {
      setSelectedCinema(filteredCinemas[0].name);
    }
  }, [filteredCinemas, selectedCinema]);

  const groupedSeats = useMemo(() => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "K", "L"];

    return rows.map((row) => ({
      row,
      seats: seats.filter((seat) => seat.row === row),
    }));
  }, [seats]);

  const selectedSeats = useMemo(() => {
    return seats.filter((seat) => seat.status === "selected");
  }, [seats]);

  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((sum, seat) => sum + PRICE[seat.type], 0);
  }, [selectedSeats]);

  const handleSeatClick = (seatId: string) => {
    setSeats((prev) => {
      const clickedSeat = prev.find((seat) => seat.id === seatId);

      if (!clickedSeat || clickedSeat.status === "booked") {
        return prev;
      }

      return prev.map((seat) => {
        if (seat.id !== seatId) return seat;
        if (seat.status === "booked") return seat;

        return {
          ...seat,
          status: seat.status === "selected" ? "available" : "selected",
        };
      });
    });
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất 1 ghế.");
      return;
    }

    if (!selectedCinema) {
      alert("Vui lòng chọn rạp.");
      return;
    }

    navigate("/snacks", {
      state: {
        ...bookingInfo,
        cinema: selectedCinema,
        time: selectedTime,
        seats: selectedSeats.map((seat) =>
          seat.type === "couple" ? `C${seat.number}` : seat.id
        ),
        totalPrice,
      },
    });
  };

  return (
    <div className="booking-page">
      <div className="booking-shell">
        <div className="booking-content">
          <div className="booking-left-panel">
            <div className="booking-top-card">
              <div className="booking-top-header">
                <h2>Chọn rạp và suất chiếu</h2>
                <p>Tìm rạp theo khu vực hoặc tên rạp để chọn nhanh hơn</p>
              </div>

              <div className="booking-filter-grid">
                <div className="booking-filter-box">
                  <label>Khu vực</label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                  >
                    {areaOptions.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="booking-filter-box">
                  <label>Tìm rạp</label>
                  <input
                    type="text"
                    placeholder="Nhập tên rạp hoặc khu vực..."
                    value={searchCinema}
                    onChange={(e) => setSearchCinema(e.target.value)}
                  />
                </div>

                <div className="booking-filter-box">
                  <label>Chọn rạp</label>
                  <select
                    value={selectedCinema}
                    onChange={(e) => setSelectedCinema(e.target.value)}
                    disabled={filteredCinemas.length === 0}
                  >
                    {filteredCinemas.length > 0 ? (
                      filteredCinemas.map((cinema) => (
                        <option key={cinema.id} value={cinema.name}>
                          {cinema.name} - {cinema.area}
                        </option>
                      ))
                    ) : (
                      <option value="">Không tìm thấy rạp phù hợp</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="booking-showtime-section">
                <div className="booking-showtime-title">Đổi suất chiếu</div>

                <div className="booking-showtime-list">
                  {showtimeOptions.map((time) => (
                    <button
                      key={time}
                      type="button"
                      className={
                        selectedTime === time
                          ? "booking-showtime-btn active"
                          : "booking-showtime-btn"
                      }
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="booking-seat-card">
              <div className="screen-wrapper">
                <div className="screen-label">Màn hình</div>
              </div>

              <div className="seat-map">
                {groupedSeats.map((group) => (
                  <div className="seat-row" key={group.row}>
                    <div className="seat-row-label">{group.row}</div>

                    <div className="seat-row-seats">
                      {group.seats.map((seat, index) => {
                        const addGap =
                          group.row !== "L" && index === 4 ? "middle-gap" : "";

                        return (
                          <button
                            key={seat.id}
                            type="button"
                            className={`seat-item ${seat.status} ${seat.type} ${addGap}`}
                            onClick={() => handleSeatClick(seat.id)}
                            disabled={seat.status === "booked"}
                            title={seat.id}
                          >
                            {seat.status === "selected"
                              ? seat.type === "couple"
                                ? `C${seat.number}`
                                : seat.id
                              : ""}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="seat-bottom-line" />

              <div className="seat-legend">
                <div className="legend-item">
                  <span className="legend-box normal" />
                  <span>Ghế thường</span>
                </div>

                <div className="legend-item">
                  <span className="legend-box booked" />
                  <span>Ghế đã bán</span>
                </div>

                <div className="legend-item">
                  <span className="legend-box selected" />
                  <span>Ghế đang chọn</span>
                </div>

                <div className="legend-item">
                  <span className="legend-box couple" />
                  <span>Ghế couple</span>
                </div>
              </div>
            </div>
          </div>

          <div className="booking-right-panel">
            <div className="booking-timer">Thời gian giữ ghế: 05:00</div>

            <div className="booking-summary-card">
              <div className="booking-movie-summary">
                <img
                  src={bookingInfo.poster || "/images/logo/logo.png"}
                  alt={bookingInfo.movieTitle || "movie"}
                  className="booking-movie-poster"
                />

                <div className="booking-movie-meta">
                  <div className="booking-movie-title-row">
                    <h3>{bookingInfo.movieTitle || "Bộ Tứ Báo Thủ"}</h3>
                    <span className="movie-age-badge">
                      {bookingInfo.rating || "T18"}
                    </span>
                  </div>

                  <p className="booking-cinema-name">{selectedCinema}</p>
                  <p>
                    Suất: {selectedTime} - {bookingInfo.date || "2026-03-27"}
                  </p>
                  <p>
                    Phòng: {bookingInfo.room || "Phòng 1"} -{" "}
                    {bookingInfo.format || "2D Phụ đề"}
                  </p>
                </div>
              </div>

              <div className="booking-divider" />

              <div className="booking-line">
                <span>
                  {selectedSeats.length} ghế đã chọn
                  <br />
                  Ghế:{" "}
                  {selectedSeats.length > 0
                    ? selectedSeats
                        .map((seat) =>
                          seat.type === "couple" ? `C${seat.number}` : seat.id
                        )
                        .join(", ")
                    : "Chưa chọn"}
                </span>
                <span>{totalPrice.toLocaleString("vi-VN")} đ</span>
              </div>

              <div className="booking-divider" />

              <div className="booking-total">
                <span>Tổng cộng</span>
                <strong>{totalPrice.toLocaleString("vi-VN")} đ</strong>
              </div>

              <div className="booking-note">
                Ghế thường: {PRICE.normal.toLocaleString("vi-VN")} đ
                <br />
                Ghế couple: {PRICE.couple.toLocaleString("vi-VN")} đ
              </div>

              <div className="booking-actions">
                <button
                  type="button"
                  className="booking-back-btn"
                  onClick={() => navigate(-1)}
                >
                  Quay lại
                </button>

                <button
                  type="button"
                  className="booking-next-btn"
                  onClick={handleContinue}
                >
                  Tiếp tục
                </button>
              </div>

              <div className="booking-route-back">
                <Link to="/showtime">Về lịch chiếu</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}