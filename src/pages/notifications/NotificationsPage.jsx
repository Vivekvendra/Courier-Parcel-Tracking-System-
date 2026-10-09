import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  CheckCircle,
  Truck,
  AlertTriangle,
  Package,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Clock,
  Sparkles,
  RotateCcw,
  PlusCircle,
  X,
  Send,
  Eye,
  MailCheck,
  Mail,
  Activity,
  Layers,
  CheckCircle2,
  AlertOctagon
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNotifications } from '../../context/NotificationContext';
import { useShipments } from '../../context/ShipmentContext';
import EmptyState from '../../components/common/EmptyState';

export const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    addNotification,
    resetNotifications
  } = useNotifications();

  const { shipments } = useShipments();
  const navigate = useNavigate();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, UNREAD, SHIPMENT_CREATED, STATUS_UPDATE, DELIVERY_COMPLETED, FAILED_ALERT
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);

  // Simulation Form State
  const [simType, setSimType] = useState('SHIPMENT_CREATED');
  const [simTracking, setSimTracking] = useState('TRK-9821-BLR');
  const [simTitle, setSimTitle] = useState('New Shipment Created');
  const [simMessage, setSimMessage] = useState('Express cargo registered and manifest shared with origin hub.');
  const [simSeverity, setSimSeverity] = useState('info');

  // Handle Preset Change in Simulation Modal
  const handleSimTypeChange = (type) => {
    setSimType(type);
    const sampleShipment = shipments[0] || { trackingNumber: 'TRK-9821-BLR', receiverName: 'Priya Sharma' };
    const trk = sampleShipment.trackingNumber;

    if (type === 'SHIPMENT_CREATED') {
      setSimTitle('Shipment Manifest Created');
      setSimMessage(`New priority cargo ${trk} registered for delivery to ${sampleShipment.receiverName || 'Consignee'}.`);
      setSimSeverity('info');
    } else if (type === 'STATUS_UPDATE') {
      setSimTitle('Delivery Status Updated');
      setSimMessage(`Shipment ${trk} departed regional distribution gateway, in transit to destination hub.`);
      setSimSeverity('info');
    } else if (type === 'DELIVERY_COMPLETED') {
      setSimTitle('Delivery Completed');
      setSimMessage(`Consignment ${trk} successfully delivered and recipient digital signature verified.`);
      setSimSeverity('success');
    } else if (type === 'FAILED_ALERT') {
      setSimTitle('Failed Delivery Alert');
      setSimMessage(`Delivery attempt failed for ${trk}. Consignee unavailable at address. Re-attempt queued.`);
      setSimSeverity('error');
    }
  };

  const handleCreateSimulatedNotification = (e) => {
    e.preventDefault();
    addNotification({
      type: simType,
      title: simTitle.trim(),
      message: simMessage.trim(),
      trackingNumber: simTracking.trim(),
      severity: simSeverity
    });
    toast.success(`Generated notification: "${simTitle}"`);
    setIsSimulateModalOpen(false);
  };

  // Tab definitions
  const tabs = [
    { key: 'ALL', label: 'All Notifications', count: notifications.length },
    { key: 'UNREAD', label: 'Unread', count: unreadCount, isAlert: unreadCount > 0 },
    { key: 'SHIPMENT_CREATED', label: 'Created', count: notifications.filter((n) => n.type === 'SHIPMENT_CREATED').length },
    { key: 'STATUS_UPDATE', label: 'Updates', count: notifications.filter((n) => n.type === 'STATUS_UPDATE').length },
    { key: 'DELIVERY_COMPLETED', label: 'Delivered', count: notifications.filter((n) => n.type === 'DELIVERY_COMPLETED').length },
    { key: 'FAILED_ALERT', label: 'Exceptions', count: notifications.filter((n) => n.type === 'FAILED_ALERT').length }
  ];

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Tab Filter
      if (activeTab === 'UNREAD' && item.read) return false;
      if (activeTab !== 'ALL' && activeTab !== 'UNREAD' && item.type !== activeTab) return false;

      // Search Filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(q);
        const matchMessage = item.message?.toLowerCase().includes(q);
        const matchTracking = item.trackingNumber?.toLowerCase().includes(q);
        if (!matchTitle && !matchMessage && !matchTracking) return false;
      }
      return true;
    });
  }, [notifications, activeTab, searchTerm]);

  // Icon and Style Helper per Notification Type
  const getTypeConfig = (item) => {
    switch (item.type) {
      case 'DELIVERY_COMPLETED':
        return {
          icon: CheckCircle2,
          badgeText: 'Delivered',
          badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          iconBg: 'bg-emerald-100 text-emerald-600',
          borderLeft: 'border-l-emerald-500'
        };
      case 'FAILED_ALERT':
        return {
          icon: AlertTriangle,
          badgeText: 'Failed Alert',
          badgeBg: 'bg-red-50 text-red-700 border-red-200',
          iconBg: 'bg-red-100 text-red-600',
          borderLeft: 'border-l-red-500'
        };
      case 'SHIPMENT_CREATED':
        return {
          icon: Package,
          badgeText: 'Manifest Created',
          badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
          iconBg: 'bg-amber-100 text-amber-600',
          borderLeft: 'border-l-amber-500'
        };
      case 'STATUS_UPDATE':
      default:
        return {
          icon: Truck,
          badgeText: 'Status Update',
          badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
          iconBg: 'bg-blue-100 text-blue-600',
          borderLeft: 'border-l-blue-500'
        };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-bold mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>Event Feeds & Automated Dispatch Alerts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time notifications, shipment lifecycle alerts, and exceptions monitoring.
          </p>
        </div>

        {/* Global Notification Actions */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => {
                markAllAsRead();
                toast.success('All notifications marked as read.');
              }}
              className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCheck className="w-4 h-4 text-[#FF6B00]" />
              <span>Mark All Read ({unreadCount})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsSimulateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#EA580C] text-white text-xs sm:text-sm font-bold transition shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Simulate Alert</span>
          </button>

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all notification records?')) {
                  clearAllNotifications();
                  toast.info('Notification list cleared.');
                }
              }}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
              title="Clear All Notifications"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Alerts</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{notifications.length}</p>
          <span className="text-[11px] text-slate-400">Lifetime logged events</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-orange-200 bg-orange-50/20 shadow-2xs">
          <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider block">Unread Alerts</span>
          <p className="text-2xl font-black text-[#FF6B00] mt-1">{unreadCount}</p>
          <span className="text-[11px] text-orange-600/80">Pending action</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">Delivered Notices</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {notifications.filter((n) => n.type === 'DELIVERY_COMPLETED').length}
          </p>
          <span className="text-[11px] text-emerald-600/80">Confirmed handovers</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-red-200 bg-red-50/20 shadow-2xs">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">Exceptions</span>
          <p className="text-2xl font-black text-red-700 mt-1">
            {notifications.filter((n) => n.type === 'FAILED_ALERT').length}
          </p>
          <span className="text-[11px] text-red-600/80">Requires customer contact</span>
        </div>
      </div>

      {/* Search and Filter Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-3.5">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notifications by tracking number, title, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#FF6B00] transition"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 flex-shrink-0 border ${
                  isSelected
                    ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-2xs'
                    : 'bg-white border-slate-200/90 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : tab.isAlert
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-2xs">
            <EmptyState
              icon={Bell}
              title={
                activeTab === 'UNREAD'
                  ? 'All Caught Up! No unread notifications.'
                  : 'No notifications found'
              }
              description={
                activeTab === 'UNREAD'
                  ? 'You have reviewed all recent alerts. New dispatches will appear here automatically.'
                  : 'Try adjusting your search criteria or switch back to "All Notifications".'
              }
              actionLabel={activeTab !== 'ALL' ? 'Show All Notifications' : 'Simulate Sample Alert'}
              onAction={() => {
                if (activeTab !== 'ALL') {
                  setActiveTab('ALL');
                  setSearchTerm('');
                } else {
                  setIsSimulateModalOpen(true);
                }
              }}
            />
          </div>
        ) : (
          filteredNotifications.map((item) => {
            const config = getTypeConfig(item);
            const IconComponent = config.icon;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !item.read
                    ? `bg-orange-50/20 border-orange-200 shadow-2xs border-l-4 ${config.borderLeft}`
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Left Area: Icon + Details */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {/* Icon */}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs ${config.iconBg}`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${config.badgeBg}`}>
                        {config.badgeText}
                      </span>

                      {item.trackingNumber && (
                        <button
                          type="button"
                          onClick={() => navigate(`/tracking?number=${item.trackingNumber}`)}
                          className="font-mono text-xs font-bold text-slate-800 hover:text-[#FF6B00] transition flex items-center gap-1 cursor-pointer"
                          title="Open in Live Tracking"
                        >
                          <span>{item.trackingNumber}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </button>
                      )}

                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" title="Unread" />
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {item.message}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.timestamp}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Area: Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-end">
                  {/* Mark as read/unread button */}
                  {item.read ? (
                    <button
                      type="button"
                      onClick={() => markAsUnread(item.id)}
                      className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                      title="Mark as unread"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => markAsRead(item.id)}
                      className="px-3 py-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-[#FF6B00] text-xs font-bold transition cursor-pointer inline-flex items-center gap-1"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Read</span>
                    </button>
                  )}

                  {/* Navigate to Tracking */}
                  {item.trackingNumber && (
                    <button
                      type="button"
                      onClick={() => navigate(`/tracking?number=${item.trackingNumber}`)}
                      className="p-1.5 rounded-xl hover:bg-orange-50 text-slate-400 hover:text-[#FF6B00] transition cursor-pointer"
                      title="Track Consignment"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}

                  {/* Delete Notification */}
                  <button
                    type="button"
                    onClick={() => deleteNotification(item.id)}
                    className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                    title="Delete Notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Simulation Modal */}
      {isSimulateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Simulate Operational Notification</h3>
                  <p className="text-xs text-slate-500">Trigger notification events to verify center and badge sync</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSimulateModalOpen(false)}
                className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSimulatedNotification} className="space-y-4">
              {/* Event Type selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Notification Event Trigger
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { key: 'SHIPMENT_CREATED', label: '1. Created' },
                    { key: 'STATUS_UPDATE', label: '2. Status Update' },
                    { key: 'DELIVERY_COMPLETED', label: '3. Delivered' },
                    { key: 'FAILED_ALERT', label: '4. Failed Alert' }
                  ].map((preset) => (
                    <button
                      key={preset.key}
                      type="button"
                      onClick={() => handleSimTypeChange(preset.key)}
                      className={`p-2.5 rounded-xl border text-left font-bold transition cursor-pointer ${
                        simType === preset.key
                          ? 'border-[#FF6B00] bg-orange-50 text-[#FF6B00] shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tracking Number Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Associated Tracking Number
                </label>
                <input
                  type="text"
                  value={simTracking}
                  onChange={(e) => setSimTracking(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-bold text-slate-800 focus:outline-none focus:border-[#FF6B00]"
                />
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alert Title</label>
                <input
                  type="text"
                  value={simTitle}
                  onChange={(e) => setSimTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#FF6B00]"
                />
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dispatch Message</label>
                <textarea
                  rows={2}
                  value={simMessage}
                  onChange={(e) => setSimMessage(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#FF6B00] resize-none"
                />
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSimulateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Generate Notification</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
