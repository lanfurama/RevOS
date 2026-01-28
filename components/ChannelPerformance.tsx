
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell
} from 'recharts';
import { channelMixData, scatterData } from '../services/mockData';
import { useData } from '../context/DataContext';
import { formatCurrency } from '../utils/helpers';

export const ChannelPerformance: React.FC = () => {
  const { topProblems } = useData();

  // Dynamic max calculation for bars to look relative to current data
  const maxRevenue = Math.max(...topProblems.map(d => d.revenue), 350000);
  const maxCommission = Math.max(...topProblems.map(d => d.commission), 50000);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* LEFT COLUMN: CHARTS */}
        <div className="space-y-4">
          
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

          {/* LeadTime vs Cancel Chart */}
          <div className="bg-white p-4 border border-gray-300 rounded shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">LeadTime vs Cancel</h3>
            <div className="h-[240px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                   <XAxis 
                      type="number" 
                      dataKey="cancelRate" 
                      name="Cancel Rate" 
                      unit="%" 
                      fontSize={11} 
                      tickLine={false}
                      axisLine={{stroke: '#e5e7eb'}}
                      tickFormatter={(v) => `${(v*100).toFixed(0)}%`} 
                      tick={{fill: '#6b7280'}}
                   />
                   <YAxis 
                      type="number" 
                      dataKey="leadTime" 
                      name="Lead Time" 
                      fontSize={11} 
                      tickLine={false}
                      axisLine={{stroke: '#e5e7eb'}}
                      tick={{fill: '#6b7280'}}
                      label={{ value: 'Avg. Lead Time', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#9ca3af', offset: 10 }} 
                   />
                   <ZAxis type="number" dataKey="revenue" range={[80, 500]} />
                   <Tooltip 
                     contentStyle={{fontSize: '11px', borderRadius: '4px', border: '1px solid #e5e7eb'}}
                     cursor={{ strokeDasharray: '3 3' }} 
                   />
                   <Scatter name="Channels" data={scatterData}>
                      {scatterData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} stroke="white" strokeWidth={2} />
                      ))}
                   </Scatter>
                 </ScatterChart>
               </ResponsiveContainer>
            </div>
             <div className="text-center text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Cancellation Rate</div>
          </div>
        </div>

        {/* RIGHT COLUMN: TOP PROBLEMS TABLE */}
        <div className="bg-white p-4 border border-gray-300 rounded shadow-sm flex flex-col h-full">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Top Problems</h3>
          
          <div className="overflow-auto flex-1">
            <table className="w-full border-collapse table-fixed">
              <thead>
                <tr className="text-gray-500 border-b border-gray-200 text-[11px] align-bottom leading-tight">
                  <th className="text-left font-medium pb-2 w-[22%] pl-1">Channel<br/>Name</th>
                  <th className="text-left font-medium pb-2 w-[18%]">Rate Plan</th>
                  <th className="text-right font-medium pb-2 w-[20%]">Commission<br/>A..</th>
                  <th className="text-right font-medium pb-2 w-[25%]">Net<br/>Revenue a..</th>
                  <th className="text-right font-medium pb-2 w-[15%] pr-1">Cancel<br/>Rate</th>
                </tr>
              </thead>
              <tbody className="text-[11px]">
                {topProblems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 italic">No data. Please import in Data Management.</td>
                  </tr>
                ) : (
                  topProblems.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 group">
                      <td className="py-2 pl-1 text-gray-700 truncate font-medium" title={row.channel}>{row.channel}</td>
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
    </div>
  );
};
