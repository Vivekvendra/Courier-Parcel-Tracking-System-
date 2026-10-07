import React, { useState, useEffect } from 'react';
import {
  X,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  PackageCheck,
  Send,
  MapPin,
  User,
  FileText
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useShipments } from '../../context/ShipmentContext';
import { useAuth } from '../../context/AuthContext';
import {
  DELIVERY_STATUSES,
  STATUS_CONFIG,
  STATUS_UPDATE_REASONS
} from '../../utils/trackingUtils';

export const StatusUpdateModal = ({ isOpen, onClose, shipment, onUpdated }) => {
  const { updateDeliveryStatus } = useShipments();
  const { currentUser } = useAuth();

  const [selectedStatus, setSelectedStatus] = useState('In Transit');
  const [location, setLocation] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [updatedBy, setUpdatedBy] = useState('Admin Manager');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (shipment) {
      setSelectedStatus(shipment.deliveryStatus || 'In Transit');
      setLocation(shipment.currentLocation?.hub || shipment.pickupAddress || '');
      setSelectedReason('');
      setCustomNote('');
      setUpdatedBy(currentUser?.name || 'Admin Manager');
    }
  }, [shipment, currentUser, isOpen]);

  if (!isOpen || !shipment) return null;

  const currentStatusConfig = STATUS_CONFIG[selectedStatus] || STATUS_CONFIG['In Transit'];
  const reasonPresets = STATUS_UPDATE_REASONS[selectedStatus] || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const finalNote = [selectedReason, customNote].filter(Boolean).join(' - ') || `Status updated to ${selectedStatus}`;
      const updated = await updateDeliveryStatus(shipment.id, selectedStatus, {
        location: location.trim(),
        note: finalNote,
        updatedBy: updatedBy.trim(),
        reason: selectedReason
      });

      toast.success(`Shipment ${shipment.trackingNumber} status updated to "${selectedStatus}"`);
      onUpdated && onUpdated(updated);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return CheckCircle;
      case 'Out for Delivery':
        return PackageCheck;
      case 'In Transit':
        return Truck;
      case 'Picked Up':
        return Send;
      case 'Pending':
        return Clock;
      case 'Failed Delivery':
        return AlertTriangle;
      case 'Cancelled':
        return XCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6B00] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Update Delivery Status</h3>
              <p className="text-xs text-slate-500 font-medium">
                Shipment: <span className="font-mono font-bold text-slate-800">{shipment.trackingNumber}</span>
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

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Current Shipment Overview */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block">Sender ➔ Recipient:</span>
              <span className="font-semibold text-slate-800">{shipment.senderName} ➔ {shipment.receiverName}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Current Status:</span>
              <span className="font-bold text-[#FF6B00]">{shipment.deliveryStatus}</span>
            </div>
          </div>

          {/* Select New Status (Color-coded grid) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select New Status <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DELIVERY_STATUSES.map((status) => {
                const IconComponent = getStatusIcon(status);
                const isSelected = selectedStatus === status;
                const config = STATUS_CONFIG[status];

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setSelectedStatus(status);
                      setSelectedReason('');
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? `${config.accentBg} ${config.cardBorder} ring-2 ring-orange-500/40 shadow-xs`
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? config.badgeClass : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className={`text-xs block font-bold truncate ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                        {status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Update */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Current Hub / Transit Location</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. South Regional Gateway Hub, Bengaluru"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100 transition"
              required
            />
          </div>

          {/* Quick Reason Presets */}
          {reasonPresets.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Quick Status Reason / Remark</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {reasonPresets.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setSelectedReason(reason === selectedReason ? '' : reason)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition cursor-pointer text-left ${
                      selectedReason === reason
                        ? 'bg-orange-100 border-[#FF6B00] text-[#FF6B00] font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Notes / Remarks */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Additional Dispatch Notes
            </label>
            <textarea
              rows={2}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Add any specific delivery remarks or consignee instructions..."
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100 transition resize-none"
            />
          </div>

          {/* Updated By */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Operator / Updated By</span>
            </label>
            <input
              type="text"
              value={updatedBy}
              onChange={(e) => setUpdatedBy(e.target.value)}
              placeholder="Operator name"
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100 transition"
              required
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#EA580C] text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 transition cursor-pointer flex items-center gap-2"
            >
              {isSubmitting ? 'Saving...' : 'Apply Status Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
