import { PerformanceMetric } from '../types';
import { PropertyFilter } from '../types';

// Existing CSV parsing logic remains for raw data...
const ratePlanCSV = `Name,Room revenue (VND),Reservations,Room nights,Avg. length of stay,ADR,Avg. lead time,Cancelled reservations
P-LUXURY LEISURE RETREAT DT,314350000,8,44,4.88,7144318.18,67.88,0
P-Sleep Well Retreat - Spa Package ES,235050000,3,35,11.67,6715714.29,91,0
WEB MIN2N BB - 30,210105000,3,16,4,13131562.50,65.67,0`; // Truncated for brevity, logic handles full string

// ... (keep existing CSV strings and parseCSV function) ...
const parseCSV = (csv: string): PerformanceMetric[] => {
  const lines = csv.trim().split('\n');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      name: values[0],
      revenue: parseFloat(values[1]) || 0,
      reservations: parseInt(values[2]) || 0,
      roomNights: parseInt(values[3]) || 0,
      alos: parseFloat(values[4]) || 0,
      adr: parseFloat(values[5]) || 0,
      leadTime: parseFloat(values[6]) || 0,
      cancelled: parseInt(values[7]) || 0,
      cancelRate: 0 
    };
  }).sort((a, b) => b.revenue - a.revenue);
};

export const ratePlanData = parseCSV(ratePlanCSV);

// --- NEW DATA FOR SCREENSHOT MATCHING ---

// 1. Channel Mix Data (Matches the "Channel Mix" screenshot)
const channelMixBase = [
  { name: 'Direct - Website', revenue: 681178, commission: 0, color: '#2563eb' },
  { name: 'Booking.com', revenue: 539146, commission: 110427, color: '#ea580c' },
  { name: 'Agoda', revenue: 380034, commission: 83422, color: '#f59e0b' },
  { name: 'Expedia', revenue: 140329, commission: 40317, color: '#ca8a04' },
  { name: 'Corporate Contract', revenue: 160000, commission: 0, color: '#dc2626' },
  { name: 'Direct - Phone/Walk-in', revenue: 120000, commission: 0, color: '#16a34a' },
].sort((a, b) => b.revenue - a.revenue);

export const channelMixData = channelMixBase;

/** Channel mix by property for Dashboard 2 filter. P001 ~55%, P002 ~45% of totals. */
export const channelMixByProperty: Record<string, typeof channelMixBase> = {
  [PropertyFilter.ALL]: channelMixBase,
  [PropertyFilter.P001]: channelMixBase.map((r) => ({
    ...r,
    revenue: Math.round(r.revenue * 0.55),
    commission: Math.round(r.commission * 0.55),
  })).sort((a, b) => b.revenue - a.revenue),
  [PropertyFilter.P002]: channelMixBase.map((r) => ({
    ...r,
    revenue: Math.round(r.revenue * 0.45),
    commission: Math.round(r.commission * 0.45),
  })).sort((a, b) => b.revenue - a.revenue),
};

// 2. Trend Data (Matches "Revenue Trend" screenshot with P001 vs P002 comparison lines)
// dateISO used for date-range filtering; cancelRate/directShare for KPI aggregation
export const complexTrendData = Array.from({ length: 20 }, (_, i) => {
  const date = new Date(2025, 6, 13 + (i * 7)); // Start July 13
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const dateISO = date.toISOString().slice(0, 10); // YYYY-MM-DD

  const baseRev = 40000 + Math.sin(i / 3) * 20000;
  const revP001 = baseRev + (i % 5) * 800;
  const revP002 = baseRev * 0.7 + (i % 5) * 600;

  return {
    date: dateStr,
    dateISO,
    revenueP001: revP001,
    revenueP002: revP002,
    revParP001: 2 + Math.sin(i / 3) + (i % 10) * 0.02,
    revParP002: 1.5 + Math.sin(i / 3) + (i % 10) * 0.02,
    adrP001: 120 + Math.cos(i / 4) * 20 + (i % 7) * 2,
    adrP002: 100 + Math.cos(i / 4) * 15 + (i % 7) * 2,
    // For KPI aggregation by date range
    cancelRateP001: 0.12 + (i % 5) * 0.008,
    cancelRateP002: 0.16 + (i % 5) * 0.006,
    directShareP001: 0.32 + (i % 4) * 0.01,
    directShareP002: 0.30 + (i % 4) * 0.01,
  };
});

