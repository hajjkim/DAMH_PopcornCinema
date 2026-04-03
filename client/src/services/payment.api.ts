import { apiRequest } from "./api";

export type PaymentConfig = {
  qrImage?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
};

export const getPaymentConfig = async (): Promise<PaymentConfig> => {
  return apiRequest("/payments/config", { method: "GET" });
};
