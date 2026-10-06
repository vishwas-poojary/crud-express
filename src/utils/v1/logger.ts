import pino, { Logger } from "pino";
import os from "os";
import { config } from "../../config/v1/config";

function getServiceName(): string {
  return config.SERVICE_NAME;
}

function getInstanceName(): string {
  return os.hostname();
}

const logger: Logger = pino({
  level: config.LOG_LEVEL,
  base: {
    service: getServiceName(),
    instance: getInstanceName(),
  },
  transport:
    config.ENVIRONMENT === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,
});

export { logger };
