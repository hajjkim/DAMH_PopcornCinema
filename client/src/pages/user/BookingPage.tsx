import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "../../styles/BookingPage.css";
import {
  getShowtimes,
  getShowtimeSeatStatus,
  type Showtime,
  getShowtimeById,
} from "../../services/showtime.api";
import {
  createSeatHold,
  releaseSeatHold,
  getMySeatHold,
} from "../../services/seatHold.api";
import { getMovieById, type Movie } from "../../services/movie.api";
import { getCinemas, type Cinema } from "../../services/cinema.api";

type SeatStatus = "available" | "selected" | "booked";
type SeatType = "normal" | "couple";

type Seat = {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  type: SeatType;
};

type CinemaItem = Cinema & { id?: string; area?: string; city?: string };

type BookingState = {
  movieId?: string;
  movieTitle?: string;
  poster?: string;
  date?: string;
  time?: string;
  room?: string;
  format?: string;
  rating?: string;
  cinema?: string;
  showtimeId?: string;
  seats?: string[];
  totalPrice?: number;
};

type SeatStatusPayload = {
  allSeats: string[];
  heldSeats: string[];
  bookedSeats: string[];
};

const cinemaList: CinemaItem[] = [];
const DEFAULT_HOLD_MINUTES = 5;

const PRICE = {
  normal: 99000,
  couple: 180000,
};

const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
const seatsPerRow = 12;

type ShowtimePickerProps = {
  selectedCinema: string;
  showtimeDates: string[];
  showtimeDate: string;
  showtimes: Showtime[];
  selectedShowtimeId?: string;
  selectedTime: string;
  onSelectDate: (date: string) => void;
  onSelectShowtime: (st: Showtime) => void;
  formatDateLabel: (dateStr: string) => string;
  formatWeekdayLabel: (dateStr: string) => string;
};

