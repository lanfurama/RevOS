
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell
} from 'recharts';
import { channelMixData, scatterData, mostCancelPlanData, RATE_PLAN_IDS } from '../services/mockData';
import { useData } from '../context/DataContext';
import { formatCurrency } from '../utils/helpers';
import { EmptyState } from './EmptyState';

// Heatmap: map cancel % (min~max) to background color (light tan → dark red)
const CANCEL_MIN = 6;
const CANCEL_MAX = 24;
function getHeatmapColor(pct: number): string {
  const t = Math.max(0, Math.min(1, (pct - CANCEL_MIN) / (CANCEL_MAX - CANCEL_MIN)));
  const r = Math.round(253 - t * 120);
  const g = Math.round(230 - t * 180);
  const b = Math.round(200 - t * 150);
  return `rgb(${r},${g},${b})`;
}

// Scatter Plot Matrix: 3×3 grid (Avg. Lead time, Cancellation Rate, Lead time)
const MATRIX_VARS = [
  { key: 'avgLeadTime', label: 'Avg. Lead time', domain: [0, 20] as [number, number], format: (v: number) => String(v) },
  { key: 'cancelRatePct', label: 'Cancellation Rate', domain: [0, 20] as [number, number], format: (v: number) => `${v.toFixed(2)}%` },
  { key: 'leadTimeK', label: 'Lead time', domain: [0, 40000] as [number, number], format: (v: number) => `${(v / 1000).toFixed(0)}K` },
] as const;

const CHANNEL_COLORS = ['#ea580c', '#2563eb', '#16a34a', '#dc2626', '#0ea5e9', '#c026d3', '#ca8a04', '#64748b'];

export interface MatrixRow {
  name: string;
  avgLeadTime: number;
  cancelRatePct: number;
  leadTimeK: number;
  color: string;
}

function buildMatrixFromTopProblems(topProblems: import('../types').TopProblem[]): MatrixRow[] {
  if (topProblems.length === 0) return [];
  const byChannel = new Map<string, { leadTimeSum: number; leadTimeCount: number; cancelSum: number; revenueSum: number; count: number }>();
  for (const row of topProblems) {
    const cur = byChannel.get(row.channel) ?? { leadTimeSum: 0, leadTimeCount: 0, cancelSum: 0, revenueSum: 0, count: 0 };
    cur.cancelSum += row.cancelRate;
    cur.revenueSum += row.revenue;
    cur.count += 1;
    if (row.leadTime != null) {
      cur.leadTimeSum += row.leadTime;
      cur.leadTimeCount += 1;
    }
    byChannel.set(row.channel, cur);
  }
  const channels = Array.from(byChannel.keys());
  return channels.map((channel, idx) => {
    const cur = byChannel.get(channel)!;
    const avgLeadTime = cur.leadTimeCount > 0 ? cur.leadTimeSum / cur.leadTimeCount : 0;
    const avgCancelRate = cur.cancelSum / cur.count;
    const leadTimeK = cur.leadTimeCount > 0
      ? Math.min(40000, avgLeadTime * 2000)
      : Math.min(40000, cur.revenueSum / 15);
    return {
      name: channel,
      avgLeadTime: Math.min(20, avgLeadTime),
      cancelRatePct: Math.min(20, avgCancelRate * 100),
      leadTimeK,
      color: CHANNEL_COLORS[idx % CHANNEL_COLORS.length],
    };
  });
}

