
export interface PerformanceMetric {
  name: string;
  revenue: number; // Room revenue (VND)
  reservations: number;
  roomNights: number;
  alos: number; // Avg. length of stay
  adr: number;
  leadTime: number; // Avg. lead time
  cancelled: number; // Cancelled reservations
  cancelRate: number; // Calculated: cancelled / (reservations + cancelled)
}

export interface KPI {
  id: string;
  label: string;
  value: string | number;
  subValue?: string;
  color: string;
}

export enum PropertyFilter {
  ALL = 'All Properties',
  P001 = 'P001',
  P002 = 'P002'
}

export interface TopProblem {
  channel: string;
  ratePlan: string;
  commission: number;
  revenue: number;
  cancelRate: number;
  /** Optional: avg lead time (e.g. days). Used for LeadTime vs Cancel scatter matrix. */
  leadTime?: number;
}

export type DatasetType = 'ratePlan' | 'country' | 'roomType';
