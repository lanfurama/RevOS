"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDashboardAnalytics = void 0;
/**
 * Use case: lấy dữ liệu dashboard analytics.
 * Chỉ phụ thuộc vào domain port (IAnalyticsRepository).
 */
class GetDashboardAnalytics {
    constructor(analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }
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
exports.GetDashboardAnalytics = GetDashboardAnalytics;
