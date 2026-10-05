import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const QuickActionCard = ({
  title,
  description,
  icon: Icon,
  badge,
  colorScheme = 'orange',
  onClick
}) => {
  const schemes = {
    orange: {
      border: 'hover:border-[#FF6B00]/50 hover:bg-orange-50/20',
      iconBg: 'bg-orange-100 text-[#FF6B00]',
      button: 'text-[#FF6B00] group-hover:bg-[#FF6B00] group-hover:text-white'
    },
    blue: {
      border: 'hover:border-blue-500/50 hover:bg-blue-50/20',
      iconBg: 'bg-blue-100 text-blue-600',
      button: 'text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
    },
    emerald: {
      border: 'hover:border-emerald-500/50 hover:bg-emerald-50/20',
      iconBg: 'bg-emerald-100 text-emerald-600',
      button: 'text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
    },
    purple: {
      border: 'hover:border-purple-500/50 hover:bg-purple-50/20',
      iconBg: 'bg-purple-100 text-purple-600',
      button: 'text-purple-600 group-hover:bg-purple-600 group-hover:text-white'
    }
  };

  const scheme = schemes[colorScheme] || schemes.orange;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm transition-all duration-200 cursor-pointer group flex flex-col justify-between ${scheme.border}`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${scheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
          {badge && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {badge}
            </span>
          )}
        </div>
        <h2 className="text-base font-bold text-[#0F172A] group-hover:text-[#FF6B00] transition-colors">
          {title}
        </h2>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
        <span>Perform Action</span>
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${scheme.button}`}
        >
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default QuickActionCard;
