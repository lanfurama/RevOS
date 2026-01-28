import { Router } from "express";
import { getDashboardAnalytics } from "./analyticsService";

export const analyticsRouter = Router();

// GET /api/analytics/dashboard
analyticsRouter.get("/dashboard", async (_req, res, next) => {
  try {
    const data = await getDashboardAnalytics();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

