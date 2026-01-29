import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export function SkeletonKPI() {
  return (
    <div className="p-2 md:p-0 bg-gray-50 md:bg-transparent rounded md:rounded-none">
      <Skeleton className="h-3 w-12 mb-2" />
      <Skeleton className="h-3 w-20 mb-2" />
      <Skeleton className="h-6 w-24" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2 p-4">
      <div className="flex gap-4 pb-2 border-b border-gray-200">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {[1, 2, 3, 4, 5].map((j) => (
            <Skeleton key={j} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
