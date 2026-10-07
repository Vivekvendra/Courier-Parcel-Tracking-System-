import React from 'react';
import {
  X,
  History,
  Clock,
  MapPin,
  User,
  Package,
  Calendar,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import Badge from '../common/Badge';

export const StatusHistoryModal = ({ isOpen, onClose, shipment }) => {
  if (!isOpen || !shipment) return null;

  const history = shipment.statusHistory || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6B00] flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Shipment Status Audit History</h3>
              <p className="text-xs text-slate-500 font-medium">
                Tracking Number: <span className="font-mono font-bold text-slate-800">{shipment.trackingNumber}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shipment Quick Summary Banner */}
        <div className="px-6 py-3 bg-slate-50/70 border-b border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Current Status</span>
            <div className="mt-0.5">
              <Badge status={shipment.deliveryStatus} size="sm" />
            </div>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Consignee</span>
            <span className="font-semibold text-slate-800 truncate block mt-0.5">{shipment.receiverName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Destination</span>
            <span className="font-semibold text-slate-800 truncate block mt-0.5">{shipment.deliveryAddress?.split(',').slice(-2).join(',') || shipment.deliveryAddress}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Total Events</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{history.length} logged states</span>
          </div>
        </div>

        {/* History Events List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No previous status transition logs found for this parcel.
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {history.map((item, index) => {
                const isLatest = index === history.length - 1;
                return (
                  <div key={item.id || index} className="relative group">
                    {/* Circle Bullet */}
                    <div
                      className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isLatest
                          ? 'border-[#FF6B00] bg-white text-[#FF6B00] ring-4 ring-orange-500/20'
                          : 'border-slate-300 bg-white text-slate-400'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${isLatest ? 'bg-[#FF6B00]' : 'bg-slate-400'}`} />
                    </div>

                    {/* Card Content */}
                    <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:border-slate-300 transition">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <Badge status={item.status} size="sm" />
                          {isLatest && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-[#FF6B00]">
                              Current State
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.timestamp}</span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 font-semibold mb-2">
                        {item.note || `Status transition: ${item.status}`}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                        {item.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                            <span>{item.location}</span>
                          </div>
                        )}
                        {item.updatedBy && (
                          <div className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>Logged by: <strong className="text-slate-700">{item.updatedBy}</strong></span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-semibold transition cursor-pointer"
          >
            Close History
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusHistoryModal;
