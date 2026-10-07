import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Package,
  Truck,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Compass,
  ArrowRight,
  Layers,
  Copy,
  Printer,
  RotateCcw,
  User,
  ShieldCheck,
  Phone,
  Car,
  ChevronRight,
  History,
  Edit3,
  ExternalLink
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useShipments } from '../../context/ShipmentContext';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import StatusUpdateModal from '../../components/tracking/StatusUpdateModal';
import StatusHistoryModal from '../../components/tracking/StatusHistoryModal';
import {
  generateTimelineEvents,
  getShipmentCurrentLocation,
  getCourierAgentDetails,
  STATUS_CONFIG
} from '../../utils/trackingUtils';

export const TrackingPage = () => {
  const { shipments, loading, getShipment, getMultipleShipments } = useShipments();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Mode: 'single' | 'multiple'
  const [activeTab, setActiveTab] = useState('single');

  // Single Tracking State
  const [trackingInput, setTrackingInput] = useState('');
  const [currentTrackingNumber, setCurrentTrackingNumber] = useState('');

  // Multiple Tracking State
  const [multiInput, setMultiInput] = useState('');
  const [trackedNumbersList, setTrackedNumbersList] = useState([]);

  // Modals
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Initialize from URL query parameter or first shipment
  useEffect(() => {
    const urlNumber = searchParams.get('number');
    const urlMulti = searchParams.get('multi');

    if (urlMulti) {
      setActiveTab('multiple');
      const numbers = urlMulti.split(',').map((n) => n.trim()).filter(Boolean);
      setTrackedNumbersList(numbers);
      setMultiInput(numbers.join(', '));
    } else if (urlNumber) {
      setActiveTab('single');
      setTrackingInput(urlNumber);
      setCurrentTrackingNumber(urlNumber);
    } else if (shipments.length > 0 && !currentTrackingNumber) {
      // Default to first shipment
      const defaultNumber = shipments[0].trackingNumber;
      setTrackingInput(defaultNumber);
      setCurrentTrackingNumber(defaultNumber);
    }
  }, [searchParams, shipments]);

  // Current single shipment
  const activeShipment = useMemo(() => {
    if (!currentTrackingNumber) return null;
    return getShipment(currentTrackingNumber);
  }, [currentTrackingNumber, shipments, getShipment]);

  // Multiple shipments
  const multiShipments = useMemo(() => {
    if (trackedNumbersList.length === 0) return [];
    return getMultipleShipments(trackedNumbersList);
  }, [trackedNumbersList, shipments, getMultipleShipments]);

  // Handle single tracking search
  const handleSingleSearch = (e) => {
    e && e.preventDefault();
    const query = trackingInput.trim();
    if (!query) {
      toast.warning('Please enter a valid tracking number.');
      return;
    }
    setCurrentTrackingNumber(query);
    setSearchParams({ number: query });
  };

  // Handle multiple tracking search
  const handleMultiSearch = (e) => {
    e && e.preventDefault();
    if (!multiInput.trim()) {
      toast.warning('Please enter one or more tracking numbers separated by comma.');
      return;
    }
    const numbers = multiInput
      .split(/[\n,;\s]+/)
      .map((n) => n.trim())
      .filter(Boolean);

    setTrackedNumbersList(numbers);
    setSearchParams({ multi: numbers.join(',') });
  };

  // Quick select chip
  const handleSelectChip = (trackingNumber) => {
    setTrackingInput(trackingNumber);
    setCurrentTrackingNumber(trackingNumber);
    setSearchParams({ number: trackingNumber });
  };

  // Copy tracking number
  const handleCopyTracking = (number) => {
    navigator.clipboard.writeText(number);
    toast.success(`Copied tracking number: ${number}`);
  };

  // Print tracking summary
  const handlePrint = () => {
    window.print();
  };

  // Derived tracking data for single view
  const timelineEvents = useMemo(() => {
    if (!activeShipment) return [];
    return generateTimelineEvents(activeShipment);
  }, [activeShipment]);

  const currentLocation = useMemo(() => {
    if (!activeShipment) return null;
    return getShipmentCurrentLocation(activeShipment);
  }, [activeShipment]);

  const courierInfo = useMemo(() => {
    if (!activeShipment) return null;
    return getCourierAgentDetails(activeShipment);
  }, [activeShipment]);

  // ETA Calculation text
  const getEtaBadge = (status, date) => {
    if (status === 'Delivered') return { text: 'Delivered', bg: 'bg-emerald-100 text-emerald-800' };
    if (status === 'Cancelled') return { text: 'Cancelled', bg: 'bg-rose-100 text-rose-800' };
    if (status === 'Failed Delivery') return { text: 'Action Needed', bg: 'bg-red-100 text-red-800' };
    return { text: `Expected: ${date || 'In 2 days'}`, bg: 'bg-orange-100 text-[#FF6B00]' };
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-orange-100 text-[#FF6B00]">
              Module 5 & 6
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              Live Parcel Tracking & Timeline
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time multi-carrier tracking, GPS routing checkpoints, and delivery status audit.
          </p>
        </div>

        {/* Tab Switcher: Single vs Multi Tracking */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('single')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'single'
                ? 'bg-white text-[#FF6B00] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Single Tracking</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('multiple');
              if (trackedNumbersList.length === 0 && shipments.length > 0) {
                const initial3 = shipments.slice(0, 3).map((s) => s.trackingNumber);
                setTrackedNumbersList(initial3);
                setMultiInput(initial3.join(', '));
              }
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'multiple'
                ? 'bg-white text-[#FF6B00] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Track Multiple ({trackedNumbersList.length || 'Multi'})</span>
          </button>
        </div>
      </div>

      {/* ------------------- SINGLE TRACKING MODE ------------------- */}
      {activeTab === 'single' && (
        <>
          {/* Tracking Search Box Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs">
            <form onSubmit={handleSingleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="Enter Tracking Number (e.g. TRK-9821-BLR, TRK-9820-MUM)..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100 transition"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-[#FF6B00] hover:bg-[#EA580C] text-white text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Track Parcel</span>
              </button>
            </form>

            {/* Quick Suggestion Chips */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold">Active Parcels:</span>
              {shipments.slice(0, 6).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectChip(s.trackingNumber)}
                  className={`px-2.5 py-1 rounded-lg border font-mono transition cursor-pointer ${
                    currentTrackingNumber.toLowerCase() === s.trackingNumber.toLowerCase()
                      ? 'bg-orange-50 border-[#FF6B00] text-[#FF6B00] font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {s.trackingNumber} ({s.deliveryStatus})
                </button>
              ))}
            </div>
          </div>

          {/* If No Active Shipment Found */}
          {!activeShipment ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-xs">
              <EmptyState
                icon={Compass}
                title={`No tracking record found for "${currentTrackingNumber}"`}
                description="Please verify the tracking code or pick one of the available parcels above to review live progress."
                actionLabel="View First Available Shipment"
                onAction={() => {
                  if (shipments.length > 0) {
                    handleSelectChip(shipments[0].trackingNumber);
                  }
                }}
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Top Banner: Tracking Overview & Quick Action Toolbar */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#1E293B] rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5 mb-2">
                      <span className="font-mono text-base sm:text-lg font-bold tracking-wider text-orange-400">
                        {activeShipment.trackingNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyTracking(activeShipment.trackingNumber)}
                        className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition cursor-pointer"
                        title="Copy tracking code"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <Badge status={activeShipment.deliveryStatus} size="sm" />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                      <span>Shipped: <strong className="text-white">{activeShipment.shippingDate}</strong></span>
                      <span>•</span>
                      <span>Type: <strong className="text-white">{activeShipment.parcelType}</strong></span>
                      <span>•</span>
                      <span>Weight: <strong className="text-white">{activeShipment.parcelWeight}</strong></span>
                    </div>
                  </div>

                  {/* Actions & ETA */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-white/10 backdrop-blur-xs border border-white/15 px-4 py-2.5 rounded-xl text-left">
                      <span className="text-[11px] text-slate-300 block uppercase font-bold tracking-wider">
                        Estimated Delivery
                      </span>
                      <span className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#FF6B00]" />
                        {activeShipment.expectedDeliveryDate}
                      </span>
                    </div>

                    {/* Module 6 Action: Update Status Modal Button */}
                    <button
                      type="button"
                      onClick={() => setIsStatusModalOpen(true)}
                      className="px-4 py-2.5 bg-[#FF6B00] hover:bg-[#EA580C] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Update Status</span>
                    </button>

                    {/* View History Audit */}
                    <button
                      type="button"
                      onClick={() => setIsHistoryModalOpen(true)}
                      className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <History className="w-4 h-4" />
                      <span>Audit Logs ({activeShipment.statusHistory?.length || 1})</span>
                    </button>

                    {/* Print */}
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition cursor-pointer"
                      title="Print Tracking Summary"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtle Geometric Background */}
                <div className="absolute right-0 bottom-0 pointer-events-none opacity-10">
                  <Truck className="w-64 h-64 -mr-10 -mb-10 text-white" />
                </div>
              </div>

              {/* Grid: Live Location Map / Route Visualizer + Current Checkpoint */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 2 Cols: Interactive Stylized Route Visualizer */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF6B00] flex items-center justify-center">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-slate-900">
                            Live Route & Current Location
                          </h3>
                          <p className="text-xs text-slate-500">
                            Telemetry checkpoint & geographic route corridor
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                        GPS Active • 99.8% Accuracy
                      </span>
                    </div>

                    {/* Route Checkpoints Bar */}
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 mb-5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <span>Origin: {activeShipment.pickupAddress?.split(',').slice(-2).join(',') || 'Origin'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-right">
                          <span>Destination: {activeShipment.deliveryAddress?.split(',').slice(-2).join(',') || 'Destination'}</span>
                          <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
                        </div>
                      </div>

                      {/* Visual Transit Progress Bar */}
                      <div className="relative h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-700 ${
                            activeShipment.deliveryStatus === 'Delivered'
                              ? 'w-full bg-emerald-500'
                              : activeShipment.deliveryStatus === 'Out for Delivery'
                              ? 'w-[85%] bg-purple-500'
                              : activeShipment.deliveryStatus === 'In Transit'
                              ? 'w-[55%] bg-[#FF6B00]'
                              : activeShipment.deliveryStatus === 'Picked Up'
                              ? 'w-[30%] bg-cyan-500'
                              : 'w-[10%] bg-amber-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Stylized Vector Route Canvas */}
                    <div className="relative h-48 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-700/60 p-4 flex flex-col justify-between">
                      {/* Grid overlay */}
                      <div
                        className="absolute inset-0 opacity-15 pointer-events-none"
                        style={{
                          backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
                          backgroundSize: '20px 20px'
                        }}
                      />

                      {/* Header in map */}
                      <div className="relative z-10 flex items-center justify-between text-xs text-slate-300">
                        <span className="flex items-center gap-1.5 font-bold text-white">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          Live Tracking Radar
                        </span>
                        <span className="font-mono text-slate-400">
                          {currentLocation?.coordinates || '12.9716° N, 77.5946° E'}
                        </span>
                      </div>

                      {/* Center Map Hub Graphic */}
                      <div className="relative z-10 my-auto flex items-center justify-around">
                        {/* Origin Node */}
                        <div className="text-center">
                          <div className="w-9 h-9 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 mx-auto shadow-md">
                            <Package className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-200 block mt-1">Origin Facility</span>
                          <span className="text-[10px] text-slate-400">{activeShipment.pickupAddress?.split(',').slice(-1)[0]}</span>
                        </div>

                        {/* Animated Line Connector */}
                        <div className="flex-1 mx-4 relative flex items-center justify-center">
                          <div className="w-full h-0.5 border-t-2 border-dashed border-orange-400/60" />
                          <div className="absolute px-3 py-1 bg-orange-500 text-white rounded-full text-[10px] font-extrabold shadow-lg animate-bounce flex items-center gap-1">
                            <Truck className="w-3 h-3" />
                            <span>{activeShipment.deliveryStatus}</span>
                          </div>
                        </div>

                        {/* Destination Node */}
                        <div className="text-center">
                          <div className="w-9 h-9 rounded-full bg-[#FF6B00]/20 border-2 border-[#FF6B00] flex items-center justify-center text-orange-400 mx-auto shadow-md">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-200 block mt-1">Delivery Hub</span>
                          <span className="text-[10px] text-slate-400">{activeShipment.deliveryAddress?.split(',').slice(-1)[0]}</span>
                        </div>
                      </div>

                      {/* Map Footer Info */}
                      <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-700/80">
                        <span>Current Hub: <strong className="text-white">{currentLocation?.hub}</strong></span>
                        <span>Last GPS ping: <strong className="text-orange-300">{currentLocation?.lastScanned}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1 Col: Location & Courier Driver Card */}
                <div className="space-y-4">
                  {/* Current Location Card */}
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Current Parcel Location
                    </h4>

                    <div className="space-y-3">
                      <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-100">
                        <span className="text-[11px] text-slate-500 block">Facility Name</span>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                          {currentLocation?.hub}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 bg-slate-50 rounded-xl">
                          <span className="text-slate-400 block text-[10px]">City / State</span>
                          <span className="font-bold text-slate-800">{currentLocation?.city}</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-xl">
                          <span className="text-slate-400 block text-[10px]">Postal Code</span>
                          <span className="font-mono font-bold text-slate-800">{currentLocation?.pincode}</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-xl text-xs">
                        <span className="text-slate-400 block text-[10px]">Status Telemetry</span>
                        <span className="font-medium text-slate-700">{currentLocation?.statusText}</span>
                      </div>
                    </div>
                  </div>

                  {/* Assigned Courier Agent Card */}
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Assigned Courier Driver
                    </h4>

                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                        {courierInfo?.name?.split(' ').map((n) => n[0]).join('') || 'CA'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="text-sm font-bold text-slate-900 truncate">{courierInfo?.name}</h5>
                        <p className="text-xs text-[#FF6B00] font-semibold">{courierInfo?.badge}</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Car className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono text-[11px] font-semibold text-slate-800">{courierInfo?.vehicle}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium">{courierInfo?.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipment Timeline & Step Tracker (Module 5 Feature) */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#FF6B00]" />
                      <span>Shipment Milestones Timeline</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Chronological progress through national sorting network and final mile delivery.
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-[#FF6B00] self-start sm:self-auto">
                    Active State: {activeShipment.deliveryStatus}
                  </span>
                </div>

                {/* Timeline Stepper */}
                <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {timelineEvents.map((step, idx) => {
                    const isCompleted = step.completed;
                    const isCurrent = step.current;
                    const isFailed = step.isFailed;
                    const isCancelled = step.isCancelled;

                    return (
                      <div key={step.id || idx} className="relative group">
                        {/* Stepper Bullet */}
                        <div
                          className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                            isFailed
                              ? 'border-red-500 bg-red-50 text-red-600 ring-4 ring-red-500/20'
                              : isCancelled
                              ? 'border-rose-500 bg-rose-50 text-rose-600'
                              : isCurrent
                              ? 'border-[#FF6B00] bg-white text-[#FF6B00] ring-4 ring-orange-500/20'
                              : isCompleted
                              ? 'border-emerald-500 bg-emerald-500 text-white'
                              : 'border-slate-300 bg-white text-slate-300'
                          }`}
                        >
                          {isCompleted && !isCurrent ? (
                            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          ) : isFailed ? (
                            <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          ) : isCancelled ? (
                            <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          ) : (
                            <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-[#FF6B00] animate-ping' : 'bg-slate-300'}`} />
                          )}
                        </div>

                        {/* Step Card */}
                        <div
                          className={`p-4 rounded-xl border transition-all ${
                            isCurrent
                              ? 'bg-orange-50/40 border-orange-200 shadow-2xs'
                              : isCompleted
                              ? 'bg-white border-slate-200/90'
                              : 'bg-slate-50/60 border-slate-200/60 opacity-60'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                              {isCurrent && (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FF6B00] text-white">
                                  CURRENT STAGE
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-semibold text-slate-500 font-mono">
                              {step.date}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                            {step.description}
                          </p>

                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                            <span className="font-medium">{step.location}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Comprehensive Shipment Summary Card (Module 5 Feature) */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#FF6B00]" />
                    <span>Shipment Profile & Booking Summary</span>
                  </div>
                  <span className="text-xs font-normal text-slate-500">ID: {activeShipment.id}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  {/* Sender */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Sender / Shipper
                    </span>
                    <p className="text-sm font-bold text-slate-900">{activeShipment.senderName}</p>
                    <p className="text-slate-600 leading-snug">{activeShipment.pickupAddress}</p>
                    <div className="pt-2 text-slate-400 text-[11px]">
                      Dispatched on: <strong className="text-slate-700">{activeShipment.shippingDate}</strong>
                    </div>
                  </div>

                  {/* Recipient */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Recipient / Consignee
                    </span>
                    <p className="text-sm font-bold text-slate-900">{activeShipment.receiverName}</p>
                    <p className="text-slate-600 leading-snug">{activeShipment.deliveryAddress}</p>
                    <div className="pt-2 text-slate-400 text-[11px]">
                      Expected by: <strong className="text-slate-700">{activeShipment.expectedDeliveryDate}</strong>
                    </div>
                  </div>

                  {/* Parcel Details */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Cargo Specification
                    </span>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Package Type</span>
                      <strong className="text-slate-800">{activeShipment.parcelType}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Gross Weight</span>
                      <strong className="text-slate-800">{activeShipment.parcelWeight}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Service Level</span>
                      <strong className="text-[#FF6B00]">Priority Express</strong>
                    </div>
                  </div>

                  {/* Instructions & Security */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Handling Notes & Security
                    </span>
                    <p className="text-slate-700 font-medium italic">
                      "{activeShipment.notes || 'Handle with care. Standard courier assignment.'}"
                    </p>
                    <div className="pt-2 flex items-center gap-1.5 text-emerald-600 font-semibold text-[11px]">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Tamper-evident barcode secured</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ------------------- TRACK MULTIPLE SHIPMENTS (MULTI-TRACKING) ------------------- */}
      {activeTab === 'multiple' && (
        <div className="space-y-6">
          {/* Multi-Tracking Search Input Box */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#FF6B00]" />
              <span>Track Multiple Shipments Simultaneously</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter multiple tracking numbers separated by commas, spaces, or line breaks to view a consolidated status overview.
            </p>

            <form onSubmit={handleMultiSearch} className="space-y-3">
              <textarea
                rows={3}
                value={multiInput}
                onChange={(e) => setMultiInput(e.target.value)}
                placeholder="e.g. TRK-9821-BLR, TRK-9820-MUM, TRK-9819-DEL, TRK-9818-HYD"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100 transition resize-none"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Quick Add All Available */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 font-semibold">Quick Add:</span>
                  <button
                    type="button"
                    onClick={() => {
                      const all = shipments.map((s) => s.trackingNumber).join(', ');
                      setMultiInput(all);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                  >
                    Select All ({shipments.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const top4 = shipments.slice(0, 4).map((s) => s.trackingNumber).join(', ');
                      setMultiInput(top4);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#FF6B00] font-bold transition cursor-pointer"
                  >
                    First 4 Parcels
                  </button>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#FF6B00] hover:bg-[#EA580C] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Track {trackedNumbersList.length} Parcels</span>
                </button>
              </div>
            </form>
          </div>

          {/* Batch Status Metrics */}
          {multiShipments.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
                <span className="text-xs text-slate-400 font-medium">Total Tracked</span>
                <p className="text-xl font-black text-slate-900 mt-0.5">{multiShipments.length}</p>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
                <span className="text-xs text-blue-500 font-medium">In Transit</span>
                <p className="text-xl font-black text-blue-600 mt-0.5">
                  {multiShipments.filter((s) => s.deliveryStatus === 'In Transit').length}
                </p>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
                <span className="text-xs text-purple-500 font-medium">Out for Delivery</span>
                <p className="text-xl font-black text-purple-600 mt-0.5">
                  {multiShipments.filter((s) => s.deliveryStatus === 'Out for Delivery').length}
                </p>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
                <span className="text-xs text-emerald-500 font-medium">Delivered</span>
                <p className="text-xl font-black text-emerald-600 mt-0.5">
                  {multiShipments.filter((s) => s.deliveryStatus === 'Delivered').length}
                </p>
              </div>
            </div>
          )}

          {/* Comparative Multi-Tracking Cards Grid */}
          {multiShipments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-xs">
              <EmptyState
                icon={Layers}
                title="No Parcels Loaded for Batch Tracking"
                description="Enter one or more tracking numbers above or click 'Select All' to see simultaneous tracking progress."
                actionLabel="Load All Available Shipments"
                onAction={() => {
                  const all = shipments.map((s) => s.trackingNumber);
                  setTrackedNumbersList(all);
                  setMultiInput(all.join(', '));
                }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {multiShipments.map((s) => {
                const loc = getShipmentCurrentLocation(s);

                return (
                  <div
                    key={s.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Code & Status */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs sm:text-sm font-extrabold text-[#0F172A]">
                          {s.trackingNumber}
                        </span>
                        <Badge status={s.deliveryStatus} size="sm" />
                      </div>

                      {/* Route */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs mb-3 space-y-1">
                        <div className="flex items-center justify-between text-slate-700 font-bold">
                          <span>{s.senderName}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          <span>{s.receiverName}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 truncate">
                          <span className="truncate">{s.pickupAddress?.split(',').slice(-1)[0]}</span>
                          <span className="truncate text-right">{s.deliveryAddress?.split(',').slice(-1)[0]}</span>
                        </div>
                      </div>

                      {/* Location & ETA */}
                      <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#FF6B00] flex-shrink-0 mt-0.5" />
                          <span className="truncate text-[11px]">{loc.hub}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                          <span className="text-slate-400">Weight: <strong>{s.parcelWeight}</strong></span>
                          <span className="text-slate-700">ETA: <strong>{s.expectedDeliveryDate}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Action */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('single');
                        handleSelectChip(s.trackingNumber);
                      }}
                      className="w-full py-2 bg-slate-100 hover:bg-orange-50 hover:text-[#FF6B00] text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>View Full Timeline & GPS</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Module 6 Status Update Modal */}
      <StatusUpdateModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        shipment={activeShipment}
        onUpdated={() => {
          // Updates context automatically
        }}
      />

      {/* Audit History Modal */}
      <StatusHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        shipment={activeShipment}
      />
    </div>
  );
};

export default TrackingPage;
