export type ApiResponse<T> = {
  success: boolean;
  message: string;
  status: number;
  data: T | null;
  error: string | null;
  timestamp: string;
};
