// src/utils/promotionStorage.ts

// lấy key theo user
const getUserKey = () => {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  return user ? `saved_promotions_${user.id}` : null;
};

// check đã lưu chưa
export const isPromotionSaved = (promotionId: string) => {
  const key = getUserKey();
  if (!key) return false;

  const saved = JSON.parse(localStorage.getItem(key) || "[]");
  return saved.includes(promotionId);
};

// lưu khuyến mãi (chỉ lưu 1 lần)
export const savePromotion = (promotionId: string) => {
  const key = getUserKey();
  if (!key) return false;

  const saved = JSON.parse(localStorage.getItem(key) || "[]");

  // đã tồn tại → không lưu nữa
  if (saved.includes(promotionId)) return false;

  const updated = [...saved, promotionId];
  localStorage.setItem(key, JSON.stringify(updated));

  return true;
};