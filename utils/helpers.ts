
import { TopProblem } from '../types';

export const formatCurrency = (val: number) => new Intl.NumberFormat('en-US').format(val);

export const parseCSVString = (text: string): TopProblem[] => {
  const lines = text.trim().split('\n');
  if (lines.length < 2) throw new Error("CSV must have at least a header and one row.");

  return lines.slice(1).map((line, index) => {
    // Handle potential empty lines at end of file
    if (!line.trim()) return null;
    
    const parts = line.split(',');
    if (parts.length < 5) throw new Error(`Line ${index + 2} is missing columns.`);
    
    return {
      channel: parts[0].trim(),
      ratePlan: parts[1].trim(),
      commission: parseFloat(parts[2]) || 0,
      revenue: parseFloat(parts[3]) || 0,
      cancelRate: parseFloat(parts[4]) || 0,
    };
  }).filter((item): item is TopProblem => item !== null);
};
