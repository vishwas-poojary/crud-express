import { Application } from "express";
import { itemRoutes } from "./itemRoutes";
import { genericRoutes } from "./genericRoutes";

export function registerRoutes(app: Application): void {
  // Mount V1 routes
  app.use("/v1/items", itemRoutes);
  app.use("/v1/generic", genericRoutes);
}
