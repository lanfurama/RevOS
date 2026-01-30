
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line
} from 'recharts';
import { globalStatsByProperty, channelMixData, complexTrendData } from '../services/mockData';
import { PropertyFilter } from '../types';

export interface DateRangeFilter {
  from: string; // YYYY-MM-DD
  to: string;
}

// Custom Colors to match screenshot
const COLORS = {
  orange: '#f97316', // P002 / Revenue
  blue: '#1e40af',   // P001 / Commission
  text: '#4b5563',
  grid: '#e5e7eb'
};

const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

function filterTrendByDateRange(
  from: string,
  to: string
): typeof complexTrendData {
  return complexTrendData.filter(
    (row) => row.dateISO >= from && row.dateISO <= to
  );
}

function computeStatsFromTrend(
  filtered: typeof complexTrendData,
  filter: PropertyFilter
): { totalRevenue: number; revPar: number; avgCancelRate: number; directShare: number } {
  if (filtered.length === 0) {
    const fallback = globalStatsByProperty[filter] ?? globalStatsByProperty[PropertyFilter.ALL];
    return {
      totalRevenue: fallback.totalRevenue,
      revPar: fallback.revPar ?? 0,
      avgCancelRate: fallback.avgCancelRate,
      directShare: fallback.directShare,
    };
  }
  if (filter === PropertyFilter.P001) {
    const totalRevenue = filtered.reduce((s, r) => s + r.revenueP001, 0);
    const revPar = filtered.reduce((s, r) => s + r.revParP001, 0) / filtered.length;
    const avgCancelRate = filtered.reduce((s, r) => s + r.cancelRateP001, 0) / filtered.length;
    const directShare = filtered.reduce((s, r) => s + r.directShareP001, 0) / filtered.length;
    return { totalRevenue, revPar, avgCancelRate, directShare };
  }
  if (filter === PropertyFilter.P002) {
    const totalRevenue = filtered.reduce((s, r) => s + r.revenueP002, 0);
    const revPar = filtered.reduce((s, r) => s + r.revParP002, 0) / filtered.length;
    const avgCancelRate = filtered.reduce((s, r) => s + r.cancelRateP002, 0) / filtered.length;
    const directShare = filtered.reduce((s, r) => s + r.directShareP002, 0) / filtered.length;
    return { totalRevenue, revPar, avgCancelRate, directShare };
  }
  const totalRevenue = filtered.reduce((s, r) => s + r.revenueP001 + r.revenueP002, 0);
  const revPar =
    (filtered.reduce((s, r) => s + r.revParP001, 0) + filtered.reduce((s, r) => s + r.revParP002, 0)) /
    (filtered.length * 2);
  const avgCancelRate =
    (filtered.reduce((s, r) => s + r.cancelRateP001, 0) + filtered.reduce((s, r) => s + r.cancelRateP002, 0)) /
    (filtered.length * 2);
  const directShare =
    (filtered.reduce((s, r) => s + r.directShareP001, 0) + filtered.reduce((s, r) => s + r.directShareP002, 0)) /
    (filtered.length * 2);
  return { totalRevenue, revPar, avgCancelRate, directShare };
}

