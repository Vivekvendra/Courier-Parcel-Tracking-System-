import React from 'react';

export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="space-y-3 w-3/4">
        <div className="h-3 bg-slate-200 rounded w-1/2" />
        <div className="h-7 bg-slate-200 rounded w-2/3" />
        <div className="h-3 bg-slate-200 rounded w-1/3" />
      </div>
      <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
    </div>
  </div>
);

export const SkeletonRow = () => (
  <div className="p-4 rounded-xl border border-slate-100 bg-white animate-pulse flex items-center justify-between gap-4">
    <div className="flex items-center gap-3 w-full">
      <div className="w-9 h-9 bg-slate-200 rounded-xl" />
      <div className="space-y-2 flex-1">
        <div className="h-3.5 bg-slate-200 rounded w-1/4" />
        <div className="h-3 bg-slate-200 rounded w-3/4" />
      </div>
    </div>
    <div className="w-20 h-4 bg-slate-200 rounded" />
  </div>
);

export const SkeletonFeed = ({ count = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonRow key={i} />
    ))}
  </div>
);

export default SkeletonCard;
