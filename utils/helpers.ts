
import { TopProblem } from '../types';

export const formatCurrency = (val: number) => new Intl.NumberFormat('en-US').format(val);

const EXPECTED_HEADERS = ['channel', 'rate plan', 'commission', 'revenue', 'cancel rate'];

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, ' ');
}

function parseCancelRate(raw: string): number {
  const num = parseFloat(raw.trim());
  if (Number.isNaN(num)) return 0;
  // Accept both 0.16 and 16 (percent); if > 1 assume percent
  if (num > 1) return Math.min(1, num / 100);
  return Math.max(0, Math.min(1, num));
}

export const parseCSVString = (text: string): TopProblem[] => {
  const lines = text.trim().split('\n');
  if (lines.length < 2) throw new Error("CSV must have at least a header and one row.");

  const headerLine = lines[0];
  const headerParts = headerLine.split(',').map(normalizeHeader);
  const expected = EXPECTED_HEADERS.join(',');
  const got = headerParts.join(',');
  if (headerParts.length < 5) {
    throw new Error(`Invalid CSV header: expected columns like "${expected}". Got ${headerParts.length} columns.`);
  }
  const hasChannel = headerParts[0].includes('channel');
  const hasRate = headerParts[1].includes('rate') && headerParts[1].includes('plan');
  const hasCommission = headerParts[2].includes('commission');
  const hasRevenue = headerParts[3].includes('revenue');
  const hasCancel = headerParts[4].includes('cancel');
  if (!hasChannel || !hasRate || !hasCommission || !hasRevenue || !hasCancel) {
    throw new Error(`Invalid CSV header: expected "Channel, Rate Plan, Commission, Revenue, Cancel Rate" (order matters). Got: ${headerLine.slice(0, 80)}…`);
  }

  return lines.slice(1).map((line, index) => {
    if (!line.trim()) return null;
    const parts = line.split(',');
    if (parts.length < 5) throw new Error(`Line ${index + 2} is missing columns (need 5).`);
    return {
      channel: parts[0].trim(),
      ratePlan: parts[1].trim(),
      commission: parseFloat(parts[2]) || 0,
      revenue: parseFloat(parts[3]) || 0,
      cancelRate: parseCancelRate(parts[4]),
    };
  }).filter((item): item is TopProblem => item !== null);
};

export function exportToCSV(rows: TopProblem[]): string {
  const header = 'Channel,Rate Plan,Commission,Revenue,Cancel Rate';
  const body = rows.map((r) =>
    [r.channel, r.ratePlan, r.commission, r.revenue, (r.cancelRate * 100).toFixed(2)].join(',')
  ).join('\n');
  return header + '\n' + body;
}
