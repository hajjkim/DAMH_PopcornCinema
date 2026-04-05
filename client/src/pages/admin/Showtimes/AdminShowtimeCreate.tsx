import { useState, useEffect } from "react";
import "../../../styles/Admin/Showtimes/AdminShowtime.css";
import { movieAPI, cinemaAPI, auditoriumAPI } from "../../../services/movie.api";
import { showtimeAPI } from "../../../services/admin.api";
import { useNavigate } from "react-router-dom";

type Movie = { _id: string; title: string };
type Cinema = { _id: string; name: string };
type Auditorium = { _id: string; name: string; cinemaId: string | { _id: string } };

export default function AdminShowtimeCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    movieId: "",
    auditoriumId: "",
    showDate: "",
    startTime: "",
    endTime: "",
    basePrice: 0,
    status: "OPEN",
  });

  const [movies, setMovies] = useState<Movie[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [auditoriums, setAuditoriums] = useState<Auditorium[]>([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, cinemasRes, auditoriumsRes] = await Promise.all([
          movieAPI.getAll(),
          cinemaAPI.getAll(),
          auditoriumAPI.getAll(),
        ]);
        setMovies(moviesRes || []);
        setCinemas(cinemasRes || []);
        setAuditoriums(auditoriumsRes || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCinemaChange = (e: any) => {
    setSelectedCinemaId(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // Combine date and time
      const startDateTime = new Date(`${form.showDate}T${form.startTime}`);
      const endDateTime = new Date(`${form.showDate}T${form.endTime}`);

      const payload = {
        movieId: form.movieId,
        auditoriumId: form.auditoriumId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        basePrice: form.basePrice,
        status: form.status,
      };

      await showtimeAPI.create(payload);
      alert("Thêm suất chiếu thành công!");
      navigate("/admin/showtimes");
    } catch (err: any) {
      setError(err.message || "Lỗi khi thêm suất chiếu");
      alert("Lỗi: " + (err.message || "Không thể thêm suất chiếu"));
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAuditoriums = auditoriums.filter((aud) => {
    const audCinemaId = typeof aud.cinemaId === 'object' ? aud.cinemaId._id : aud.cinemaId;
    return audCinemaId === selectedCinemaId;
  });

  if (loading) {
    return (
      <section className="admin-page-section">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Đang tải dữ liệu...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page-section">
      <div className="admin-card">
        <form className="admin-form-grid" onSubmit={handleSubmit}>
          {error && (
            <div
              className="admin-form-group"
              style={{ gridColumn: "1 / -1", color: "red", marginBottom: "10px" }}
            >
              {error}
            </div>
          )}

          <div className="admin-form-group">
            <label>Tên phim</label>
            <select
              name="movieId"
              value={form.movieId}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn phim --</option>
              {movies.map((movie) => (
                <option key={movie._id} value={movie._id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Rạp</label>
            <select
              value={selectedCinemaId}
              onChange={handleCinemaChange}
              required
            >
              <option value="">-- Chọn rạp --</option>
              {cinemas.map((cinema) => (
                <option key={cinema._id} value={cinema._id}>
                  {cinema.name}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Phòng</label>
            <select
              name="auditoriumId"
              value={form.auditoriumId}
              onChange={handleChange}
              required
              disabled={!selectedCinemaId}
            >
              <option value="">-- Chọn phòng --</option>
              {filteredAuditoriums.map((aud) => (
                <option key={aud._id} value={aud._id}>
                  {aud.name}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Ngày chiếu</label>
            <input
              type="date"
              name="showDate"
              value={form.showDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Giờ bắt đầu</label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Giờ kết thúc</label>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Giá tiền</label>
            <input
              type="number"
              name="basePrice"
              value={form.basePrice}
              onChange={handleChange}
              min="0"
              step="1000"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Trạng thái</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="OPEN">Đang mở bán</option>
              <option value="CLOSED">Đã đóng</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>

          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-btn admin-btn-outline"
              onClick={() => navigate("/admin/showtimes")}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={submitting}
            >
              {submitting ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}