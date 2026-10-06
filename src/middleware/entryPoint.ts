import { Request, Response, NextFunction } from "express";
import { generateTransactionId } from "../utils/v1/helper";
import { config } from "../config/v1/config";
import { logger } from "../utils/v1/logger";

export const entryPoint = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const incomingTxnId = (req.headers["x-transaction-id"] || req.headers["x-correlation-id"]) as
    string | undefined;
  const txnId = incomingTxnId || generateTransactionId();
  const environment = config.ENVIRONMENT;

  const reqLogger = logger.child({
    transactionId: txnId,
    method: req.method,
    url: req.originalUrl || req.url,
  });

  req.startTime = startTime;
  req.txnId = txnId;
  req.environment = environment;
  req.log = reqLogger;

  res.setHeader("X-Transaction-Id", txnId);
  res.setHeader("X-Environment", environment);

  next();
};
