// Helper functions for common operations
export const formatPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, "");
};

export const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export const calculateTotalPrice = (
  basePrice: number,
  quantity: number,
  discountPercent: number = 0
): number => {
  const subtotal = basePrice * quantity;
  const discount = subtotal * (discountPercent / 100);
  return subtotal - discount;
};

export const formatCurrency = (amount: number, currency: string = "VND"): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
  }).format(amount);
};

export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const retryAsync = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await delay(delayMs * (i + 1));
    }
  }
  throw new Error("Max retries exceeded");
};