/** Min/max date from trend for date-range filter defaults */
export const getTrendDateRange = () => {
  if (complexTrendData.length === 0) return { min: '', max: '' };
  const first = complexTrendData[0].dateISO;
  const last = complexTrendData[complexTrendData.length - 1].dateISO;
  return { min: first, max: last };
};

// 3. Top Problems Data with property and date for filtering (Dashboard 2)
const trendDates = getTrendDateRange();
const sampleDates = trendDates.min && trendDates.max
  ? ['2025-07-13', '2025-07-20', '2025-08-03', '2025-08-17', '2025-09-01', '2025-09-14', '2025-10-01', '2025-10-15', '2025-11-01', '2025-11-17']
  : [];

export const topProblemsData = [
  { channel: 'Booking.com', ratePlan: 'Package', commission: 12621, revenue: 57495, cancelRate: 0.160, leadTime: 32, property: 'P001', date: sampleDates[0] },
  { channel: 'Booking.com', ratePlan: 'BAR', commission: 46580, revenue: 227421, cancelRate: 0.198, leadTime: 32, property: 'P001', date: sampleDates[1] },
  { channel: 'Booking.com', ratePlan: 'Corporate', commission: 16498, revenue: 80551, cancelRate: 0.175, leadTime: 30, property: 'P002', date: sampleDates[2] },
  { channel: 'Booking.com', ratePlan: 'NonRefundable', commission: 27967, revenue: 136544, cancelRate: 0.131, leadTime: 28, property: 'P002', date: sampleDates[3] },
  { channel: 'Corporate', ratePlan: 'Package', commission: 19382, revenue: 94630, cancelRate: 0.211, leadTime: 7, property: 'P001', date: sampleDates[4] },
  { channel: 'Corporate', ratePlan: 'BAR', commission: 0, revenue: 83520, cancelRate: 0.151, leadTime: 8, property: 'All Properties', date: sampleDates[5] },
  { channel: 'Direct - Web', ratePlan: 'BAR', commission: 0, revenue: 325749, cancelRate: 0.132, leadTime: 45, property: 'P001', date: sampleDates[6] },
  { channel: 'Direct - Web', ratePlan: 'NonRefundable', commission: 0, revenue: 154215, cancelRate: 0.070, leadTime: 42, property: 'P002', date: sampleDates[7] },
  { channel: 'Expedia', ratePlan: 'BAR', commission: 17531, revenue: 92037, cancelRate: 0.219, leadTime: 15, property: 'P001', date: sampleDates[8] },
  { channel: 'Expedia', ratePlan: 'NonRefundable', commission: 10200, revenue: 53550, cancelRate: 0.140, leadTime: 18, property: 'P002', date: sampleDates[9] },
];

export const scatterData = [
  { name: 'Agoda', leadTime: 21, cancelRate: 0.22, revenue: 367329, color: '#ea580c' },
  { name: 'Booking.com', leadTime: 32, cancelRate: 0.18, revenue: 527495, color: '#2563eb' },
  { name: 'Expedia', leadTime: 15, cancelRate: 0.25, revenue: 140329, color: '#16a34a' },
  { name: 'Direct', leadTime: 45, cancelRate: 0.08, revenue: 587411, color: '#dc2626' },
  { name: 'Corporate', leadTime: 7, cancelRate: 0.12, revenue: 180000, color: '#0ea5e9' },
  { name: 'Wholesale', leadTime: 60, cancelRate: 0.05, revenue: 110000, color: '#c026d3' },
];

