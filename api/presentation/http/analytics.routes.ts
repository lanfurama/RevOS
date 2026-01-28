import { Router, Request, Response, NextFunction } from "express";
import type { GetDashboardAnalytics } from "../../application/use-cases/getDashboardAnalytics";

/**
 * HTTP adapter: map request/response sang use case.
 */
export function createAnalyticsRoutes(getDashboardAnalytics: GetDashboardAnalytics): Router {
  const router = Router();

  router.get("/dashboard", async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await getDashboardAnalytics.execute();
      res.json(data);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
