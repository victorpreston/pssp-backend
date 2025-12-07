export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: number;
    message: string;
    details?: any;
  };
  timestamp: string;
}
