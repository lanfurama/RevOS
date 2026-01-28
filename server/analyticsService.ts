import { getAnalyticsDb } from "./analyticsRepository";

// Service layer: chứa business logic, tính toán, validate...

export async function getDashboardAnalytics() {
  const db = await getAnalyticsDb();

  return {
    ratePlans: db.ratePlans,
    channelMix: db.channelMix,
    trend: db.trend,
    topProblems: db.topProblems,
    scatter: db.scatter,
    globalStats: db.globalStats,
  };
}

