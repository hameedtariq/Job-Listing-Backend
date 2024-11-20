import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';

const errorMiddleware = (error: Error, req: Request, res: Response) => {
  if (error instanceof ApiError) {
    const status = error.status;
    const message = error.message;
    res.status(status).json({ message });
    return;
  }

  const status = 500;
  const message = error.message;
  res.status(status).json({ message });
};

export default errorMiddleware;
