import express, { Request, Response, NextFunction } from "express";
import { createAnalyticsRoutes } from "./analytics.routes";
import type { GetDashboardAnalytics } from "../../application/use-cases/getDashboardAnalytics";

export function createApp(
  getDashboardAnalytics: GetDashboardAnalytics
): express.Application {
  const app = express();
  app.use(express.json());

  app.use("/api/analytics", createAnalyticsRoutes(getDashboardAnalytics));

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  app.use(
    (err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  );

  return app;
}
