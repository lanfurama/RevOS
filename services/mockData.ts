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
export const channelMixData = [
  { name: 'Direct - Website', revenue: 681178, commission: 0, color: '#2563eb' }, // Blue
  { name: 'Booking.com', revenue: 539146, commission: 110427, color: '#ea580c' }, // Orange
  { name: 'Agoda', revenue: 380034, commission: 83422, color: '#f59e0b' },
  { name: 'Expedia', revenue: 140329, commission: 40317, color: '#ca8a04' },
  { name: 'Corporate Contract', revenue: 160000, commission: 0, color: '#dc2626' },
  { name: 'Direct - Phone/Walk-in', revenue: 120000, commission: 0, color: '#16a34a' },
].sort((a, b) => b.revenue - a.revenue);

// 2. Trend Data (Matches "Revenue Trend" screenshot with P001 vs P002 comparison lines)
export const complexTrendData = Array.from({ length: 20 }, (_, i) => {
  const date = new Date(2025, 6, 13 + (i * 7)); // Start July 13
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  // Random generation to look like curves
  const baseRev = 40000 + Math.sin(i / 3) * 20000;
  
  return {
    date: dateStr,
    // Net Revenue
    revenueP001: baseRev + Math.random() * 5000,
    revenueP002: baseRev * 0.7 + Math.random() * 5000,
    // RevPAR
    revParP001: 2 + Math.sin(i / 3) + Math.random() * 0.2,
    revParP002: 1.5 + Math.sin(i / 3) + Math.random() * 0.2,
    // ADR
    adrP001: 120 + Math.cos(i / 4) * 20 + Math.random() * 10,
    adrP002: 100 + Math.cos(i / 4) * 15 + Math.random() * 10,
  };
});

// 3. Top Problems Data (Matches the grid screenshot). leadTime = avg lead time (e.g. days) for scatter matrix.
export const topProblemsData = [
  { channel: 'Booking.com', ratePlan: 'Package', commission: 12621, revenue: 57495, cancelRate: 0.160, leadTime: 32 },
  { channel: 'Booking.com', ratePlan: 'BAR', commission: 46580, revenue: 227421, cancelRate: 0.198, leadTime: 32 },
  { channel: 'Booking.com', ratePlan: 'Corporate', commission: 16498, revenue: 80551, cancelRate: 0.175, leadTime: 30 },
  { channel: 'Booking.com', ratePlan: 'NonRefundable', commission: 27967, revenue: 136544, cancelRate: 0.131, leadTime: 28 },
  { channel: 'Corporate', ratePlan: 'Package', commission: 19382, revenue: 94630, cancelRate: 0.211, leadTime: 7 },
  { channel: 'Corporate', ratePlan: 'BAR', commission: 0, revenue: 83520, cancelRate: 0.151, leadTime: 8 },
  { channel: 'Direct - Web', ratePlan: 'BAR', commission: 0, revenue: 325749, cancelRate: 0.132, leadTime: 45 },
  { channel: 'Direct - Web', ratePlan: 'NonRefundable', commission: 0, revenue: 154215, cancelRate: 0.070, leadTime: 42 },
  { channel: 'Expedia', ratePlan: 'BAR', commission: 17531, revenue: 92037, cancelRate: 0.219, leadTime: 15 },
  { channel: 'Expedia', ratePlan: 'NonRefundable', commission: 10200, revenue: 53550, cancelRate: 0.140, leadTime: 18 },
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

export const mostCancelPlanData: MostCancelPlanRow[] = [
  { channel: 'Agoda', RP_BAR: 20.1, RP_CORP: 18.5, RP_NRF: 11.9, RP_PKG: 16.0 },
  { channel: 'Booking.com', RP_BAR: 19.8, RP_CORP: 17.5, RP_NRF: 13.1, RP_PKG: 21.1 },
  { channel: 'Corporate Contract', RP_BAR: 15.1, RP_CORP: 18.9, RP_NRF: 8.2, RP_PKG: 18.5 },
  { channel: 'Direct - Phone/Walk-in', RP_BAR: 12.3, RP_CORP: 11.4, RP_NRF: 6.2, RP_PKG: 9.5 },
  { channel: 'Direct - Website', RP_BAR: 13.2, RP_CORP: 13.4, RP_NRF: 7.0, RP_PKG: 16.3 },
  { channel: 'Expedia', RP_BAR: 21.9, RP_CORP: 14.5, RP_NRF: 14.0, RP_PKG: 23.4 },
  { channel: 'Wholesale/Tour Operator', RP_BAR: 12.0, RP_CORP: 16.7, RP_NRF: 9.1, RP_PKG: 12.7 },
];