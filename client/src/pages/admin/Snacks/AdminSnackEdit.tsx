import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/Admin/Snacks/AdminSnack.css";
import { snackAPI } from "../../../services/admin.api";

export default function AdminSnackEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    category: "OTHER",
    price: 0,
    status: "ACTIVE",
    description: "",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSnack = async () => {
      if (!id) return;
      try {
        const snack = await snackAPI.getById(id);
        setForm({
          name: snack.name || "",
          category: snack.category || "OTHER",
          price: snack.price || 0,
          status: snack.status || "ACTIVE",
          description: snack.description || "",
          imageUrl: snack.imageUrl || "",
        });
        if (snack.imageUrl) setImagePreview(snack.imageUrl);
      } catch (err: any) {
        console.error("Error fetching snack:", err);
        setError(err.message || "Không thể tải dữ liệu đồ ăn");
      } finally {
        setLoading(false);
      }
    };

    fetchSnack();
  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSubmitting(true);
    setError("");

    try {
      const { imageUrl, ...rest } = form;
      if (imageFile) {
        await snackAPI.updateWithFile(id, rest, imageFile);
      } else {
        await snackAPI.update(id, form);
      }
      alert("Cập nhật đồ ăn thành công!");
      navigate("/admin/snacks");
    } catch (err: any) {
      setError(err.message || "Lỗi khi cập nhật đồ ăn");
      alert("Lỗi: " + (err.message || "Không thể cập nhật đồ ăn"));
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

          <div className="admin-form-group">
            <label>Tên</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Loại</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="POPCORN">Bắp rang</option>
              <option value="DRINK">Nước uống</option>
              <option value="CANDY">Kẹo / Snack</option>
              <option value="HOT_FOOD">Đồ ăn nóng</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label>Giá</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              min="0"
              step="1000"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Trạng thái</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Tạm ngưng</option>
            </select>
          </div>

          <div className="admin-form-group admin-form-group-full">
            <label>Ảnh</label>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #ddd" }}
                  onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                />
              )}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  className="admin-btn admin-btn-outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? "Đổi ảnh" : "Chọn ảnh"}
                </button>
                {imageFile && (
                  <span style={{ marginLeft: 10, fontSize: 13, color: "#666" }}>{imageFile.name}</span>
                )}
              </div>
            </div>
          </div>

          <div className="admin-form-group admin-form-group-full">
            <label>Mô tả</label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-btn admin-btn-outline"
              onClick={() => navigate("/admin/snacks")}
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