// For scatter plot matrix: Avg. Lead time (0–20), Cancellation Rate (0–20%), Lead time (0–40K)
export const scatterMatrixData = scatterData.map((d) => ({
  ...d,
  avgLeadTime: Math.min(20, d.leadTime / 3),
  cancelRatePct: Math.min(20, d.cancelRate * 100),
  leadTimeK: Math.min(40000, d.leadTime * 650),
}));

export const globalStats = {
  totalRevenue: 2245981,
  avgADR: 153.20,
  avgCancelRate: 0.1528,
  directShare: 0.3281,
  revPar: 57.29,
};

export type GlobalStatsShape = typeof globalStats;

export const globalStatsByProperty: Record<string, GlobalStatsShape> = {
  [PropertyFilter.ALL]: globalStats,
  [PropertyFilter.P001]: {
    totalRevenue: 1200000,
    avgADR: 158,
    avgCancelRate: 0.14,
    directShare: 0.35,
    revPar: 58.2,
  },
  [PropertyFilter.P002]: {
    totalRevenue: 1045981,
    avgADR: 148,
    avgCancelRate: 0.16,
    directShare: 0.31,
    revPar: 56.1,
  },
};

// Most Cancel Plan: heatmap data (Channel × Rate Plan → cancellation %)
export const RATE_PLAN_IDS = ['RP_BAR', 'RP_CORP', 'RP_NRF', 'RP_PKG'] as const;
export type RatePlanId = typeof RATE_PLAN_IDS[number];

export interface MostCancelPlanRow {
  channel: string;
  RP_BAR: number;
  RP_CORP: number;
  RP_NRF: number;
  RP_PKG: number;
}

const mostCancelPlanBase: MostCancelPlanRow[] = [
  { channel: 'Agoda', RP_BAR: 20.1, RP_CORP: 18.5, RP_NRF: 11.9, RP_PKG: 16.0 },
  { channel: 'Booking.com', RP_BAR: 19.8, RP_CORP: 17.5, RP_NRF: 13.1, RP_PKG: 21.1 },
  { channel: 'Corporate Contract', RP_BAR: 15.1, RP_CORP: 18.9, RP_NRF: 8.2, RP_PKG: 18.5 },
  { channel: 'Direct - Phone/Walk-in', RP_BAR: 12.3, RP_CORP: 11.4, RP_NRF: 6.2, RP_PKG: 9.5 },
  { channel: 'Direct - Website', RP_BAR: 13.2, RP_CORP: 13.4, RP_NRF: 7.0, RP_PKG: 16.3 },
  { channel: 'Expedia', RP_BAR: 21.9, RP_CORP: 14.5, RP_NRF: 14.0, RP_PKG: 23.4 },
  { channel: 'Wholesale/Tour Operator', RP_BAR: 12.0, RP_CORP: 16.7, RP_NRF: 9.1, RP_PKG: 12.7 },
];

export const mostCancelPlanData = mostCancelPlanBase;

/** Most Cancel Plan by property for Dashboard 2 filter. Slight variation per property. */
function shiftPct(row: MostCancelPlanRow, delta: number): MostCancelPlanRow {
  return {
    channel: row.channel,
    RP_BAR: Math.max(0, Math.min(24, row.RP_BAR + delta)),
    RP_CORP: Math.max(0, Math.min(24, row.RP_CORP + delta)),
    RP_NRF: Math.max(0, Math.min(24, row.RP_NRF + delta)),
    RP_PKG: Math.max(0, Math.min(24, row.RP_PKG + delta)),
  };
}
export const mostCancelPlanByProperty: Record<string, MostCancelPlanRow[]> = {
  [PropertyFilter.ALL]: mostCancelPlanBase,
  [PropertyFilter.P001]: mostCancelPlanBase.map((r) => shiftPct(r, -0.8)),
  [PropertyFilter.P002]: mostCancelPlanBase.map((r) => shiftPct(r, 0.6)),
};