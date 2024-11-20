type ApiResponse<T> = {
  message: string;
  data?: T;
  error?: string | string[];
};

export default ApiResponse;
