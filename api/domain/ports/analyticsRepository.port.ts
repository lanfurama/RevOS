import type { AnalyticsDatabase } from "../entities";

/**
 * Port (interface) cho persistence analytics.
 * Application layer phụ thuộc vào port này; Infrastructure implement.
 */
export interface IAnalyticsRepository {
  getAnalyticsDb(): Promise<AnalyticsDatabase>;
  saveAnalyticsDb(db: AnalyticsDatabase): Promise<void>;
}