function ScatterPlotMatrix({ data }: { data: MatrixRow[] }) {
  const margin = { top: 6, right: 6, bottom: 24, left: 40 };

  return (
    <div className="grid grid-cols-3 w-full" style={{ height: 528 }}>
      {MATRIX_VARS.map((yVar, i) =>
        MATRIX_VARS.map((xVar, j) => {
          const xKey = xVar.key as keyof MatrixRow;
          const yKey = yVar.key as keyof MatrixRow;
          return (
            <div key={`${i}-${j}`} className="w-full" style={{ height: 176 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={margin}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    type="number"
                    dataKey={xKey}
                    domain={xVar.domain}
                    tickCount={4}
                    fontSize={9}
                    tickLine={false}
                    axisLine={{ stroke: '#d1d5db' }}
                    tick={{ fill: '#374151' }}
                    tickFormatter={xVar.format}
                    label={i === 2 ? { value: xVar.label, position: 'bottom', fontSize: 9, fill: '#374151' } : undefined}
                  />
                  <YAxis
                    type="number"
                    dataKey={yKey}
                    domain={yVar.domain}
                    tickCount={4}
                    fontSize={9}
                    tickLine={false}
                    axisLine={{ stroke: '#d1d5db' }}
                    tick={{ fill: '#374151' }}
                    tickFormatter={yVar.format}
                    width={38}
                    label={j === 0 ? { value: yVar.label, angle: -90, position: 'insideLeft', fontSize: 9, fill: '#374151' } : undefined}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3', stroke: '#94a3b8' }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const p = payload[0].payload as MatrixRow;
                      return (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-left">
                          <div className="font-semibold text-gray-800 border-b border-gray-100 pb-1 mb-1">{p.name}</div>
                          <div className="text-xs text-gray-600 space-y-0.5">
                            <div>Avg. Lead time: <span className="font-medium text-gray-800">{p.avgLeadTime.toFixed(1)}</span></div>
                            <div>Cancellation Rate: <span className="font-medium text-gray-800">{p.cancelRatePct.toFixed(2)}%</span></div>
                            <div>Lead time: <span className="font-medium text-gray-800">{(p.leadTimeK / 1000).toFixed(1)}K</span></div>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={data} fill="white" strokeWidth={2}>
                    {data.map((entry, idx) => (
                      <Cell key={idx} fill="white" stroke={entry.color || '#64748b'} strokeWidth={2} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          );
        })
      )}
    </div>
  );
}

interface ChannelPerformanceProps {
  onNavigateToData?: () => void;
}

export const ChannelPerformance: React.FC<ChannelPerformanceProps> = ({ onNavigateToData }) => {
  const { topProblems } = useData();

  // Dynamic max calculation for bars to look relative to current data
  const maxRevenue = Math.max(...topProblems.map(d => d.revenue), 350000);
  const maxCommission = Math.max(...topProblems.map(d => d.commission), 50000);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-4">
        
        {/* LEFT COLUMN: CHARTS (30% wider for LeadTime vs Cancel) */}
        <div className="space-y-4 min-w-0">
          
          {/* Revenue vs Commission Chart */}
          <div className="bg-white p-4 border border-gray-300 rounded shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Revenue vs Commission</h3>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={channelMixData} margin={{ top: 0, right: 30, left: 10, bottom: 0 }} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={130} 
                    tick={{fontSize: 11, fill: '#374151', fontWeight: 500}} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{fontSize: '11px', borderRadius: '4px', border: '1px solid #e5e7eb', padding: '6px 10px'}}
                    formatter={(val: number) => formatCurrency(val)} 
                    cursor={{fill: '#f9fafb'}} 
                  />
                  <Bar dataKey="revenue" name="Room Revenue" fill="#1e40af" barSize={14} radius={[0, 2, 2, 0]} />
                  <Bar dataKey="commission" name="Commission" fill="#fbbf24" barSize={14} radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between px-10 mt-2 text-[10px] text-gray-500 font-medium tracking-wide uppercase">
               <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-800 rounded-sm"></div>Room Revenue</div>
               <div className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-400 rounded-sm"></div>Commission Amount</div>
            </div>
          </div>

          {/* LeadTime vs Cancel – Scatter Plot Matrix (3×3) from real data */}
          <div className="bg-white p-4 border border-gray-300 rounded shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">LeadTime vs Cancel</h3>
            <div className="h-[540px] w-full">
              {topProblems.length === 0 ? (
                <EmptyState
                  title="No data"
                  description="Import CSV in Data Management to see LeadTime vs Cancel here."
                  actionLabel="Go to Data Management"
                  onAction={onNavigateToData}
                />
              ) : (
                <ScatterPlotMatrix data={buildMatrixFromTopProblems(topProblems)} />
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TOP PROBLEMS TABLE */}
        <div className="bg-white p-4 border border-gray-300 rounded shadow-sm flex flex-col h-full">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Top Problems</h3>
          
          <div className="overflow-auto flex-1 -mx-1 px-1">
            <table className="w-full border-collapse table-fixed min-w-[380px]">
              <thead>
                <tr className="text-gray-500 border-b border-gray-200 text-[11px] align-bottom leading-tight">
                  <th className="text-left font-medium pb-2 w-[22%] pl-1 sticky left-0 z-10 bg-white shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]">Channel<br/>Name</th>
                  <th className="text-left font-medium pb-2 w-[18%]">Rate Plan</th>
                  <th className="text-right font-medium pb-2 w-[20%]">Commission<br/>A..</th>
                  <th className="text-right font-medium pb-2 w-[25%]">Net<br/>Revenue a..</th>
                  <th className="text-right font-medium pb-2 w-[15%] pr-1">Cancel<br/>Rate</th>
                </tr>
              </thead>
              <tbody className="text-[11px]">
                {topProblems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-0 align-top">
                      <EmptyState
                        title="No data"
                        description="Import CSV in Data Management to see Top Problems here."
                        actionLabel="Go to Data Management"
                        onAction={onNavigateToData}
                      />
                    </td>
                  </tr>
                ) : (
                  topProblems.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 group">
                      <td className="py-2 pl-1 text-gray-700 truncate font-medium sticky left-0 z-[1] bg-white group-hover:bg-gray-50" title={row.channel}>{row.channel}</td>
                      <td className="py-2 text-gray-500 truncate" title={row.ratePlan}>{row.ratePlan}</td>
                      
                      {/* Data Bar: Commission */}
                      <td className="py-1 text-right font-mono text-gray-700 relative">
                        <div className="absolute inset-y-1.5 left-2 right-0 bg-blue-100 rounded-sm" 
                             style={{width: `${Math.min((row.commission / maxCommission) * 100, 100)}%`, marginLeft: 'auto'}}></div>
                        <span className="relative z-10 pr-1">{row.commission > 0 ? formatCurrency(row.commission) : '0'}</span>
                      </td>

                      {/* Data Bar: Revenue */}
                      <td className="py-1 text-right font-mono text-gray-700 relative">
                         <div className="absolute inset-y-1.5 left-2 right-0 bg-orange-100 rounded-sm" 
                             style={{width: `${Math.min((row.revenue / maxRevenue) * 100, 100)}%`, marginLeft: 'auto'}}></div>
                        <span className="relative z-10 pr-1">{formatCurrency(row.revenue)}</span>
                      </td>

                      {/* Cancel Rate */}
                      <td className="py-2 text-right text-gray-600 font-medium pr-1">
                        {(row.cancelRate * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Most Cancel Plan – heatmap by Channel × Rate Plan */}
      <div className="bg-white p-4 border border-gray-300 rounded shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Most Cancel Plan</h3>
        <div className="overflow-x-auto -mx-1 px-1">
          <table className="w-full border-collapse min-w-[420px]">
            <thead>
              <tr className="text-gray-500 border-b border-gray-200 text-[11px]">
                <th className="text-left font-medium pb-2 pt-1 w-[28%] pl-1 sticky left-0 z-10 bg-white shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]">Channel Name</th>
                {RATE_PLAN_IDS.map((id) => (
                  <th key={id} className="text-center font-medium pb-2 pt-1 w-[18%]">{id}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[11px]">
              {mostCancelPlanData.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 group">
                  <td className="py-2 pl-1 text-gray-700 font-medium align-middle sticky left-0 z-[1] bg-white group-hover:bg-gray-50/50">{row.channel}</td>
                  {RATE_PLAN_IDS.map((planId) => {
                    const value = row[planId as keyof typeof row] as number;
                    const bg = getHeatmapColor(value);
                    return (
                      <td
                        key={planId}
                        className="py-2 text-center font-medium align-middle"
                        style={{ backgroundColor: bg }}
                        title={`${value}%`}
                      >
                        {value}%
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-500">
          <span>Low</span>
          <div className="flex-1 h-3 rounded overflow-hidden flex">
            {[6, 10, 14, 18, 24].map((pct) => (
              <div key={pct} className="flex-1" style={{ backgroundColor: getHeatmapColor(pct) }} title={`${pct}%`} />
            ))}
          </div>
          <span>High</span>
        </div>
      </div>
    </div>
  );
};
