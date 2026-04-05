// Utility for generating unique codes (promo codes, booking codes, etc.)
export const generateRandomCode = (length: number = 8): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate promo code format: PROMO-XXXXXX
export const generatePromoCode = (): string => {
  return `PROMO-${generateRandomCode(6)}`;
};

// Generate order/booking code format: ORD-XXXXXXXX
export const generateOrderCode = (): string => {
  return `ORD-${generateRandomCode(8)}`;
};

// Generate ticket code format: TKT-XXXXXXXX
export const generateTicketCode = (): string => {
  return `TKT-${generateRandomCode(8)}`;
};
