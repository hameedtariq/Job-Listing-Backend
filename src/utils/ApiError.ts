class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }

  static badRequest(message: string) {
    return new ApiError(message, 400);
  }

  static notFound(message: string) {
    return new ApiError(message, 404);
  }

  static internal(message: string) {
    return new ApiError(message, 500);
  }
}

export default ApiError;