const ShowtimePicker = memo(function ShowtimePicker({
  selectedCinema,
  showtimeDates,
  showtimeDate,
  showtimes,
  selectedShowtimeId,
  selectedTime,
  onSelectDate,
  onSelectShowtime,
  formatDateLabel,
  formatWeekdayLabel,
}: ShowtimePickerProps) {
  return (
    <div className="booking-showtime-section">
      <div className="booking-showtime-title">
        Suất chiếu của rạp đã chọn
        <span className="booking-showtime-subtitle">{selectedCinema}</span>
      </div>

      {showtimeDates.length === 0 ? (
        <div style={{
          padding: "20px",
          textAlign: "center",
          color: "#999",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
          fontSize: "14px",
        }}>
          <p>Rạp này chưa có suất chiếu khả dụng</p>
        </div>
      ) : (
        <>
          <div className="booking-date-list">
            {showtimeDates.map((date) => (
              <button
                key={date}
                type="button"
                className={date === showtimeDate ? "booking-date-btn active" : "booking-date-btn"}
                onClick={() => onSelectDate(date)}
              >
                {formatWeekdayLabel(date)} - {formatDateLabel(date)}
              </button>
            ))}
          </div>

          <div className="booking-showtime-grid">
            {showtimes.map((st) => (
              <button
                key={st._id}
                type="button"
                className={
                  selectedTime === st.time && selectedShowtimeId === st._id
                    ? "booking-showtime-btn active"
                    : "booking-showtime-btn"
                }
                onClick={() => onSelectShowtime(st)}
              >
                {st.time}
              </button>
            ))}

            {showtimes.length === 0 && (
              <div className="booking-showtime-empty">
                Rạp này chưa có suất chiếu cho ngày đã chọn
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
});

function buildSeatLayout(): Seat[] {
  const result: Seat[] = [];

  rows.forEach((row, rowIndex) => {
    // Row H (last row) contains only couple seats
    if (rowIndex === rows.length - 1) {
      // Create 5 couple seats for row H
      for (let i = 1; i <= 5; i++) {
        result.push({
          id: `${row}${i}`,
          row,
          number: i,
          status: "available",
          type: "couple",
        });
      }
    } else {
      // Regular seats for rows A-G
      for (let i = 1; i <= seatsPerRow; i++) {
        result.push({
          id: `${row}${i}`,
          row,
          number: i,
          status: "available",
          type: "normal",
        });
      }
    }
  });

  return result;
}

export default function BookingPage() {
  const location = useLocation();
  const { id: routeMovieId } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const rawBookingInfo = (location.state as BookingState) || {};
  const bookingInfo: BookingState =
    routeMovieId && !rawBookingInfo.movieId
      ? { ...rawBookingInfo, movieId: routeMovieId }
      : rawBookingInfo;

  const [selectedTime, setSelectedTime] = useState<string>(bookingInfo.time || "");
  const [showtimeId, setShowtimeId] = useState<string | undefined>(bookingInfo.showtimeId);
  const [showtimeDate, setShowtimeDate] = useState<string>(bookingInfo.date || "");
  const [movieShowtimes, setMovieShowtimes] = useState<Showtime[]>([]);
  const [searchCinema, setSearchCinema] = useState("");
  const [selectedArea, setSelectedArea] = useState("Tất cả");
  const [selectedCinema, setSelectedCinema] = useState(
    bookingInfo.cinema || "Popcorn Cinema Vincom Bà Triệu"
  );
  const [cinemas, setCinemas] = useState<CinemaItem[]>(cinemaList);
  const [currentShowtime, setCurrentShowtime] = useState<Showtime | null>(null);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [seats, setSeats] = useState<Seat[]>(buildSeatLayout());
  const [seatStatus, setSeatStatus] = useState<SeatStatusPayload | null>(null);
  const [seatHoldId, setSeatHoldId] = useState<string | null>(null);
  const seatHoldRef = useRef<string | null>(null);
  const keepHoldRef = useRef(false);
  const [holdExpiresAt, setHoldExpiresAt] = useState<Date | null>(null);
  const [holdCountdown, setHoldCountdown] = useState("05:00");
  const prefilledSeatsRef = useRef(false);

  const selectedSeats = useMemo(() => seats.filter((seat) => seat.status === "selected"), [seats]);

  const selectedSeatIdsKey = useMemo(
    () =>
      selectedSeats
        .map((s) => s.id)
        .sort()
        .join(","),
    [selectedSeats]
  );

  const totalPrice = useMemo(
    () => selectedSeats.reduce((sum, seat) => sum + PRICE[seat.type], 0),
    [selectedSeats]
  );

  const normalizeCinema = useCallback((name: string) => {
    if (!name) return "";
    return name.split(" - ")[0].trim();
  }, []);

  // Get available cinemas for current movie
  const availableCinemasForMovie = useMemo(() => {
    if (movieShowtimes.length === 0) return [];
    const cinemaSet = new Set<string>();
    movieShowtimes.forEach((st) => {
      const normalized = normalizeCinema(st.cinema);
      cinemaSet.add(normalized);
    });
    return Array.from(cinemaSet);
  }, [movieShowtimes, normalizeCinema]);

  const formatDateLabel = useCallback((dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const [y, m, d] = parts;
      return `${d}/${m}`;
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const day = `${d.getDate()}`.padStart(2, "0");
      const month = `${d.getMonth() + 1}`.padStart(2, "0");
      return `${day}/${month}`;
    }
    return dateStr;
  }, []);

  const formatWeekdayLabel = useCallback((dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return weekdays[d.getDay()];
  }, []);

  useEffect(() => {
    const loadCinemas = async () => {
      try {
        const list = await getCinemas();
        const normalized = list.map((c) => ({
          ...c,
          area: (c as any).area || (c as any).city || "Khác",
        }));
        setCinemas(normalized);
        if (normalized.length > 0) {
          const found = normalized.find((c) => c.name === selectedCinema);
          if (!found) {
            setSelectedCinema(normalized[0].name);
          }
        }
      } catch (err) {
        console.error("Error loading cinemas:", err);
      }
    };

    loadCinemas();
  }, []);

  const areaOptions = useMemo(
    () => ["Tất cả", ...new Set(cinemas.map((item) => item.area || ""))],
    [cinemas]
  );

  const filteredCinemas = useMemo(() => {
    const keyword = searchCinema.trim().toLowerCase();

    return cinemas.filter((cinema) => {
      const matchArea = selectedArea === "Tất cả" ? true : cinema.area === selectedArea;

      const name = cinema.name?.toLowerCase() || "";
      const area = cinema.area?.toLowerCase() || "";
      const matchKeyword = name.includes(keyword) || area.includes(keyword);

      return matchArea && matchKeyword;
    });
  }, [searchCinema, selectedArea, cinemas]);

  useEffect(() => {
    if (filteredCinemas.length === 0) return;

    const stillExists = filteredCinemas.some((cinema) => cinema.name === selectedCinema);
    if (!stillExists) {
      setSelectedCinema(filteredCinemas[0].name);
    }
  }, [filteredCinemas, selectedCinema]);

  useEffect(() => {
    const pickShowtime = async () => {
      try {
        const all = await getShowtimes();

        const list =
          bookingInfo.movieId && all.some((st) => st.movieId === bookingInfo.movieId)
            ? all.filter((st) => st.movieId === bookingInfo.movieId)
            : all;

        const todayStr = new Date().toISOString().slice(0, 10);
        const upcoming = list.filter((st) => st.date >= todayStr);
        const finalList = upcoming.length > 0 ? upcoming : list;

        setMovieShowtimes(finalList);

        if (finalList.length > 0) {
          const first = finalList[0];
          setShowtimeId((prev) => prev || first._id);
          if (!selectedCinema) {
            setSelectedCinema(normalizeCinema(first.cinema));
          }
        }
      } catch (err) {
        console.error("Error loading showtimes:", err);
      }
    };

    pickShowtime();
  }, [bookingInfo.movieId, normalizeCinema, selectedCinema]);

  const cinemaShowtimes = useMemo(() => {
    const selectedNormalized = normalizeCinema(selectedCinema);
    return movieShowtimes
      .filter((st) => normalizeCinema(st.cinema) === selectedNormalized)
      .slice()
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  }, [movieShowtimes, selectedCinema, normalizeCinema]);

  const showtimeDates = useMemo(() => {
    const set = new Set<string>();
    cinemaShowtimes.forEach((st) => set.add(st.date));
    return Array.from(set).sort();
  }, [cinemaShowtimes]);

  const showtimesForSelection = useMemo(() => {
    if (cinemaShowtimes.length === 0) return [];
    if (showtimeDate && cinemaShowtimes.some((st) => st.date === showtimeDate)) {
      const same = cinemaShowtimes.filter((st) => st.date === showtimeDate);
      return same.length > 0 ? same : cinemaShowtimes;
    }
    return cinemaShowtimes;
  }, [cinemaShowtimes, showtimeDate]);

  useEffect(() => {
    const loadMeta = async () => {
      if (!showtimeId) return;
      try {
        const st = await getShowtimeById(showtimeId);
        setCurrentShowtime(st);

        const movieId = st.movieId || bookingInfo.movieId;
        if (movieId) {
          const mv = await getMovieById(movieId);
          setCurrentMovie(mv);
        }
      } catch (err) {
        console.error("Error loading showtime/movie:", err);
      }
    };

    loadMeta();
  }, [showtimeId, bookingInfo.movieId]);

  useEffect(() => {
    if (cinemaShowtimes.length === 0) {
      if (showtimeId !== undefined) setShowtimeId(undefined);
      return;
    }

    const dateExists = showtimeDate && cinemaShowtimes.some((st) => st.date === showtimeDate);
    const targetDate = dateExists ? showtimeDate : cinemaShowtimes[0].date;
    const showtimesSameDate = cinemaShowtimes.filter((st) => st.date === targetDate);

    const current = showtimeId ? cinemaShowtimes.find((st) => st._id === showtimeId) : undefined;

    const next = current && current.date === targetDate ? current : showtimesSameDate[0];
    if (!next) return;

    if (showtimeId !== next._id) setShowtimeId(next._id);
    if (showtimeDate !== next.date) setShowtimeDate(next.date);
    if (selectedTime !== next.time) setSelectedTime(next.time);
    const normNext = normalizeCinema(next.cinema);
    if (normalizeCinema(selectedCinema) !== normNext) setSelectedCinema(normNext);
  }, [cinemaShowtimes, showtimeDate, showtimeId, selectedTime, selectedCinema, normalizeCinema]);

  const handleSelectDate = useCallback((date: string) => {
    setShowtimeDate(date);
  }, []);

  const handleSelectShowtime = useCallback(
    (st: Showtime) => {
      setShowtimeId(st._id);
      setSelectedTime(st.time);
      setShowtimeDate(st.date);
      setSelectedCinema(normalizeCinema(st.cinema));
    },
    [normalizeCinema]
  );

  // Reset seats when switching to a different showtime/cinema
  useEffect(() => {
    setSeats(buildSeatLayout());
    setSeatStatus(null);
  }, [showtimeId]);

  useEffect(() => {
    if (!showtimeId) return;
    let cancelled = false;

    const restoreHold = async () => {
      try {
        const hold = await getMySeatHold(showtimeId);
        if (cancelled || !hold) return;
        seatHoldRef.current = hold._id;
        setSeatHoldId(hold._id);
        setHoldExpiresAt(new Date(hold.expiresAt));

        setSeats((prev) => {
          const hasSelection = prev.some((s) => s.status === "selected");
          if (hasSelection) return prev;

          return prev.map((seat) => {
            const matchId = hold.seats.includes(seat.id);
            const matchCouple = hold.seats.includes(`C${seat.number}`);
            if (matchId || matchCouple) {
              return { ...seat, status: "selected" };
            }
            return seat;
          });
        });
      } catch (err) {
        console.error("Error restoring seat hold:", err);
      }
    };

    restoreHold();

    return () => {
      cancelled = true;
    };
  }, [showtimeId]);

  useEffect(() => {
    let timer: number | undefined;

    const loadSeatStatus = async () => {
      if (!showtimeId) return;

      try {
        const status = await getShowtimeSeatStatus(showtimeId);

        setSeatStatus(status);
        setSeats((prev) => {
          const selectedIds = prev.filter((s) => s.status === "selected").map((s) => s.id);
          return prev.map((seat) => {
            const isBooked = status.bookedSeats.includes(seat.id);
            const isHeld = status.heldSeats.includes(seat.id);
            const isSelected = selectedIds.includes(seat.id);

            if (isBooked) return { ...seat, status: "booked" };
            if (isSelected) return { ...seat, status: "selected" };
            if (isHeld) return { ...seat, status: "booked" };
            return { ...seat, status: "available" };
          });
        });
      } catch (err) {
        console.error("Error loading seat status:", err);
      }
    };

    loadSeatStatus();
    timer = window.setInterval(loadSeatStatus, 5000);

    return () => {
      if (timer !== undefined) {
        window.clearInterval(timer);
      }
    };
  }, [showtimeId]);

  useEffect(() => {
    let cancelled = false;

    const holdSeats = async () => {
      if (!showtimeId) return;
      const seatIds = selectedSeats.map((s) => (s.type === "couple" ? `C${s.number}` : s.id));

      const prevHoldId = seatHoldRef.current;

      if (seatIds.length === 0) {
        if (prevHoldId) {
          try {
            await releaseSeatHold(prevHoldId);
          } catch (err) {
            console.error("Release seat hold error:", err);
          } finally {
            seatHoldRef.current = null;
            setSeatHoldId(null);
            setHoldExpiresAt(null);
          }
        }
        return;
      }

      try {
        if (prevHoldId) {
          try {
            await releaseSeatHold(prevHoldId);
          } catch (err) {
            console.error("Release previous hold error:", err);
          } finally {
            seatHoldRef.current = null;
            setSeatHoldId(null);
            setHoldExpiresAt(null);
          }
        }

        const newHold = await createSeatHold(showtimeId, seatIds);
        if (cancelled) {
          if (!keepHoldRef.current) {
            releaseSeatHold(newHold._id).catch(() => {});
          }
          return;
        }
        seatHoldRef.current = newHold._id;
        setSeatHoldId(newHold._id);
        if (newHold.expiresAt) {
          setHoldExpiresAt(new Date(newHold.expiresAt));
        } else {
          setHoldExpiresAt(new Date(Date.now() + DEFAULT_HOLD_MINUTES * 60 * 1000));
        }
      } catch (err: any) {
        console.error("Create seat hold error:", err);
        const msg =
          typeof err?.message === "string" && err.message.includes("Seats already")
            ? err.message.replace("Seats already held/booked: ", "Ghế ")
            : "Ghế vừa được giữ hoặc đặt, vui lòng chọn ghế khác.";
        alert(msg);
      }
    };

    holdSeats();

    return () => {
      cancelled = true;
      if (!keepHoldRef.current) {
        const currentHold = seatHoldRef.current;
        if (currentHold) {
          releaseSeatHold(currentHold).catch(() => {});
          seatHoldRef.current = null;
          setSeatHoldId(null);
          setHoldExpiresAt(null);
        }
      }
    };
  }, [selectedSeatIdsKey, showtimeId, selectedSeats]);

  useEffect(() => {
    const format = (ms: number) => {
      const totalSeconds = Math.max(0, Math.floor(ms / 1000));
      const m = Math.floor(totalSeconds / 60)
        .toString()
        .padStart(2, "0");
      const s = (totalSeconds % 60).toString().padStart(2, "0");
      return `${m}:${s}`;
    };

    const interval = setInterval(() => {
      if (!seatHoldRef.current || !holdExpiresAt) {
        setHoldCountdown(`0${DEFAULT_HOLD_MINUTES}:00`);
        return;
      }

      const diff = holdExpiresAt.getTime() - Date.now();
      if (diff <= 0) {
        const current = seatHoldRef.current;
        releaseSeatHold(current).catch(() => {});
        seatHoldRef.current = null;
        setSeatHoldId(null);
        setHoldExpiresAt(null);
        setSeats((prev) =>
          prev.map((seat) =>
            seat.status === "selected" ? { ...seat, status: "available" } : seat
          )
        );
        setHoldCountdown("00:00");
        alert("Hết thời gian giữ ghế. Vui lòng chọn lại ghế.");
        navigate("/movies");
        return;
      }

      setHoldCountdown(format(diff));
    }, 1000);

    return () => clearInterval(interval);
  }, [holdExpiresAt, navigate]);

  const groupedSeats = useMemo(
    () =>
      rows.map((row) => ({
        row,
        seats: seats.filter((seat) => seat.row === row),
      })),
    [seats]
  );

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
    if (!showtimeId) {
      alert("Vui lòng chọn suất chiếu. Nếu rạp không có suất chiếu, vui lòng chọn rạp khác hoặc ngày khác.");
      return;
    }

    if (!selectedCinema) {
      alert("Vui lòng chọn rạp.");
      return;
    }

    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất 1 ghế.");
      return;
    }

    keepHoldRef.current = true;

    navigate("/snacks", {
      state: {
        ...bookingInfo,
        movieTitle: currentMovie?.title || bookingInfo.movieTitle,
        poster: currentMovie?.poster || bookingInfo.poster,
        cinema: selectedCinema,
        time: selectedTime,
        date: showtimeDate || bookingInfo.date,
        room: currentShowtime?.cinema || bookingInfo.room || selectedCinema,
        seats: selectedSeats.map((seat) => (seat.type === "couple" ? `C${seat.number}` : seat.id)),
        totalPrice,
        showtimeId,
        seatHoldId: seatHoldId,
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
                  <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}>
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
                    onChange={(e) => {
                      const cinemaName = e.target.value;
                      const normalized = normalizeCinema(cinemaName);
                      
                      // Validate: selected cinema must have showtimes for current movie
                      if (bookingInfo.movieId) {
                        if (!availableCinemasForMovie.includes(normalized)) {
                          alert("Rạp này không có suất chiếu cho phim đã chọn. Vui lòng chọn rạp khác.");
                          return;
                        }
                      }
                      
                      setSelectedCinema(cinemaName);
                    }}
                    disabled={filteredCinemas.length === 0}
                  >
                    {filteredCinemas.length > 0 ? (
                      filteredCinemas.map((cinema) => (
                        <option
                          key={cinema.id || (cinema as any)._id || cinema.name}
                          value={cinema.name}
                        >
                          {cinema.name} - {cinema.area}
                        </option>
                      ))
                    ) : (
                      <option value="">Không tìm thấy rạp phù hợp</option>
                    )}
                  </select>
                </div>
              </div>

              <ShowtimePicker
                selectedCinema={selectedCinema}
                showtimeDates={showtimeDates}
                showtimeDate={showtimeDate}
                showtimes={showtimesForSelection}
                selectedShowtimeId={showtimeId}
                selectedTime={selectedTime}
                onSelectDate={handleSelectDate}
                onSelectShowtime={handleSelectShowtime}
                formatDateLabel={formatDateLabel}
                formatWeekdayLabel={formatWeekdayLabel}
              />
            </div>

            <div className="booking-seat-card">
              <div className="screen-wrapper">
                <div className="screen-label">Màn hình</div>
              </div>

              {cinemaShowtimes.length === 0 ? (
                <div style={{
                  padding: "40px 20px",
                  textAlign: "center",
                  color: "#999",
                  fontSize: "16px",
                }}>
                  <p>Chọn suất chiếu để xem bản đồ ghế</p>
                </div>
              ) : (
                <>
                  <div className="seat-map">
                    {groupedSeats.map((group) => (
                      <div className="seat-row" key={group.row}>
                        <div className="seat-row-label">{group.row}</div>

                        <div className="seat-row-seats">
                          {group.seats.map((seat, index) => {
                            const addGap = group.row !== "L" && index === 4 ? "middle-gap" : "";

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
                </>
              )}
            </div>
          </div>

          <div className="booking-right-panel">
            <div className="booking-timer">Thời gian giữ ghế: {holdCountdown}</div>

            <div className="booking-summary-card">
              <div className="booking-movie-summary">
                <img
                  src={currentMovie?.poster || bookingInfo.poster || "/images/logo/logo.png"}
                  alt={currentMovie?.title || bookingInfo.movieTitle || "movie"}
                  className="booking-movie-poster"
                />

                <div className="booking-movie-meta">
                  <div className="booking-movie-title-row">
                    <h3>{currentMovie?.title || bookingInfo.movieTitle || "Đang tải..."}</h3>
                    <span className="movie-age-badge">
                      {currentMovie?.rating || bookingInfo.rating || "--"}
                    </span>
                  </div>

                  <p className="booking-cinema-name">
                    {currentShowtime?.cinema || selectedCinema}
                  </p>
                  <p>Suất: {selectedTime} - {currentShowtime?.date || showtimeDate || bookingInfo.date || "--"}</p>
                  <p>
                    Phòng: {bookingInfo.room || "Phòng 1"} - {bookingInfo.format || "2D Phụ đề"}
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
                        .map((seat) => (seat.type === "couple" ? `C${seat.number}` : seat.id))
                        .join(", ")
                    : "Chưa chọn"}
                </span>

                <span>{totalPrice.toLocaleString("vi-VN")} d</span>
              </div>

              <div className="booking-divider" />

              <div className="booking-total">
                <span>Tổng cộng</span>
                <strong>{totalPrice.toLocaleString("vi-VN")} d</strong>
              </div>

              <div className="booking-note">
                Ghế thường: {PRICE.normal.toLocaleString("vi-VN")} đ
                <br />
                Ghế couple: {PRICE.couple.toLocaleString("vi-VN")} đ
              </div>

              <div className="booking-actions">
                <button type="button" className="booking-back-btn" onClick={() => navigate(-1)}>
                  Quay lại
                </button>

                <button 
                  type="button" 
                  className="booking-next-btn" 
                  onClick={handleContinue}
                  disabled={!showtimeId || selectedSeats.length === 0}
                  title={!showtimeId ? "Vui lòng chọn suất chiếu" : selectedSeats.length === 0 ? "Vui lòng chọn ít nhất 1 ghế" : ""}
                >
                  Tiếp tục
                </button>
              </div>

              <div className="booking-route-back">
                <Link to="/movies">Về danh sách phim</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
