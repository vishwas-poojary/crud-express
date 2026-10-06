import { Request, Response, NextFunction } from "express";
import { ApiStatus, ResponseObject } from "../utils/v1/customTypes";
import { logger } from "../utils/v1/logger";
import { config } from "../config/v1/config";

/**
 * exitPoint middleware: runs to log request completion and track execution duration.
 */
export const exitPoint = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = req.startTime || Date.now();

  res.on("finish", () => {
    const duration = `${Date.now() - startTime}ms`;
    const txnId = req.txnId || "";
    const log = req.log || logger;

    log.info(
      {
        transactionId: txnId,
        url: req.originalUrl || req.url,
        method: req.method,
        status: res.statusCode,
        timeTaken: duration,
      },
      "API Request completed",
    );
  });

  next();
};

/**
 * Standard response helper to format uniform API responses matching reference architecture:
 * { status, message, data, toastMessage }
 */
export function sendResponse(res: Response, apiStatus: ApiStatus): Response {
  const req = res.req as Request | undefined;
  const startTime = req?.startTime || Date.now();
  const duration = `${Date.now() - startTime}ms`;
  const txnId = req?.txnId || "";
  const environment = req?.environment || config.ENVIRONMENT;

  res.setHeader("X-Transaction-Id", txnId);
  res.setHeader("X-Response-Time", duration);
  res.setHeader("X-Environment", environment);

  const responseObj: ResponseObject = {
    status: apiStatus.status,
    message: apiStatus.message || (apiStatus.isSuccess ? "success" : "error"),
    data: apiStatus.data ?? null,
    toastMessage: apiStatus.toastMessage ?? (apiStatus.isSuccess ? "Operation successful" : null),
  };

  return res.status(apiStatus.status).json(responseObj);
}
