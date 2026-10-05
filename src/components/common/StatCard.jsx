import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  iconBg = 'bg-orange-50 text-[#FF6B00]',
  trend,
  trendType = 'up',
  progress,
  progressColor = 'bg-[#FF6B00]',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group ${
        onClick ? 'cursor-pointer hover:border-[#FF6B00]/40' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              {value}
            </span>
            {trend && (
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-md ${
                  trendType === 'up'
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-rose-700 bg-rose-50'
                }`}
              >
                {trendType === 'up' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {trend}
              </span>
            )}
          </div>
          {subtext && (
            <p className="text-xs text-slate-400 mt-1 font-medium">{subtext}</p>
          )}
        </div>

        {Icon && (
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${iconBg}`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {typeof progress === 'number' && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
            <span>Target Progress</span>
            <span className="font-bold text-slate-800">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
