import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/Admin/Movies/AdminForm.css";
import { movieAPI } from "../../../services/movie.api";

export default function AdminMovieCreate() {
  const navigate = useNavigate();

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
    description: "",
    posterUrl: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const err: any = {};

    // Required fields
    const requiredFields = ["title", "genre", "duration", "releaseDate", "ageRating", "director"];
    requiredFields.forEach((key) => {
      if (!form[key as keyof typeof form]) {
        err[key] = "Không được để trống";
      }
    });

    // Duration > 50
    if (Number(form.duration) <= 50) {
      err.duration = "Thời lượng phải lớn hơn 50 phút";
    }

    // Date > today
    const today = new Date();
    const selectedDate = new Date(form.releaseDate);

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      err.releaseDate = "Ngày chiếu phải lớn hơn hôm nay";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      await movieAPI.create({
        title: form.title,
        genres: form.genre ? form.genre.split(",").map((g: string) => g.trim()).filter(Boolean) : [],
        durationMinutes: Number(form.duration),
        releaseDate: form.releaseDate,
        status: form.status,
        ageRating: form.ageRating,
        director: form.director,
        actors: form.actors ? form.actors.split(",").map((a: string) => a.trim()).filter(Boolean) : [],
        language: form.language,
        description: form.description,
        posterUrl: form.posterUrl,
      });
      alert("Thêm phim thành công!");
      navigate("/admin/movies");
    } catch (err: any) {
      alert("Lỗi: " + (err.message || "Không thể thêm phim"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-page-section">
      <div className="admin-card">
        <form className="admin-form-grid" onSubmit={handleSubmit}>
          
          {/* TÊN */}
          <div className="admin-form-group">
            <label>Tên phim</label>
            <input name="title" value={form.title} onChange={handleChange} required />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>

          {/* THỂ LOẠI */}
          <div className="admin-form-group">
            <label>Thể loại</label>
            <input name="genre" value={form.genre} onChange={handleChange} placeholder="Hành động, Phiêu lưu, ..." required />
            {errors.genre && <span className="error">{errors.genre}</span>}
          </div>

          {/* THỜI LƯỢNG */}
          <div className="admin-form-group">
            <label>Thời lượng</label>
            <input type="number" name="duration" value={form.duration} onChange={handleChange} required />
            {errors.duration && <span className="error">{errors.duration}</span>}
          </div>

          {/* NGÀY */}
          <div className="admin-form-group">
            <label>Ngày chiếu</label>
            <input type="date" name="releaseDate" value={form.releaseDate} onChange={handleChange} />
            {errors.releaseDate && (
              <span className="error">{errors.releaseDate}</span>
            )}
          </div>

          {/* STATUS */}
          <div className="admin-form-group">
            <label>Trạng thái</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="NOW_SHOWING">Đang chiếu</option>
              <option value="COMING_SOON">Sắp chiếu</option>
            </select>
          </div>

          {/* POSTER */}
          <div className="admin-form-group">
            <label>Poster URL</label>
            <input name="posterUrl" value={form.posterUrl} onChange={handleChange} placeholder="https://..." />
          </div>

          {/* PHÂN LOẠI (DROPDOWN) */}
          <div className="admin-form-group">
            <label>Phân loại</label>
            <select name="ageRating" value={form.ageRating} onChange={handleChange}>
              <option value="">-- Chọn --</option>
              <option value="P">P</option>
              <option value="K">K</option>
              <option value="T13">T13 (13+)</option>
              <option value="T16">T16 (16+)</option>
              <option value="T18">T18</option>
              <option value="C">C</option>
            </select>
            {errors.ageRating && (
              <span className="error">{errors.ageRating}</span>
            )}
          </div>

          {/* ĐẠO DIỄN */}
          <div className="admin-form-group">
            <label>Đạo diễn</label>
            <input name="director" value={form.director} onChange={handleChange} required />
            {errors.director && (
              <span className="error">{errors.director}</span>
            )}
          </div>

          {/* DIỄN VIÊN */}
          <div className="admin-form-group">
            <label>Diễn viên</label>
            <input name="actors" value={form.actors} onChange={handleChange} />
            {errors.actors && <span className="error">{errors.actors}</span>}
          </div>

          {/* NGÔN NGỮ */}
          <div className="admin-form-group">
            <label>Ngôn ngữ</label>
            <input name="language" value={form.language} onChange={handleChange} />
            {errors.language && (
              <span className="error">{errors.language}</span>
            )}
          </div>

          {/* PHỤ ĐỀ */}
          <div className="admin-form-group">
            <label>Phụ đề</label>
            <input name="subtitle" value={form.subtitle} onChange={handleChange} />
            {errors.subtitle && (
              <span className="error">{errors.subtitle}</span>
            )}
          </div>

          {/* MÔ TẢ */}
          <div className="admin-form-group admin-form-group-full">
            <label>Mô tả</label>
            <textarea name="description" value={form.description} onChange={handleChange} />
            {errors.description && (
              <span className="error">{errors.description}</span>
            )}
          </div>

          {/* ACTION */}
          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-btn admin-btn-outline"
              onClick={() => navigate("/admin/movies")}
            >
              Hủy
            </button>

            <button type="submit" disabled={loading} className="admin-btn admin-btn-primary">
              {loading ? "Đang lưu..." : "Lưu phim"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}