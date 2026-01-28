import type { IAnalyticsRepository } from "../../domain/ports/analyticsRepository.port";

/**
 * Use case: lấy dữ liệu dashboard analytics.
 * Chỉ phụ thuộc vào domain port (IAnalyticsRepository).
 */
export class GetDashboardAnalytics {
  constructor(private readonly analyticsRepository: IAnalyticsRepository) {}

  async execute() {
    const db = await this.analyticsRepository.getAnalyticsDb();
    return {
      ratePlans: db.ratePlans,
      channelMix: db.channelMix,
      trend: db.trend,
      topProblems: db.topProblems,
      scatter: db.scatter,
      globalStats: db.globalStats,
    };
  }
}
