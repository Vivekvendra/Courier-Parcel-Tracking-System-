import React from 'react';

const statusConfig = {
  'Delivered': {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500'
  },
  'In Transit': {
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500 animate-pulse'
  },
  'Out for Delivery': {
    bg: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-500 animate-pulse'
  },
  'Picked Up': {
    bg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    dot: 'bg-cyan-500'
  },
  'Pending': {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500'
  },
  'Cancelled': {
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500'
  },
  'Failed Delivery': {
    bg: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500'
  }
};

export const Badge = ({ status = 'Pending', size = 'sm' }) => {
  const config = statusConfig[status] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400'
  };

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${config.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{status}</span>
    </span>
  );
};

export default Badge;
