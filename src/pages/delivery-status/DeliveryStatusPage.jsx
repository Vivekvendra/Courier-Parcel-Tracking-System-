import React, { useState, useMemo } from 'react';
import {
  Truck,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  PackageCheck,
  Send,
  MapPin,
  History,
  Edit3,
  Kanban,
  Table as TableIcon,
  CheckSquare,
  Square,
  ArrowRight,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  Activity,
  Layers,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useShipments } from '../../context/ShipmentContext';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import StatusUpdateModal from '../../components/tracking/StatusUpdateModal';
import StatusHistoryModal from '../../components/tracking/StatusHistoryModal';
import {
  DELIVERY_STATUSES,
  STATUS_CONFIG,
  getShipmentCurrentLocation
} from '../../utils/trackingUtils';

export const DeliveryStatusPage = () => {
  const { shipments, loading, updateDeliveryStatus } = useShipments();
  const navigate = useNavigate();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Selected for status modal & history modal
  const [targetShipment, setTargetShipment] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState('In Transit');

  // Status Metrics Calculation
  const metrics = useMemo(() => {
    const total = shipments.length;
    const delivered = shipments.filter((s) => s.deliveryStatus === 'Delivered').length;
    const inTransit = shipments.filter((s) => s.deliveryStatus === 'In Transit').length;
    const outForDelivery = shipments.filter((s) => s.deliveryStatus === 'Out for Delivery').length;
    const pending = shipments.filter((s) => s.deliveryStatus === 'Pending').length;
    const pickedUp = shipments.filter((s) => s.deliveryStatus === 'Picked Up').length;
    const issues = shipments.filter((s) => ['Failed Delivery', 'Cancelled'].includes(s.deliveryStatus)).length;

    const successRate = total > 0 ? ((delivered / total) * 100).toFixed(1) : 0;

    return {
      total,
      delivered,
      inTransit,
      outForDelivery,
      pending,
      pickedUp,
      issues,
      successRate
    };
  }, [shipments]);

  // Counts per tab
  const statusCounts = useMemo(() => {
    const counts = { All: shipments.length };
    DELIVERY_STATUSES.forEach((st) => {
      counts[st] = shipments.filter((s) => s.deliveryStatus === st).length;
    });
    return counts;
  }, [shipments]);

  // Filtered shipments
  const filteredShipments = useMemo(() => {
    return shipments.filter((s) => {
      // Tab filter
      if (selectedStatusTab !== 'All' && s.deliveryStatus !== selectedStatusTab) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchTracking = s.trackingNumber?.toLowerCase().includes(query);
        const matchSender = s.senderName?.toLowerCase().includes(query);
        const matchReceiver = s.receiverName?.toLowerCase().includes(query);
        const matchAddress = s.deliveryAddress?.toLowerCase().includes(query);
        if (!matchTracking && !matchSender && !matchReceiver && !matchAddress) {
          return false;
        }
      }
      return true;
    });
  }, [shipments, selectedStatusTab, searchTerm]);

  // Paginated records for table view
  const paginatedShipments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredShipments.slice(start, start + itemsPerPage);
  }, [filteredShipments, currentPage]);

  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage) || 1;

  // Bulk Selection Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredShipments.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExecuteBulkUpdate = async () => {
    if (selectedIds.length === 0) return;
    try {
      for (const id of selectedIds) {
        await updateDeliveryStatus(id, bulkStatus, {
          note: `Bulk operation applied status update to ${bulkStatus}`,
          updatedBy: 'Operations Lead'
        });
      }
      toast.success(`Successfully updated ${selectedIds.length} parcels to "${bulkStatus}"`);
      setSelectedIds([]);
      setIsBulkModalOpen(false);
    } catch (err) {
      toast.error('Bulk update failed: ' + err.message);
    }
  };

  // Quick next status pipeline advance for Kanban
  const advanceStatus = async (shipment) => {
    const sequence = ['Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];
    const currentIdx = sequence.indexOf(shipment.deliveryStatus);
    if (currentIdx !== -1 && currentIdx < sequence.length - 1) {
      const nextStatus = sequence[currentIdx + 1];
      try {
        await updateDeliveryStatus(shipment.id, nextStatus, {
          note: `Pipeline transition from ${shipment.deliveryStatus} to ${nextStatus}`,
          updatedBy: 'Kanban Operations'
        });
        toast.success(`${shipment.trackingNumber} moved to "${nextStatus}"`);
      } catch (err) {
        toast.error('Failed to move status: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Operations & Lifecycle Flow</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Delivery Status Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Operational pipeline, lifecycle transitions, status history audit, and bulk dispatch management.
          </p>
        </div>

        {/* View Switcher: Table vs Kanban */}
        <div className="flex items-center p-1.5 bg-slate-100 rounded-2xl border border-slate-200 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-[#FF6B00] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-4 h-4" />
            <span>Table View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              viewMode === 'kanban'
                ? 'bg-white text-[#FF6B00] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Kanban className="w-4 h-4" />
            <span>Kanban Board</span>
          </button>
        </div>
      </div>

      {/* 6 Status Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Volume */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Volume</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{metrics.total}</p>
          <span className="text-[10px] text-slate-500 font-medium">All consignments</span>
        </div>

        {/* Pending */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs bg-amber-50/20">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Pending</span>
          <p className="text-2xl font-black text-amber-700 mt-1">{metrics.pending}</p>
          <span className="text-[10px] text-amber-600/90 font-medium">Awaiting pickup</span>
        </div>

        {/* In Transit */}
        <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-2xs bg-blue-50/20">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">In Transit</span>
          <p className="text-2xl font-black text-blue-700 mt-1">{metrics.inTransit}</p>
          <span className="text-[10px] text-blue-600/90 font-medium">En route hubs</span>
        </div>

        {/* Out for Delivery */}
        <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-2xs bg-purple-50/20">
          <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block">Out for Delivery</span>
          <p className="text-2xl font-black text-purple-700 mt-1">{metrics.outForDelivery}</p>
          <span className="text-[10px] text-purple-600/90 font-medium">Final mile van</span>
        </div>

        {/* Delivered */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs bg-emerald-50/20">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Delivered</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{metrics.delivered}</p>
          <span className="text-[10px] text-emerald-600 font-bold">{metrics.successRate}% rate</span>
        </div>

        {/* Exceptions */}
        <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-2xs bg-red-50/20">
          <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block">Exceptions</span>
          <p className="text-2xl font-black text-red-700 mt-1">{metrics.issues}</p>
          <span className="text-[10px] text-red-600/90 font-medium">Action needed</span>
        </div>
      </div>

      {/* Search, Status Tabs & Bulk Action Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-3.5">
        {/* Search Input & Bulk action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by tracking number, sender, receiver, destination..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#FF6B00] transition"
            />
          </div>

          {/* Bulk Update Trigger */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 p-1.5 bg-orange-50 border border-orange-200 rounded-xl text-xs">
              <span className="font-bold text-[#FF6B00] pl-2">
                {selectedIds.length} parcels selected
              </span>
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(true)}
                className="px-3 py-1.5 bg-[#FF6B00] hover:bg-[#EA580C] text-white font-bold rounded-lg transition cursor-pointer shadow-2xs"
              >
                Change Status
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="px-2.5 py-1 text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* 7 Status Filter Tabs with Counts */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => {
              setSelectedStatusTab('All');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
              selectedStatusTab === 'All'
                ? 'bg-[#0F172A] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>All Statuses</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedStatusTab === 'All' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {statusCounts['All']}
            </span>
          </button>

          {DELIVERY_STATUSES.map((status) => {
            const count = statusCounts[status] || 0;
            const isSelected = selectedStatusTab === status;
            const config = STATUS_CONFIG[status];

            return (
              <button
                key={status}
                type="button"
                onClick={() => {
                  setSelectedStatusTab(status);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 flex-shrink-0 border ${
                  isSelected
                    ? `${config.badgeClass} ring-2 ring-orange-500/30 shadow-2xs font-extrabold`
                    : 'bg-white border-slate-200/90 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
                <span>{status}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------- TABLE VIEW ------------------- */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          {filteredShipments.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={Truck}
                title="No shipments match the selected status filter"
                description="Try clearing your search query or selecting 'All Statuses' above."
                actionLabel="Show All Shipments"
                onAction={() => {
                  setSelectedStatusTab('All');
                  setSearchTerm('');
                }}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-4 px-4 w-10 text-center">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedIds.length === filteredShipments.length && filteredShipments.length > 0}
                        className="rounded border-slate-300 text-[#FF6B00] focus:ring-orange-200 cursor-pointer"
                      />
                    </th>
                    <th className="py-4 px-4">Tracking Code</th>
                    <th className="py-4 px-4">Consignor ➔ Consignee</th>
                    <th className="py-4 px-4">Delivery Status</th>
                    <th className="py-4 px-4">Current Location Hub</th>
                    <th className="py-4 px-4">Target ETA</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {paginatedShipments.map((s) => {
                    const loc = getShipmentCurrentLocation(s);
                    const isSelected = selectedIds.includes(s.id);

                    return (
                      <tr
                        key={s.id}
                        className={`hover:bg-orange-50/20 transition-colors ${
                          isSelected ? 'bg-orange-50/40' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-4 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(s.id)}
                            className="rounded border-slate-300 text-[#FF6B00] focus:ring-orange-200 cursor-pointer"
                          />
                        </td>

                        {/* Tracking # */}
                        <td className="py-4 px-4 font-mono font-bold text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="hover:text-[#FF6B00] cursor-pointer"
                              onClick={() => navigate(`/tracking?number=${s.trackingNumber}`)}
                            >
                              {s.trackingNumber}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-sans font-normal block">
                            {s.parcelType} • {s.parcelWeight} kg
                          </span>
                        </td>

                        {/* Sender -> Recipient */}
                        <td className="py-4 px-4">
                          <p className="font-bold text-slate-800">{s.receiverName}</p>
                          <span className="text-slate-400 text-[11px]">From: {s.senderName}</span>
                        </td>

                        {/* Color-coded Status Badge */}
                        <td className="py-4 px-4">
                          <Badge status={s.deliveryStatus} size="sm" />
                          {s.statusHistory && s.statusHistory.length > 1 && (
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {s.statusHistory.length} status events
                            </span>
                          )}
                        </td>

                        {/* Current Location */}
                        <td className="py-4 px-4 max-w-xs">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#FF6B00] flex-shrink-0" />
                            <span className="font-semibold text-slate-800 truncate">{loc.hub}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block pl-5 truncate">
                            {loc.city} ({loc.pincode})
                          </span>
                        </td>

                        {/* Expected Delivery Date */}
                        <td className="py-4 px-4">
                          <span className="font-bold text-slate-800 block">{s.expectedDeliveryDate}</span>
                          <span className="text-[10px] text-slate-400">Shipped: {s.shippingDate}</span>
                        </td>

                        {/* Action Buttons */}
                        <td className="py-4 px-4 text-right space-x-1.5 whitespace-nowrap">
                          {/* Quick Update Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setTargetShipment(s);
                              setIsUpdateModalOpen(true);
                            }}
                            className="px-3 py-1 bg-orange-50 hover:bg-orange-100 text-[#FF6B00] font-bold rounded-xl border border-orange-200/80 transition cursor-pointer inline-flex items-center gap-1 text-xs"
                            title="Update Status"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Update</span>
                          </button>

                          {/* View Status History Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setTargetShipment(s);
                              setIsHistoryModalOpen(true);
                            }}
                            className="px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-200 transition cursor-pointer inline-flex items-center gap-1 text-xs"
                            title="Status History Audit"
                          >
                            <History className="w-3.5 h-3.5 text-slate-500" />
                            <span>Audit</span>
                          </button>

                          {/* Track GPS link */}
                          <button
                            type="button"
                            onClick={() => navigate(`/tracking?number=${s.trackingNumber}`)}
                            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-800 rounded-xl transition cursor-pointer inline-flex items-center"
                            title="Open live tracking"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Pagination Footer */}
          {filteredShipments.length > 0 && (
            <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <span>
                Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
                <strong>{Math.min(currentPage * itemsPerPage, filteredShipments.length)}</strong> of{' '}
                <strong>{filteredShipments.length}</strong> shipments
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer flex items-center gap-1 font-semibold"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>
                <span className="px-3 font-bold text-slate-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer flex items-center gap-1 font-semibold"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------- KANBAN BOARD VIEW ------------------- */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
          {[
            { key: 'Pending', title: '1. Pending Dispatch', color: 'border-amber-300 bg-amber-50/20' },
            { key: 'Picked Up', title: '2. Picked Up', color: 'border-cyan-300 bg-cyan-50/20' },
            { key: 'In Transit', title: '3. In Transit (Hubs)', color: 'border-blue-300 bg-blue-50/20' },
            { key: 'Out for Delivery', title: '4. Out for Delivery', color: 'border-purple-300 bg-purple-50/20' },
            { key: 'Delivered', title: '5. Delivered (Closed)', color: 'border-emerald-300 bg-emerald-50/20' },
            { key: 'Failed Delivery', title: 'Exceptions / Failed', color: 'border-red-300 bg-red-50/20' }
          ].map((col) => {
            const colShipments = shipments.filter((s) => s.deliveryStatus === col.key);

            return (
              <div
                key={col.key}
                className={`rounded-3xl border ${col.color} p-4 flex flex-col max-h-[750px] shadow-2xs`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
                  <span className="font-extrabold text-xs text-slate-800">{col.title}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white shadow-2xs text-slate-700">
                    {colShipments.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                  {colShipments.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs italic">
                      No parcels in this status
                    </div>
                  ) : (
                    colShipments.map((s) => (
                      <div
                        key={s.id}
                        className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:border-orange-300 hover:shadow-md transition"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs font-bold text-slate-900">{s.trackingNumber}</span>
                          <Badge status={s.deliveryStatus} size="sm" />
                        </div>

                        <p className="text-xs font-bold text-slate-800 truncate mb-1">
                          {s.receiverName}
                        </p>
                        <span className="text-[11px] text-slate-500 block truncate mb-2">
                          {s.deliveryAddress}
                        </span>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                          <span>{s.parcelWeight} kg</span>
                          <span>ETA: {s.expectedDeliveryDate}</span>
                        </div>

                        {/* Kanban Actions */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setTargetShipment(s);
                              setIsUpdateModalOpen(true);
                            }}
                            className="text-xs font-bold text-[#FF6B00] hover:text-[#EA580C] cursor-pointer"
                          >
                            Edit Status
                          </button>

                          {col.key !== 'Delivered' && col.key !== 'Failed Delivery' && (
                            <button
                              type="button"
                              onClick={() => advanceStatus(s)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-[#FF6B00] text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                            >
                              <span>Advance</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bulk Status Update Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Bulk Status Update ({selectedIds.length} parcels)
            </h3>
            <p className="text-xs text-slate-500">
              Choose the new delivery status to apply to all selected parcels simultaneously.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                New Target Status
              </label>
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#FF6B00]"
              >
                {DELIVERY_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteBulkUpdate}
                className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
              >
                Apply to {selectedIds.length} Parcels
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Status Update Modal */}
      <StatusUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setTargetShipment(null);
        }}
        shipment={targetShipment}
      />

      {/* Reusable Status History Modal */}
      <StatusHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setTargetShipment(null);
        }}
        shipment={targetShipment}
      />
    </div>
  );
};

export default DeliveryStatusPage;
