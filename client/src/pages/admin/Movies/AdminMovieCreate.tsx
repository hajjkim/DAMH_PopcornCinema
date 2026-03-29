import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/Admin/Movies/AdminForm.css";

export default function AdminMovieCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    genre: "",
    duration: "",
    release_date: "",
    status: "NOW_SHOWING",
    age_rating: "",
    director: "",
    actors: "",
    language: "",
    subtitle: "",
    description: "",
    poster: null as File | null,
  });

  const [errors, setErrors] = useState<any>({});
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;

    if (name === "poster" && files?.[0]) {
      setForm({ ...form, poster: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validate = () => {
    const err: any = {};

    // Required fields
    Object.keys(form).forEach((key) => {
      if (key !== "poster" && !form[key as keyof typeof form]) {
        err[key] = "Không được để trống";
      }
    });

    // Duration > 50
    if (Number(form.duration) <= 50) {
      err.duration = "Thời lượng phải lớn hơn 50 phút";
    }

    // Date > today
    const today = new Date();
    const selectedDate = new Date(form.release_date);

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      err.release_date = "Ngày chiếu phải lớn hơn hôm nay";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    console.log("DATA:", form);

    navigate("/admin/movies");
  };

  return (
    <section className="admin-page-section">
      <div className="admin-card">
        <form className="admin-form-grid" onSubmit={handleSubmit}>
          
          {/* TÊN */}
          <div className="admin-form-group">
            <label>Tên phim</label>
            <input name="title" onChange={handleChange} />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>

          {/* THỂ LOẠI */}
          <div className="admin-form-group">
            <label>Thể loại</label>
            <input name="genre" onChange={handleChange} />
            {errors.genre && <span className="error">{errors.genre}</span>}
          </div>

          {/* THỜI LƯỢNG */}
          <div className="admin-form-group">
            <label>Thời lượng</label>
            <input type="number" name="duration" onChange={handleChange} />
            {errors.duration && <span className="error">{errors.duration}</span>}
          </div>

          {/* NGÀY */}
          <div className="admin-form-group">
            <label>Ngày chiếu</label>
            <input type="date" name="release_date" onChange={handleChange} />
            {errors.release_date && (
              <span className="error">{errors.release_date}</span>
            )}
          </div>

          {/* STATUS */}
          <div className="admin-form-group">
            <label>Trạng thái</label>
            <select name="status" onChange={handleChange}>
              <option value="NOW_SHOWING">Đang chiếu</option>
              <option value="COMING_SOON">Sắp chiếu</option>
            </select>
          </div>

          {/* POSTER */}
          <div className="admin-form-group">
            <label>Poster</label>
            <div className="upload-box">
              <input type="file" name="poster" onChange={handleChange} />
              {preview ? (
                <img src={preview} className="preview-img" />
              ) : (
                <span>Chọn ảnh</span>
              )}
            </div>
          </div>

          {/* PHÂN LOẠI (DROPDOWN) */}
          <div className="admin-form-group">
            <label>Phân loại</label>
            <select name="age_rating" onChange={handleChange}>
              <option value="">-- Chọn --</option>
              <option value="P">P</option>
              <option value="K">K</option>
              <option value="T13">T13 (13+)</option>
              <option value="T16">T16 (16+)</option>
              <option value="T18">T18</option>
              <option value="C">C</option>
            </select>
            {errors.age_rating && (
              <span className="error">{errors.age_rating}</span>
            )}
          </div>

          {/* ĐẠO DIỄN */}
          <div className="admin-form-group">
            <label>Đạo diễn</label>
            <input name="director" onChange={handleChange} />
            {errors.director && (
              <span className="error">{errors.director}</span>
            )}
          </div>

          {/* DIỄN VIÊN */}
          <div className="admin-form-group">
            <label>Diễn viên</label>
            <input name="actors" onChange={handleChange} />
            {errors.actors && <span className="error">{errors.actors}</span>}
          </div>

          {/* NGÔN NGỮ */}
          <div className="admin-form-group">
            <label>Ngôn ngữ</label>
            <input name="language" onChange={handleChange} />
            {errors.language && (
              <span className="error">{errors.language}</span>
            )}
          </div>

          {/* PHỤ ĐỀ */}
          <div className="admin-form-group">
            <label>Phụ đề</label>
            <input name="subtitle" onChange={handleChange} />
            {errors.subtitle && (
              <span className="error">{errors.subtitle}</span>
            )}
          </div>

          {/* MÔ TẢ */}
          <div className="admin-form-group admin-form-group-full">
            <label>Mô tả</label>
            <textarea name="description" onChange={handleChange} />
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

            <button className="admin-btn admin-btn-primary">
              Lưu phim
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}