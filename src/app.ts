import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { apiReference } from "@scalar/express-api-reference";
import { config } from "./config/v1/config";
import { logger } from "./utils/v1/logger";
import { entryPoint } from "./middleware/entryPoint";
import { exitPoint, sendResponse } from "./middleware/exitPoint";
import { registerRoutes } from "./routes/v1/index";
import { HttpException } from "./exceptions/v1/HttpException";
import { HTTP_STATUS } from "./utils/v1/constants";
import { openApiSpec } from "./openapi/spec";
import taskRoutes from "./routes/taskRoutes";

const app: Application = express();

// Enable CORS
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Attach entryPoint (timing, transaction ID, correlation, child logger)
app.use(entryPoint);

// Attach exitPoint (headers: X-Transaction-Id, X-Response-Time, X-Environment, logging)
app.use(exitPoint);

// Root route
app.get("/", (_req: Request, res: Response) => {
  return sendResponse(res, {
    isSuccess: true,
    status: HTTP_STATUS.OK,
    message: "Express CRUD Service is running",
    data: {
      service: config.SERVICE_NAME,
      environment: config.ENVIRONMENT,
      documentation: "/scalar",
      endpoints: "/v1/items",
    },
    toastMessage: "Welcome to Express CRUD Service",
  });
});

// OpenAPI Spec Endpoint
app.get("/openapi.json", (_req: Request, res: Response) => {
  res.json(openApiSpec);
});

// Interactive Scalar API Reference & Testing UI
app.get(
  "/scalar",
  apiReference({
    theme: "purple",
    pageTitle: "Express API Reference - Scalar",
    spec: {
      content: openApiSpec,
    },
  }),
);

app.get(
  "/reference",
  apiReference({
    theme: "purple",
    pageTitle: "Express API Reference - Scalar",
    spec: {
      content: openApiSpec,
    },
  }),
);

// Swagger UI Documentation Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Register V1 API Routes
registerRoutes(app);

// Legacy routes support for backward compatibility
app.use("/api/tasks", taskRoutes);

// 404 Not Found Handler
app.use((req: Request, res: Response) => {
  const log = req.log || logger;
  log.warn({ path: req.originalUrl || req.url, method: req.method }, "Resource not found");

  return sendResponse(res, {
    isSuccess: false,
    status: HTTP_STATUS.NOT_FOUND,
    message: "Route not found",
    toastMessage: `Cannot ${req.method} ${req.originalUrl || req.url}`,
  });
});

// Global Error Handler
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const log = req.log || logger;

  if (err instanceof SyntaxError && "status" in err && (err as { status?: number }).status === 400) {
    log.warn({ err }, "Malformed JSON payload in request");
    return sendResponse(res, {
      isSuccess: false,
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Invalid JSON payload",
      toastMessage: "Invalid JSON format in request body",
    });
  }

  if (err instanceof HttpException) {
    log.warn({ err, status: err.status }, "Handled application exception");
    return sendResponse(res, {
      isSuccess: false,
      status: err.status,
      message: err.message,
      data: err.details,
      toastMessage: err.toastMessage,
    });
  }

  const errorObj = err instanceof Error ? err : new Error(String(err));
  log.error({ err: errorObj }, "Unhandled server exception");

  return sendResponse(res, {
    isSuccess: false,
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: config.ENVIRONMENT === "production" ? "Internal server error" : errorObj.message,
    data: config.ENVIRONMENT === "production" ? null : { stack: errorObj.stack },
    toastMessage: "An unexpected error occurred. Please try again later.",
  });
});

// Start the server
const port = config.PORT;
logger.info(`Starting ${config.SERVICE_NAME} on port ${port} in ${config.ENVIRONMENT} mode...`);

app.listen(port, () => {
  logger.info(`🚀 Server is listening at http://localhost:${port}`);
  logger.info(`📖 Scalar API Docs: http://localhost:${port}/scalar`);
  logger.info(`📄 Swagger UI: http://localhost:${port}/api-docs`);
});

export default app;
