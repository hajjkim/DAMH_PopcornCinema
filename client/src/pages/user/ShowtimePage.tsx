import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/ShowtimePage.css";
import { showtimeList } from "../../data/showtimes";

const dateOptions = [
  { label: "27/03", value: "2026-03-27" },
  { label: "28/03", value: "2026-03-28" },
];

type SortType = "name-asc" | "name-desc" | "time-asc" | "time-desc";

export default function ShowtimePage() {
  const [selectedDate, setSelectedDate] = useState<string>("2026-03-27");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [sortType, setSortType] = useState<SortType>("name-asc");

  const location = useLocation();
  const navigate = useNavigate();

  const selectedMovieTitle = (location.state as { movieTitle?: string })?.movieTitle;

  const filteredShowtimes = useMemo(() => {
    let result = showtimeList.filter((item) => {
      const matchDate = item.date === selectedDate;
      const matchMovie = selectedMovieTitle
        ? item.movieTitle === selectedMovieTitle
        : true;
      const matchSearch = item.movieTitle
        .toLowerCase()
        .includes(searchKeyword.toLowerCase().trim());

      return matchDate && matchMovie && matchSearch;
    });

    result = [...result].sort((a, b) => {
      if (sortType === "name-asc") {
        return a.movieTitle.localeCompare(b.movieTitle, "vi");
      }

      if (sortType === "name-desc") {
        return b.movieTitle.localeCompare(a.movieTitle, "vi");
      }

      const firstTimeA = a.times[0] || "";
      const firstTimeB = b.times[0] || "";
      const lastTimeA = a.times[a.times.length - 1] || "";
      const lastTimeB = b.times[b.times.length - 1] || "";

      if (sortType === "time-asc") {
        return firstTimeA.localeCompare(firstTimeB);
      }

      if (sortType === "time-desc") {
        return lastTimeB.localeCompare(lastTimeA);
      }

      return 0;
    });

    return result;
  }, [selectedDate, selectedMovieTitle, searchKeyword, sortType]);

  return (
    <div className="showtime-page">
      <div className="showtime-container">
        <div className="showtime-header">
          <h1>LỊCH CHIẾU</h1>
          <p>Chọn ngày, tìm phim và chọn suất chiếu phù hợp</p>
        </div>

        <div className="showtime-date-tabs">
          {dateOptions.map((date) => (
            <button
              key={date.value}
              type="button"
              className={
                selectedDate === date.value
                  ? "showtime-date-btn active"
                  : "showtime-date-btn"
              }
              onClick={() => setSelectedDate(date.value)}
            >
              {date.label}
            </button>
          ))}
        </div>

        <div className="showtime-toolbar">
          <div className="showtime-search-box">
            <input
              type="text"
              placeholder="Tìm tên phim..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="showtime-search-input"
            />
          </div>

          <div className="showtime-sort-box">
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value as SortType)}
              className="showtime-sort-select"
            >
              <option value="name-asc">Tên phim A-Z</option>
              <option value="name-desc">Tên phim Z-A</option>
              <option value="time-asc">Giờ chiếu sớm nhất</option>
              <option value="time-desc">Giờ chiếu muộn nhất</option>
            </select>
          </div>
        </div>

        <div className="showtime-list">
          {filteredShowtimes.length > 0 ? (
            filteredShowtimes.map((item) => (
              <div className="showtime-card" key={item.id}>
                <div className="showtime-poster">
                  <img src={item.moviePoster} alt={item.movieTitle} />
                </div>

                <div className="showtime-content">
                  <h2>{item.movieTitle}</h2>

                  <div className="showtime-meta">
                    <span>{item.format}</span>
                    <span>{item.room}</span>
                    <span>{item.date}</span>
                  </div>

                  <div className="showtime-times">
                    {item.times.map((time) => (
                      <button
                        key={time}
                        type="button"
                        className="showtime-time-btn"
                        onClick={() =>
                        navigate(`/booking/${item.id}`, {
                          state: {
                            movieTitle: item.movieTitle,
                            poster: item.moviePoster,
                            date: item.date,
                            time,
                            room: item.room,
                            format: item.format,
                          },
                        })
                      }
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="showtime-empty">
              <p>Không tìm thấy lịch chiếu phù hợp.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}   