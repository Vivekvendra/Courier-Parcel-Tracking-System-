import React from 'react';
import { Package, Clock, MapPin, CheckCircle, Truck, AlertTriangle, Copy } from 'lucide-react';
import Badge from './Badge';
import { toast } from 'react-toastify';

export const ActivityFeed = ({ activities = [], onTrackItem }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'DELIVERED':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'OUT_FOR_DELIVERY':
        return <Truck className="w-4 h-4 text-purple-600" />;
      case 'IN_TRANSIT':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return <Package className="w-4 h-4 text-[#FF6B00]" />;
    }
  };

  const copyToClipboard = (text, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${text} to clipboard!`);
  };

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <div
          key={activity.id || index}
          onClick={() => onTrackItem && onTrackItem(activity.trackingNumber)}
          className="p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50/80 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
              {getIcon(activity.type)}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-bold text-xs sm:text-sm text-[#0F172A] group-hover:text-[#FF6B00] transition-colors">
                  {activity.trackingNumber}
                </span>
                <button
                  type="button"
                  onClick={(e) => copyToClipboard(activity.trackingNumber, e)}
                  className="text-slate-400 hover:text-slate-600 transition"
                  title="Copy tracking number"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <Badge status={activity.status} size="sm" />
              </div>

              <p className="text-xs text-slate-600 mt-1 leading-normal">
                {activity.description}
              </p>

              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {activity.location}
                </span>
                <span>•</span>
                <span>To: <strong className="text-slate-600">{activity.recipient}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between text-right text-xs text-slate-400 flex-shrink-0">
            <span className="font-medium bg-slate-100 sm:bg-transparent px-2 sm:px-0 py-0.5 rounded text-slate-500 sm:text-slate-400">
              {activity.timestamp}
            </span>
            <span className="text-[11px] text-[#FF6B00] font-semibold opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
              Track parcel →
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