export const ExecutiveScorecard: React.FC<{
  filter: PropertyFilter;
  dateRange?: DateRangeFilter;
}> = ({ filter, dateRange }) => {
  const filteredTrend = dateRange
    ? filterTrendByDateRange(dateRange.from, dateRange.to)
    : complexTrendData;
  const statsFromRange =
    dateRange && filteredTrend.length > 0
      ? computeStatsFromTrend(filteredTrend, filter)
      : (globalStatsByProperty[filter] ?? globalStatsByProperty[PropertyFilter.ALL]);
  const stats = {
    ...statsFromRange,
    revPar: statsFromRange.revPar ?? (globalStatsByProperty[filter] ?? globalStatsByProperty[PropertyFilter.ALL]).revPar,
  };
  const showP001 = filter === PropertyFilter.ALL || filter === PropertyFilter.P001;
  const showP002 = filter === PropertyFilter.ALL || filter === PropertyFilter.P002;

  return (
    <div className="space-y-3 md:space-y-4">
      
      {/* HEADER & KPIs */}
      <div className="bg-white p-3 sm:p-4 rounded-sm shadow-sm border border-gray-200">
        <div className="text-center mb-3 md:mb-4">
          <h1 className="text-base sm:text-lg font-bold text-[#8b5cf6] uppercase tracking-wide opacity-90" style={{fontFamily: 'serif'}}>
            Executive Scorecard
          </h1>
        </div>

        {/* Responsive KPI Grid: 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 text-center">
          {/* KPI 1 */}
          <div className="p-2 md:p-0 bg-gray-50 md:bg-transparent rounded md:rounded-none min-h-[60px] sm:min-h-0 flex flex-col justify-center">
            <div className="text-[10px] md:text-[11px] text-orange-500 font-bold mb-0.5">KPI1</div>
            <div className="text-[10px] md:text-[11px] font-bold text-orange-400 uppercase mb-0.5 md:mb-1">NET REVENUE</div>
            <div className="text-sm sm:text-base md:text-lg font-bold text-orange-500 break-all">{formatNumber(stats.totalRevenue)}</div>
          </div>
          {/* KPI 2 */}
          <div className="p-2 md:p-0 bg-gray-50 md:bg-transparent rounded md:rounded-none min-h-[60px] sm:min-h-0 flex flex-col justify-center">
            <div className="text-[10px] md:text-[11px] text-yellow-600 font-bold mb-0.5">KPI 2</div>
            <div className="text-[10px] md:text-[11px] font-bold text-green-600 uppercase mb-0.5 md:mb-1">RevPAR</div>
            <div className="text-sm sm:text-base md:text-lg font-bold text-green-600">{stats.revPar?.toFixed(2) ?? '57.29'}</div>
          </div>
          {/* KPI 3 */}
          <div className="p-2 md:p-0 bg-gray-50 md:bg-transparent rounded md:rounded-none min-h-[60px] sm:min-h-0 flex flex-col justify-center">
             <div className="text-[10px] md:text-[11px] text-teal-600 font-bold mb-0.5">KPI 3</div>
             <div className="text-[10px] md:text-[11px] font-bold text-blue-500 uppercase mb-0.5 md:mb-1">Cancel Rate</div>
             <div className="text-sm sm:text-base md:text-lg font-bold text-blue-600">{(stats.avgCancelRate * 100).toFixed(2)}%</div>
          </div>
          {/* KPI 4 */}
          <div className="p-2 md:p-0 bg-gray-50 md:bg-transparent rounded md:rounded-none min-h-[60px] sm:min-h-0 flex flex-col justify-center">
             <div className="text-[10px] md:text-[11px] text-teal-600 font-bold mb-0.5">KPI 4</div>
             <div className="text-[10px] md:text-[11px] font-bold text-teal-400 uppercase mb-0.5 md:mb-1">Direct Share</div>
             <div className="text-sm sm:text-base md:text-lg font-bold text-teal-500">{(stats.directShare * 100).toFixed(2)}%</div>
          </div>
        </div>
      </div>

      {/* CHANNEL MIX - SPLIT CHARTS */}
      <div className="bg-white p-2 sm:p-3 rounded-sm shadow-sm border border-gray-200 overflow-hidden">
        <h3 className="text-xs sm:text-sm font-bold text-gray-700 mb-2 uppercase">Channel Mix</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4">
          
          {/* Left: Net Revenue */}
          <div className="h-[180px] sm:h-[200px] md:h-[250px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={channelMixData} margin={{top: 0, right: 12, left: 68, bottom: 0}}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={COLORS.grid} />
                <XAxis type="number" fontSize={9} tickFormatter={(val) => `${val/1000}K`} />
                <YAxis dataKey="name" type="category" width={64} tick={{fontSize: 9, fill: '#374151'}} />
                <Tooltip 
                  contentStyle={{fontSize: '11px', padding: '4px 8px'}}
                  formatter={(val: number) => formatNumber(val)} 
                />
                <Bar dataKey="revenue" fill={COLORS.orange} name="Net Revenue" barSize={16} />
                <Bar dataKey="revenue" fill={COLORS.blue} name="Other" barSize={16} className="opacity-80" /> 
              </BarChart>
            </ResponsiveContainer>
            <div className="text-center text-[10px] font-bold text-gray-600 mt-1">Net Revenue after Distribution</div>
          </div>

          {/* Right: Commission */}
          <div className="h-[180px] sm:h-[200px] md:h-[250px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={channelMixData} margin={{top: 0, right: 12, left: 0, bottom: 0}}>
                 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={COLORS.grid} />
                 <XAxis type="number" fontSize={9} tickFormatter={(val) => `${val/1000}K`} />
                 <YAxis dataKey="name" type="category" width={0} tick={false} />
                 <Tooltip 
                  contentStyle={{fontSize: '11px', padding: '4px 8px'}}
                  formatter={(val: number) => formatNumber(val)} 
                 />
                 <Bar dataKey="commission" fill={COLORS.blue} name="Commission Amount" barSize={16} />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-center text-[10px] font-bold text-gray-600 mt-1">Commission Amount</div>
          </div>
        </div>
      </div>

      {/* REVENUE TREND - 3 STACKED CHARTS */}
      <div className="bg-white p-2 sm:p-3 rounded-sm shadow-sm border border-gray-200 overflow-hidden">
        <h3 className="text-xs sm:text-sm font-bold text-orange-500 mb-2 uppercase">Revenue Trend</h3>
        
        {/* Chart 1: Net Revenue */}
        <div className="h-[90px] sm:h-[100px] mb-1 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredTrend} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} label={{ value: 'Net Rev..', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#6b7280' }} tickFormatter={(val) => `${val/1000}K`} />
              <XAxis dataKey="date" hide />
              <Tooltip contentStyle={{fontSize: '11px', padding: '4px 8px'}} />
              {showP001 && <Line type="monotone" dataKey="revenueP001" stroke={COLORS.blue} strokeWidth={1.5} dot={false} name="P001" />}
              {showP002 && <Line type="monotone" dataKey="revenueP002" stroke={COLORS.orange} strokeWidth={1.5} dot={false} name="P002" />}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: RevPAR */}
        <div className="h-[90px] sm:h-[100px] mb-1 border-t border-gray-100 pt-1 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredTrend} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} label={{ value: 'RevPAR', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#6b7280' }} domain={[0, 4]} />
              <XAxis dataKey="date" hide />
              <Tooltip contentStyle={{fontSize: '11px', padding: '4px 8px'}} />
              {showP001 && <Line type="monotone" dataKey="revParP001" stroke={COLORS.blue} strokeWidth={1.5} dot={false} name="P001" />}
              {showP002 && <Line type="monotone" dataKey="revParP002" stroke={COLORS.orange} strokeWidth={1.5} dot={false} name="P002" />}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: ADR */}
        <div className="h-[100px] sm:h-[120px] border-t border-gray-100 pt-1 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredTrend} margin={{ top: 5, right: 10, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} label={{ value: 'ADR', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#6b7280' }} domain={[0, 160]} />
              <XAxis dataKey="date" fontSize={10} tickLine={false} tick={{fill: '#6b7280'}} />
              <Tooltip contentStyle={{fontSize: '11px', padding: '4px 8px'}} />
              {showP001 && <Line type="monotone" dataKey="adrP001" stroke={COLORS.blue} strokeWidth={1.5} dot={false} name="P001" />}
              {showP002 && <Line type="monotone" dataKey="adrP002" stroke={COLORS.orange} strokeWidth={1.5} dot={false} name="P002" />}
              <Legend payload={[
                ...(showP001 ? [{ value: 'P001', type: 'line' as const, color: COLORS.blue }] : []),
                ...(showP002 ? [{ value: 'P002', type: 'line' as const, color: COLORS.orange }] : []),
              ]} wrapperStyle={{ fontSize: '10px', right: 0, bottom: 0 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-center text-[10px] font-semibold text-gray-500 mt-1">Week of Departure Date</div>
        </div>

      </div>
    </div>
  );
};
