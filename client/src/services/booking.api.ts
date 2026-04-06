import { apiRequest } from "./api";

export type BookingInput = {
  showtimeId: string;
  seats: string[];
  snacks?: { snackId: string; qty: number }[];
  promotionCode?: string;
  ticketTotal: number;
  snackTotal?: number;
  finalTotal: number;
  seatHoldId?: string;
};

export type BookingStatus =
  | "pending_payment"
  | "pending_confirmation"
  | "confirmed"
  | "failed";

export type Booking = {
  _id: string;
  userId: string;
  showtimeId: string;
  seats: string[];
  snacks: { snackId: string; qty: number }[];
  promotionCode?: string;
  ticketTotal: number;
  snackTotal: number;
  finalTotal: number;
  status: BookingStatus;
  paymentExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type PaymentMeta = {
  orderCode: string;
  qrImageUrl?: string;
  qrContent?: string;
  status: "PENDING" | "PAID" | "EXPIRED" | "CANCELLED";
  expiresAt: string;
};

// Tạo đặt vé mới, trả về booking + thông tin thanh toán
export const createBooking = async (
  bookingData: BookingInput
): Promise<{ booking: Booking; payment: PaymentMeta }> => {
  return apiRequest("/bookings", {
    method: "POST",
    body: JSON.stringify(bookingData),
    auth: true,
  });
};

// Lấy danh sách đặt vé của user hiện tại
export const getMyBookings = async (): Promise<Booking[]> => {
  return apiRequest("/bookings/me", {
    method: "GET",
    auth: true,
  });
};

export const getBookingById = async (id: string): Promise<Booking> => {
  return apiRequest(`/bookings/${id}`, {
    method: "GET",
    auth: true,
  });
};

// Cập nhật trạng thái đặt vé (admin/system)
export const updateBookingStatus = async (
  bookingId: string,
  status: string
): Promise<Booking> => {
  return apiRequest(`/bookings/${bookingId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    auth: true,
  });
};
