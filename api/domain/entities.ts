/**
 * Domain entities – không phụ thuộc layer nào khác.
 * Định nghĩa models dùng chung trong toàn bộ API.
 */

export interface PerformanceMetric {
  name: string;
  revenue: number;
  reservations: number;
  roomNights: number;
  alos: number;
  adr: number;
  leadTime: number;
  cancelled: number;
  cancelRate: number;
}

export interface ChannelMixItem {
  name: string;
  revenue: number;
  commission: number;
  color: string;
}

export interface TrendPoint {
  date: string;
  revenueP001: number;
  revenueP002: number;
  revParP001: number;
  revParP002: number;
  adrP001: number;
  adrP002: number;
}

export interface TopProblemItem {
  channel: string;
  ratePlan: string;
  commission: number;
  revenue: number;
  cancelRate: number;
}

export interface ScatterItem {
  name: string;
  leadTime: number;
  cancelRate: number;
  revenue: number;
  color: string;
}

export interface GlobalStats {
  totalRevenue: number;
  avgADR: number;
  avgCancelRate: number;
  directShare: number;
}

export interface AnalyticsDatabase {
  ratePlans: PerformanceMetric[];
  channelMix: ChannelMixItem[];
  trend: TrendPoint[];
  topProblems: TopProblemItem[];
  scatter: ScatterItem[];
  globalStats: GlobalStats;
}
