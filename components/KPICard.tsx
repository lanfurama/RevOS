import React from 'react';

interface KPICardProps {
  title: string;
  subtitle: string;
  value: string | number;
  colorClass: string;
}

export const KPICard: React.FC<KPICardProps> = ({ title, subtitle, value, colorClass }) => {
  return (
    <div className="flex flex-col p-4 bg-white border border-gray-300 rounded shadow-sm h-full">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{subtitle}</h3>
        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded border border-gray-200 font-mono">
          {title}
        </span>
      </div>
      <div className="mt-auto">
        <div className={`text-2xl font-bold tracking-tight ${colorClass}`}>
          {value}
        </div>
        <div className="text-xs text-gray-400 mt-1 font-medium">vs last period</div>
      </div>
    </div>
  );
};