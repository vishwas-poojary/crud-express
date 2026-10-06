import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env") });

export interface Config {
  PORT: number;
  ENVIRONMENT: string;
  LOG_LEVEL: string;
  SERVICE_NAME: string;
}

export const config: Config = {
  PORT: parseInt(process.env.PORT || "3000", 10),
  ENVIRONMENT: process.env.ENVIRONMENT || "development",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  SERVICE_NAME: process.env.SERVICE_NAME || "express-crud-service",
};
