export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  code?: number;
  error?: string;
  path?: string;
  timestamp: string;
}
