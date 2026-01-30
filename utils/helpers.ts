
import { TopProblem } from '../types';

export const formatCurrency = (val: number) => new Intl.NumberFormat('en-US').format(val);

const EXPECTED_HEADERS = ['channel', 'rate plan', 'commission', 'revenue', 'cancel rate'];
const PROPERTY_NORMALIZE: Record<string, string> = {
  'p001': 'P001', 'p002': 'P002', 'all': 'All Properties', 'all properties': 'All Properties',
};
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
  const hasLeadTime = headerParts.length >= 6 && (headerParts[5]?.includes('lead') ?? false);
  const propertyIdx = headerParts.findIndex((h) => h.includes('property'));
  const dateIdx = headerParts.findIndex((h) => h === 'date' || h.includes('date'));

  return lines.slice(1).map((line, index) => {
    if (!line.trim()) return null;
    const parts = line.split(',');
    if (parts.length < 5) throw new Error(`Line ${index + 2} is missing columns (need 5).`);
    const row: TopProblem = {
      channel: parts[0].trim(),
      ratePlan: parts[1].trim(),
      commission: parseFloat(parts[2]) || 0,
      revenue: parseFloat(parts[3]) || 0,
      cancelRate: parseCancelRate(parts[4]),
    };
    if (hasLeadTime && parts[5] !== undefined && parts[5].trim() !== '') {
      const lt = parseFloat(parts[5].trim());
      row.leadTime = Number.isNaN(lt) ? 0 : Math.max(0, lt);
    }
    if (propertyIdx >= 0 && parts[propertyIdx] !== undefined) {
      const raw = parts[propertyIdx].trim().toLowerCase();
      row.property = PROPERTY_NORMALIZE[raw] ?? (raw ? raw : undefined);
    }
    if (dateIdx >= 0 && parts[dateIdx] !== undefined) {
      const d = parts[dateIdx].trim();
      if (d && /^\d{4}-\d{2}-\d{2}$/.test(d)) row.date = d;
    }
    return row;
  }).filter((item): item is TopProblem => item !== null);
};

export function exportToCSV(rows: TopProblem[]): string {
  const hasLeadTime = rows.some((r) => r.leadTime != null);
  const hasProperty = rows.some((r) => r.property != null);
  const hasDate = rows.some((r) => r.date != null);
  let header = 'Channel,Rate Plan,Commission,Revenue,Cancel Rate';
  if (hasLeadTime) header += ',Lead Time';
  if (hasProperty) header += ',Property';
  if (hasDate) header += ',Date';
  const body = rows.map((r) => {
    const base = [r.channel, r.ratePlan, r.commission, r.revenue, (r.cancelRate * 100).toFixed(2)];
    if (hasLeadTime) base.push(String(r.leadTime ?? ''));
    if (hasProperty) base.push(String(r.property ?? ''));
    if (hasDate) base.push(String(r.date ?? ''));
    return base.join(',');
  }).join('\n');
  return header + '\n' + body;
}
