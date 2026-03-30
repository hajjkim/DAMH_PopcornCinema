import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/Admin/Movies/AdminForm.css";

export default function AdminMovieEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "Thỏ ơi!!!",
    genre: "Hoạt hình",
    duration: "120",
    release_date: "2025-06-01",
    status: "NOW_SHOWING",
    poster_url: "",
    age_rating: "P",
    director: "ABC",
    actors: "XYZ",
    language: "Tiếng Việt",
    subtitle: "English",
    trailer_url: "",
    description: "Phim hay...",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    console.log("UPDATE:", form);

    navigate(`/admin/movies/${id}`);
  };

  return (
    <section className="admin-page-section">
      <div className="admin-card">
        
        <form className="admin-form-grid" onSubmit={handleSubmit}>
          
          {/* TITLE */}
          <div className="admin-form-group">
            <label>Tên phim</label>
            <input name="title" value={form.title} onChange={handleChange} />
          </div>

          {/* GENRE */}
          <div className="admin-form-group">
            <label>Thể loại</label>
            <input name="genre" value={form.genre} onChange={handleChange} />
          </div>

          {/* DURATION */}
          <div className="admin-form-group">
            <label>Thời lượng</label>
            <input name="duration" value={form.duration} onChange={handleChange} />
          </div>

          {/* DATE */}
          <div className="admin-form-group">
            <label>Ngày khởi chiếu</label>
            <input type="date" name="release_date" value={form.release_date} onChange={handleChange} />
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
            <input name="poster_url" value={form.poster_url} onChange={handleChange} />
          </div>

          {/* AGE */}
          <div className="admin-form-group">
            <label>Phân loại</label>
            <input name="age_rating" value={form.age_rating} onChange={handleChange} />
          </div>

          {/* DIRECTOR */}
          <div className="admin-form-group">
            <label>Đạo diễn</label>
            <input name="director" value={form.director} onChange={handleChange} />
          </div>

          {/* ACTORS */}
          <div className="admin-form-group">
            <label>Diễn viên</label>
            <input name="actors" value={form.actors} onChange={handleChange} />
          </div>

          {/* LANGUAGE */}
          <div className="admin-form-group">
            <label>Ngôn ngữ</label>
            <input name="language" value={form.language} onChange={handleChange} />
          </div>

          {/* SUBTITLE */}
          <div className="admin-form-group">
            <label>Phụ đề</label>
            <input name="subtitle" value={form.subtitle} onChange={handleChange} />
          </div>

          {/* TRAILER */}
          <div className="admin-form-group">
            <label>Trailer URL</label>
            <input name="trailer_url" value={form.trailer_url} onChange={handleChange} />
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

            <button className="admin-btn admin-btn-primary">
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}