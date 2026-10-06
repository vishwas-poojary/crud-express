import { Request, Response, NextFunction, RequestHandler } from "express";
import { z } from "zod";
import { sendResponse } from "./exitPoint";
import { HTTP_STATUS } from "../utils/v1/constants";

type ValidationTarget = "json" | "query" | "param";

export const validate = (schema: z.ZodSchema, target: ValidationTarget = "json"): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let dataToValidate: unknown;

      if (target === "json") {
        dataToValidate = req.body;
      } else if (target === "query") {
        dataToValidate = req.query;
      } else if (target === "param") {
        dataToValidate = req.params;
      }

      const validated = await schema.parseAsync(dataToValidate);

      if (target === "json") {
        req.validated_json = validated;
      } else if (target === "query") {
        req.validated_query = validated;
      } else if (target === "param") {
        req.validated_param = validated;
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstIssue = error.issues[0];
        const field = firstIssue.path.join(".");
        let toastMessage = firstIssue.message;

        if (firstIssue.code === "invalid_type") {
          const typeIssue = firstIssue as z.ZodInvalidTypeIssue;
          if (typeIssue.received === "undefined" || typeIssue.received === "null") {
            toastMessage = `${field || "Field"} is required`;
          } else {
            toastMessage = `Invalid format for ${field || "field"}. Expected ${typeIssue.expected}, but got ${typeIssue.received}`;
          }
        }

        const log = req.log;
        if (log) {
          log.warn({ issues: error.issues, path: req.originalUrl || req.url }, "Request validation failed");
        }

        sendResponse(res, {
          isSuccess: false,
          status: HTTP_STATUS.BAD_REQUEST,
          message: "Validation failed",
          data: {
            issues: error.issues.map(iss => ({
              field: iss.path.join("."),
              message: iss.message,
              code: iss.code,
            })),
          },
          toastMessage,
        });
        return;
      }

      next(error);
    }
  };
};
