import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, updateMyProfile, type User } from "../../services/auth.api";
import { getCurrentUser, isAuthenticated, setCurrentUser } from "../../utils/auth";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const localUser = getCurrentUser();
    if (localUser) {
      setFullName(localUser.fullName || "");
      setPhone(localUser.phone || "");
      setAvatar(localUser.avatar || "");
    }

    const loadProfile = async () => {
      try {
        const data = await getMyProfile();
        setProfile(data);
        setFullName(data.fullName || "");
        setPhone(data.phone || "");
        setAvatar(data.avatar || "");
      } catch (err: any) {
        setError(err.message || "Không tải được hồ sơ");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  useEffect(() => {
    if (!avatarFile) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(avatarFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile]);

  const displayAvatar = useMemo(() => {
    return previewUrl || avatar || "https://via.placeholder.com/160?text=Avatar";
  }, [previewUrl, avatar]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const updatedUser = await updateMyProfile({
        fullName,
        phone,
        avatar,
        avatarFile,
      });

      setProfile(updatedUser);
      setFullName(updatedUser.fullName || "");
      setPhone(updatedUser.phone || "");
      setAvatar(updatedUser.avatar || "");
      setAvatarFile(null);
      setCurrentUser(updatedUser);
      setSuccess("Cập nhật hồ sơ thành công");
    } catch (err: any) {
      setError(err.message || "Cập nhật hồ sơ thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: "900px", margin: "40px auto", padding: "24px" }}>
        Đang tải...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "24px",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <h1
        style={{
          fontSize: "36px",
          fontWeight: 700,
          marginBottom: "24px",
          color: "#0f172a",
        }}
      >
        Hồ sơ cá nhân
      </h1>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <img
          src={displayAvatar}
          alt="Avatar"
          style={{
            width: "110px",
            height: "110px",
            borderRadius: "999px",
            objectFit: "cover",
            border: "1px solid #cbd5e1",
          }}
        />
        <div>
          <p style={{ fontWeight: 700, marginBottom: "6px", color: "#0f172a" }}>
            {profile?.email}
          </p>
          <p style={{ color: "#64748b" }}>{profile?.role || "CUSTOMER"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
              color: "#334155",
            }}
          >
            Họ và tên
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #cbd5e1",
              borderRadius: "10px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
              color: "#334155",
            }}
          >
            Số điện thoại
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #cbd5e1",
              borderRadius: "10px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
              color: "#334155",
            }}
          >
            Avatar URL
          </label>
          <input
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #cbd5e1",
              borderRadius: "10px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
              color: "#334155",
            }}
          >
            Upload ảnh đại diện
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #cbd5e1",
              borderRadius: "10px",
              boxSizing: "border-box",
            }}
          />
          <p style={{ marginTop: "8px", color: "#64748b", fontSize: "14px" }}>
            Nếu chọn file, hệ thống sẽ ưu tiên upload file thay vì Avatar URL.
          </p>
        </div>

        {error ? (
          <p style={{ color: "#dc2626", marginBottom: "16px" }}>{error}</p>
        ) : null}

        {success ? (
          <p style={{ color: "#16a34a", marginBottom: "16px" }}>{success}</p>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          style={{
            padding: "12px 18px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#111827",
            color: "#fff",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
}