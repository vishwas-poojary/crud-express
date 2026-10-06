import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

/**
 * Middleware for 404 Not Found routes
 */
export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({
    success: false,
    message: `Resource not found at ${req.originalUrl}`,
  });
};

/**
 * Custom Error Interface
 */
export interface AppError extends Error {
  statusCode?: number;
}

/**
 * Global Error Handling Middleware
 */
export const errorHandler: ErrorRequestHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error("Internal Server Error:", err.stack || err.message);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
