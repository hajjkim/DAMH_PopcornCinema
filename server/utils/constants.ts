// Application constants
export const SEAT_TYPES = {
  VIP: "VIP",
  COUPLE: "COUPLE",
} as const;

export const USER_ROLES = {
  ADMIN: "ADMIN",
  CUSTOMER: "CUSTOMER",
} as const;

export const USER_STATUSES = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export const MOVIE_STATUSES = {
  COMING_SOON: "COMING_SOON",
  NOW_SHOWING: "NOW_SHOWING",
  ENDED: "ENDED",
} as const;

export const BOOKING_STATUSES = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
} as const;

export const PAYMENT_STATUSES = {
  PENDING: "PENDING",
  SUCCESSFUL: "SUCCESSFUL",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export const PAYMENT_METHODS = {
  CREDIT_CARD: "CREDIT_CARD",
  DEBIT_CARD: "DEBIT_CARD",
  BANK_TRANSFER: "BANK_TRANSFER",
  E_WALLET: "E_WALLET",
  CASH: "CASH",
} as const;

export const PROMOTION_DISCOUNT_TYPES = {
  PERCENTAGE: "PERCENTAGE",
  FIXED_AMOUNT: "FIXED_AMOUNT",
} as const;

export const SNACK_CATEGORIES = {
  POPCORN: "POPCORN",
  DRINK: "DRINK",
  CANDY: "CANDY",
  HOT_FOOD: "HOT_FOOD",
  OTHER: "OTHER",
} as const;

export const TICKET_STATUSES = {
  VALID: "VALID",
  USED: "USED",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
} as const;

export const SEAT_HOLD_DURATION_MINUTES = 5;
export const JWT_EXPIRY = "24h";
export const MAX_BOOKING_SEATS = 10;
