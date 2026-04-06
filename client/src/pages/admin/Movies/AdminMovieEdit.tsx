import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/Admin/Movies/AdminForm.css";
import { movieAPI } from "../../../services/admin.api";

export default function AdminMovieEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState({
    title: "",
    genre: "",
    duration: "",
    releaseDate: "",
    status: "NOW_SHOWING",
    ageRating: "",
    director: "",
    actors: "",
    language: "",
    subtitle: "",
    trailerUrl: "",
    description: "",
  });

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState(""); // existing URL from DB
  const [localPreview, setLocalPreview] = useState("");   // blob URL for new file
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      try {
        const movie = await movieAPI.getById(id);
        setForm({
          title: movie.title || "",
          genre: movie.genres?.join(", ") || "",
          duration: movie.duration || "",
          releaseDate: movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : "",
          status: movie.status || "NOW_SHOWING",
          ageRating: movie.rating || "",
          director: movie.director || "",
          actors: movie.actors?.join(", ") || "",
          language: movie.language || "",
          subtitle: movie.subtitle || "",
          trailerUrl: movie.trailerUrl || "",
          description: movie.description || "",
        });
        setPosterPreview(movie.poster || "");
      } catch (err: any) {
        console.error("Error fetching movie:", err);
        setError(err.message || "Không thể tải dữ liệu phim");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPosterFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setLocalPreview(url);
    } else {
      setLocalPreview("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        title: form.title,
        genres: form.genre ? form.genre.split(",").map((g: string) => g.trim()).filter(Boolean) : [],
        duration: Number(form.duration),
        releaseDate: form.releaseDate,
        status: form.status,
        rating: form.ageRating,
        director: form.director,
        actors: form.actors ? form.actors.split(",").map((a: string) => a.trim()).filter(Boolean) : [],
        language: form.language,
        subtitle: form.subtitle,
        trailerUrl: form.trailerUrl,
        description: form.description,
      };

      if (posterFile) {
        await movieAPI.updateWithFile(id, payload, posterFile);
      } else {
        await movieAPI.update(id, { ...payload, poster: posterPreview });
      }
      alert("Cập nhật phim thành công!");
      navigate("/admin/movies");
    } catch (err: any) {
      setError(err.message || "Lỗi khi cập nhật phim");
      alert("Lỗi: " + (err.message || "Không thể cập nhật phim"));
    } finally {
      setSubmitting(false);
    }
  };

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
          
          {/* TITLE */}
          <div className="admin-form-group">
            <label>Tên phim</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* GENRE */}
          <div className="admin-form-group">
            <label>Thể loại</label>
            <input
              name="genre"
              value={form.genre}
              onChange={handleChange}
            />
          </div>

          {/* DURATION */}
          <div className="admin-form-group">
            <label>Thời lượng (phút)</label>
            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
            />
          </div>

          {/* DATE */}
          <div className="admin-form-group">
            <label>Ngày khởi chiếu</label>
            <input
              type="date"
              name="releaseDate"
              value={form.releaseDate}
              onChange={handleChange}
            />
          </div>

          {/* STATUS */}
          <div className="admin-form-group">
            <label>Trạng thái</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="NOW_SHOWING">Đang chiếu</option>
              <option value="COMING_SOON">Sắp chiếu</option>
            </select>
          </div>

          {/* POSTER */}
          <div className="admin-form-group">
            <label>Poster</label>
            {(localPreview || posterPreview) && (
              <img
                src={localPreview || posterPreview}
                alt="poster preview"
                style={{ width: "100px", borderRadius: "6px", marginBottom: "8px", display: "block", objectFit: "cover" }}
              />
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* AGE */}
          <div className="admin-form-group">
            <label>Phân loại</label>
            <input
              name="ageRating"
              value={form.ageRating}
              onChange={handleChange}
            />
          </div>

          {/* DIRECTOR */}
          <div className="admin-form-group">
            <label>Đạo diễn</label>
            <input
              name="director"
              value={form.director}
              onChange={handleChange}
            />
          </div>

          {/* ACTORS */}
          <div className="admin-form-group">
            <label>Diễn viên</label>
            <input
              name="actors"
              value={form.actors}
              onChange={handleChange}
            />
          </div>

          {/* LANGUAGE */}
          <div className="admin-form-group">
            <label>Ngôn ngữ</label>
            <input
              name="language"
              value={form.language}
              onChange={handleChange}
            />
          </div>

          {/* SUBTITLE */}
          <div className="admin-form-group">
            <label>Phụ đề</label>
            <input
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
            />
          </div>

          {/* TRAILER */}
          <div className="admin-form-group">
            <label>Trailer URL</label>
            <input
              name="trailerUrl"
              value={form.trailerUrl}
              onChange={handleChange}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="admin-form-group admin-form-group-full">
            <label>Mô tả</label>
            <textarea
              name="description"
              rows={5}
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* ACTION */}
          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-btn admin-btn-outline"
              onClick={() => navigate(`/admin/movies/${id}`)}
            >
              Hủy
            </button>

            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={submitting}
            >
              {submitting ? "Đang lưu..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}