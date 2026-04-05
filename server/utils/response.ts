// Standard response wrapper for consistent API responses
export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  error?: any;
}

export const successResponse = <T>(
  data: T,
  message: string = "Success",
  statusCode: number = 200
): ApiResponse<T> => {
  return {
    success: true,
    statusCode,
    message,
    data,
  };
};

export const errorResponse = (
  message: string = "Error",
  statusCode: number = 500,
  error?: any
): ApiResponse => {
  return {
    success: false,
    statusCode,
    message,
    error,
  };
};
