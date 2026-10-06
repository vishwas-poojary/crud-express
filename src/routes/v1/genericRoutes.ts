import { Router, Request, Response } from "express";
import { sendResponse } from "../../middleware/exitPoint";
import { HTTP_STATUS, ITEM_CATEGORY, ITEM_STATUS } from "../../utils/v1/constants";

const genericRoutes = Router();

genericRoutes.get("/constants", (_req: Request, res: Response) => {
  return sendResponse(res, {
    isSuccess: true,
    status: HTTP_STATUS.OK,
    message: "Constants fetched successfully",
    data: {
      ITEM_CATEGORY,
      ITEM_STATUS,
      HTTP_STATUS,
    },
    toastMessage: "Constants loaded",
  });
});

genericRoutes.get("/health", (_req: Request, res: Response) => {
  return sendResponse(res, {
    isSuccess: true,
    status: HTTP_STATUS.OK,
    message: "Service is healthy",
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memoryUsage: process.memoryUsage(),
    },
    toastMessage: "System healthy",
  });
});

export { genericRoutes };
