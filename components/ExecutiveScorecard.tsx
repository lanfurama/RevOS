
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line
} from 'recharts';
import { globalStats, channelMixData, complexTrendData } from '../services/mockData';
import { PropertyFilter } from '../types';

// Custom Colors to match screenshot
const COLORS = {
  orange: '#f97316', // P002 / Revenue
  blue: '#1e40af',   // P001 / Commission
  text: '#4b5563',
  grid: '#e5e7eb'
};

const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

export const ExecutiveScorecard: React.FC<{ filter: PropertyFilter }> = () => {
  return (
    <div className="space-y-4">
      
      {/* HEADER & KPIs */}
      <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-200">
        <div className="text-center mb-4">
          <h1 className="text-lg font-bold text-[#8b5cf6] uppercase tracking-wide opacity-90" style={{fontFamily: 'serif'}}>
            Executive Scorecard
          </h1>
        </div>

        {/* Responsive KPI Grid: 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {/* KPI 1 */}
          <div className="p-2 md:p-0 bg-gray-50 md:bg-transparent rounded md:rounded-none">
            <div className="text-[10px] md:text-[11px] text-orange-500 font-bold mb-0.5">KPI1</div>
            <div className="text-[10px] md:text-[11px] font-bold text-orange-400 uppercase mb-1">NET REVENUE</div>
            <div className="text-base md:text-lg font-bold text-orange-500">{formatNumber(globalStats.totalRevenue)}</div>
          </div>
          {/* KPI 2 */}
          <div className="p-2 md:p-0 bg-gray-50 md:bg-transparent rounded md:rounded-none">
            <div className="text-[10px] md:text-[11px] text-yellow-600 font-bold mb-0.5">KPI 2</div>
            <div className="text-[10px] md:text-[11px] font-bold text-green-600 uppercase mb-1">RevPAR</div>
            <div className="text-base md:text-lg font-bold text-green-600">57.29</div>
          </div>
          {/* KPI 3 */}
          <div className="p-2 md:p-0 bg-gray-50 md:bg-transparent rounded md:rounded-none">
             <div className="text-[10px] md:text-[11px] text-teal-600 font-bold mb-0.5">KPI 3</div>
             <div className="text-[10px] md:text-[11px] font-bold text-blue-500 uppercase mb-1">Cancel Rate</div>
             <div className="text-base md:text-lg font-bold text-blue-600">{(globalStats.avgCancelRate * 100).toFixed(2)}%</div>
          </div>
          {/* KPI 4 */}
          <div className="p-2 md:p-0 bg-gray-50 md:bg-transparent rounded md:rounded-none">
             <div className="text-[10px] md:text-[11px] text-teal-600 font-bold mb-0.5">KPI 4</div>
             <div className="text-[10px] md:text-[11px] font-bold text-teal-400 uppercase mb-1">Direct Share</div>
             <div className="text-base md:text-lg font-bold text-teal-500">{(globalStats.directShare * 100).toFixed(2)}%</div>
          </div>
        </div>
      </div>

      {/* CHANNEL MIX - SPLIT CHARTS */}
      <div className="bg-white p-3 rounded-sm shadow-sm border border-gray-200">
        <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase">Channel Mix</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4">
          
          {/* Left: Net Revenue */}
          <div className="h-[200px] md:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={channelMixData} margin={{top: 0, right: 20, left: 30, bottom: 0}}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={COLORS.grid} />
                <XAxis type="number" fontSize={10} tickFormatter={(val) => `${val/1000}K`} />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10, fill: '#374151'}} />
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
          <div className="h-[200px] md:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={channelMixData} margin={{top: 0, right: 20, left: 10, bottom: 0}}>
                 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={COLORS.grid} />
                 <XAxis type="number" fontSize={10} tickFormatter={(val) => `${val/1000}K`} />
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
      <div className="bg-white p-3 rounded-sm shadow-sm border border-gray-200">
        <h3 className="text-sm font-bold text-orange-500 mb-2 uppercase">Revenue Trend</h3>
        
        {/* Chart 1: Net Revenue */}
        <div className="h-[100px] mb-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={complexTrendData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} label={{ value: 'Net Rev..', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#6b7280' }} tickFormatter={(val) => `${val/1000}K`} />
              <XAxis dataKey="date" hide />
              <Tooltip contentStyle={{fontSize: '11px', padding: '4px 8px'}} />
              <Line type="monotone" dataKey="revenueP001" stroke={COLORS.blue} strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="revenueP002" stroke={COLORS.orange} strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: RevPAR */}
        <div className="h-[100px] mb-1 border-t border-gray-100 pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={complexTrendData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} label={{ value: 'RevPAR', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#6b7280' }} domain={[0, 4]} />
              <XAxis dataKey="date" hide />
              <Tooltip contentStyle={{fontSize: '11px', padding: '4px 8px'}} />
              <Line type="monotone" dataKey="revParP001" stroke={COLORS.blue} strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="revParP002" stroke={COLORS.orange} strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: ADR */}
        <div className="h-[120px] border-t border-gray-100 pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={complexTrendData} margin={{ top: 5, right: 10, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} label={{ value: 'ADR', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#6b7280' }} domain={[0, 160]} />
              <XAxis dataKey="date" fontSize={10} tickLine={false} tick={{fill: '#6b7280'}} />
              <Tooltip contentStyle={{fontSize: '11px', padding: '4px 8px'}} />
              <Line type="monotone" dataKey="adrP001" stroke={COLORS.blue} strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="adrP002" stroke={COLORS.orange} strokeWidth={1.5} dot={false} />
              <Legend payload={[
                { value: 'P001', type: 'line', color: COLORS.blue },
                { value: 'P002', type: 'line', color: COLORS.orange }
              ]} wrapperStyle={{ fontSize: '10px', right: 0, bottom: 0 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-center text-[10px] font-semibold text-gray-500 mt-1">Week of Departure Date</div>
        </div>

      </div>
    </div>
  );
};
