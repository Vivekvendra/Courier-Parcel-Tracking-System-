import React, { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Eye,
  MoreHorizontal,
  ChevronDown,
  MapPin,
  Globe,
  Radio,
  Search,
  ExternalLink,
  Shield,
  Activity
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';

export const DashboardPage = (props) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const outletContext = useOutletContext() || {};
  const initialTrackQuery = props.initialTrackQuery || outletContext.searchTrackQuery;
  const onClearTrackQuery = props.onClearTrackQuery || outletContext.onClearTrackQuery;

  // State
  const [trendsMonth, setTrendsMonth] = useState('This Month');
  const [locationsMonth, setLocationsMonth] = useState('This Month');
  const [performanceMonth, setPerformanceMonth] = useState('This Month');
  const [mapZoom, setMapZoom] = useState(1);
  const [trackedShipment, setTrackedShipment] = useState(null);
  const [trackModalOpen, setTrackModalOpen] = useState(false);

  // Handle query from search
  useEffect(() => {
    if (initialTrackQuery) {
      handleOpenTracker(initialTrackQuery);
      onClearTrackQuery && onClearTrackQuery();
    }
  }, [initialTrackQuery]);

  const recentShipments = [
    {
      trackingNo: 'TRK-9821-BLR',
      customer: 'Ramesh Kumar',
      status: 'In Transit',
      date: '15 Sep 2026',
      location: 'Bengaluru',
      origin: 'Bengaluru Central Hub',
      destination: 'Hyderabad Hub',
      eta: 'Est. 2 days'
    },
    {
      trackingNo: 'TRK-7715-HYD',
      customer: 'Sneha Reddy',
      status: 'Delivered',
      date: '15 Sep 2026',
      location: 'Hyderabad',
      origin: 'Mumbai Hub',
      destination: 'Hitec City, Hyderabad',
      eta: 'Delivered'
    },
    {
      trackingNo: 'TRK-6620-DEL',
      customer: 'Arjun Mehta',
      status: 'Pending',
      date: '14 Sep 2026',
      location: 'Delhi',
      origin: 'Delhi Sorting Facility',
      destination: 'Connaught Place, Delhi',
      eta: 'Est. 3 days'
    },
    {
      trackingNo: 'TRK-5531-MUM',
      customer: 'Priya Sharma',
      status: 'In Transit',
      date: '14 Sep 2026',
      location: 'Mumbai',
      origin: 'Pune Depot',
      destination: 'Bandra, Mumbai',
      eta: 'Est. 1 day'
    }
  ];

  const topLocations = [
    { city: 'Bengaluru', count: 320, pct: '22%', color: 'bg-blue-500' },
    { city: 'Hyderabad', count: 280, pct: '19%', color: 'bg-[#FF6B00]' },
    { city: 'Delhi', count: 210, pct: '14%', color: 'bg-purple-500' },
    { city: 'Mumbai', count: 190, pct: '13%', color: 'bg-teal-500' },
    { city: 'Chennai', count: 150, pct: '10%', color: 'bg-rose-500' }
  ];

  const barChartData = [
    { month: 'Jan', total: 600, delivered: 420, inTransit: 180, pending: 80 },
    { month: 'Feb', total: 680, delivered: 460, inTransit: 220, pending: 95 },
    { month: 'Mar', total: 780, delivered: 550, inTransit: 290, pending: 110 },
    { month: 'Apr', total: 840, delivered: 610, inTransit: 310, pending: 120 },
    { month: 'May', total: 720, delivered: 520, inTransit: 260, pending: 90 },
    { month: 'Jun', total: 890, delivered: 640, inTransit: 320, pending: 140 },
    { month: 'Jul', total: 950, delivered: 710, inTransit: 342, pending: 116 }
  ];

  const handleOpenTracker = (trackingNo = 'TRK-9821-BLR') => {
    const found = recentShipments.find(
      (s) => s.trackingNo.toLowerCase() === trackingNo.toLowerCase()
    );
    if (found) {
      setTrackedShipment(found);
    } else {
      setTrackedShipment({
        trackingNo: trackingNo.toUpperCase(),
        customer: 'Valued Client',
        status: 'In Transit',
        date: '15 Sep 2026',
        location: 'Bengaluru',
        origin: 'Bengaluru Central Sorting Hub',
        destination: 'Destination Depot',
        eta: 'Est. 2 days'
      });
    }
    setTrackModalOpen(true);
  };

  const getStatusBadge = (status) => {
    if (status === 'Delivered') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Delivered
        </span>
      );
    }
    if (status === 'Pending') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          Pending
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        In Transit
      </span>
    );
  };

  return (
    <div className="space-y-5 pb-10">
      {/* 1. TOP HERO BANNER (Crisp clean background from login-bg.png, ZERO overlapping text) */}
      <div
        className="w-full rounded-2xl p-5 sm:p-6 lg:p-7 shadow-sm border border-slate-200/90 relative overflow-hidden bg-cover bg-right flex flex-col justify-between min-h-[148px]"
        style={{
          backgroundImage: "url('/clean-banner.jpg')"
        }}
      >
        {/* Soft white-to-transparent gradient on left so text is 100% crisp and readable with zero ghosting */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none" />

        {/* Top row of banner */}
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-orange-200 shadow-sm text-[11px] font-bold text-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>
              TrackEase Operations Suite • Live <span className="text-[#FF6B00]">Central Control</span>
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm text-xs font-bold text-slate-800">
            <Calendar className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>Mon, 15 Sep 2026</span>
          </div>
        </div>

        {/* Bottom row of banner: Crisp Headline & Subtitle */}
        <div className="relative z-10 mt-3 sm:mt-4 max-w-xl">
          <h1 className="text-xl sm:text-2xl lg:text-[26px] font-black tracking-tight text-[#0F172A] flex items-center gap-2">
            <span>Welcome back, {currentUser?.name || 'Admin Manager'}!</span>
            <span className="animate-bounce inline-block">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-snug">
            Real-time courier fleet intelligence, delivery performance, and shipment lifecycle management across India & beyond.
          </p>
        </div>
      </div>

      {/* 2. THE 4 METRIC STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: TOTAL SHIPMENTS */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div className="flex-1 ml-3">
              <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                TOTAL SHIPMENTS
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                  1,482
                </span>
                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  <TrendingUp className="w-3 h-3" />
                  +14.2%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Consolidated bookings
              </p>
            </div>
          </div>
          {/* Wave sparkline */}
          <div className="absolute -bottom-1 right-0 w-28 h-10 pointer-events-none opacity-80">
            <svg viewBox="0 0 100 35" className="w-full h-full" preserveAspectRatio="none">
              <path
                d="M0,25 Q20,10 40,22 T80,12 T100,28 L100,35 L0,35 Z"
                fill="rgba(59, 130, 246, 0.08)"
              />
              <path
                d="M0,25 Q20,10 40,22 T80,12 T100,28"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: IN TRANSIT PARCELS */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#FF6B00] flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div className="flex-1 ml-3">
              <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                IN TRANSIT PARCELS
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                  342
                </span>
                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  <TrendingUp className="w-3 h-3" />
                  +4.8%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                En route between hubs
              </p>
            </div>
          </div>
          {/* Wave sparkline */}
          <div className="absolute -bottom-1 right-0 w-28 h-10 pointer-events-none opacity-80">
            <svg viewBox="0 0 100 35" className="w-full h-full" preserveAspectRatio="none">
              <path
                d="M0,28 Q25,12 50,24 T85,15 T100,22 L100,35 L0,35 Z"
                fill="rgba(245, 158, 11, 0.08)"
              />
              <path
                d="M0,28 Q25,12 50,24 T85,15 T100,22"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: DELIVERED PARCELS */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1 ml-3">
              <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                DELIVERED PARCELS
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                  1,024
                </span>
                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  <TrendingUp className="w-3 h-3" />
                  +18.5%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Successfully handed over
              </p>
            </div>
          </div>
          {/* Wave sparkline */}
          <div className="absolute -bottom-1 right-0 w-28 h-10 pointer-events-none opacity-80">
            <svg viewBox="0 0 100 35" className="w-full h-full" preserveAspectRatio="none">
              <path
                d="M0,26 Q20,15 45,20 T80,10 T100,24 L100,35 L0,35 Z"
                fill="rgba(16, 185, 129, 0.08)"
              />
              <path
                d="M0,26 Q20,15 45,20 T80,10 T100,24"
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: PENDING DELIVERIES */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-1 ml-3">
              <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                PENDING DELIVERIES
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                  116
                </span>
                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md">
                  <TrendingDown className="w-3 h-3" />
                  -2.1%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Awaiting pickup/sorting
              </p>
            </div>
          </div>
          {/* Wave sparkline */}
          <div className="absolute -bottom-1 right-0 w-28 h-10 pointer-events-none opacity-80">
            <svg viewBox="0 0 100 35" className="w-full h-full" preserveAspectRatio="none">
              <path
                d="M0,20 Q30,26 55,14 T85,25 T100,22 L100,35 L0,35 Z"
                fill="rgba(244, 63, 94, 0.08)"
              />
              <path
                d="M0,20 Q30,26 55,14 T85,25 T100,22"
                fill="none"
                stroke="#F43F5E"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. MIDDLE ROW (Shipment Trends, Razor-Sharp Vector Map, Connected World) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* CARD 1: SHIPMENT TRENDS BAR CHART (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-sm font-bold text-[#0F172A]">Shipment Trends</h3>
              <button
                type="button"
                onClick={() => toast.info('Timeframe filter active: This Month')}
                className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1 hover:bg-slate-100 transition cursor-pointer"
              >
                <span>{trendsMonth}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            {/* Legend row */}
            <div className="flex flex-wrap items-center gap-3 pt-1 pb-3 text-[11px] font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                Total Shipments
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Delivered
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                In Transit
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                Pending
              </span>
            </div>
          </div>

          {/* Clustered Bar Chart Graphic */}
          <div className="mt-2 pt-2 border-t border-slate-100">
            <div className="flex items-end justify-between h-44 px-1 pb-2">
              {barChartData.map((d) => (
                <div key={d.month} className="flex flex-col items-center gap-1.5 flex-1 group cursor-pointer">
                  <div className="flex items-end gap-1 h-36">
                    <div
                      style={{ height: `${(d.total / 1000) * 100}%` }}
                      className="w-1.5 sm:w-2 bg-blue-600 rounded-t-sm transition-all group-hover:brightness-110"
                      title={`${d.month} Total: ${d.total}`}
                    />
                    <div
                      style={{ height: `${(d.delivered / 1000) * 100}%` }}
                      className="w-1.5 sm:w-2 bg-emerald-500 rounded-t-sm transition-all group-hover:brightness-110"
                      title={`${d.month} Delivered: ${d.delivered}`}
                    />
                    <div
                      style={{ height: `${(d.inTransit / 1000) * 100}%` }}
                      className="w-1.5 sm:w-2 bg-cyan-500 rounded-t-sm transition-all group-hover:brightness-110"
                      title={`${d.month} In Transit: ${d.inTransit}`}
                    />
                    <div
                      style={{ height: `${(d.pending / 1000) * 100}%` }}
                      className="w-1.5 sm:w-2 bg-[#FF6B00] rounded-t-sm transition-all group-hover:brightness-110"
                      title={`${d.month} Pending: ${d.pending}`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-800 transition-colors">
                    {d.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 2: RAZOR-SHARP VECTOR MAP (4 cols) - ZERO blur, ZERO baked-in text */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between pb-2 relative z-10">
            <h3 className="text-sm font-bold text-[#0F172A]">Live Shipments Map</h3>
            <button
              type="button"
              onClick={() => handleOpenTracker('TRK-9821-BLR')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
            >
              <span>View Full Map</span>
              <span className="text-[11px]">→</span>
            </button>
          </div>

          {/* Crisp SVG Vector Map Container (No blurred image) */}
          <div className="w-full h-48 rounded-xl relative overflow-hidden border border-slate-100 bg-gradient-to-b from-[#F0F7FF] via-[#E6F0FA] to-[#EDF4FC] flex items-center justify-center">
            {/* SVG Background Grid & Geographic Contours */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="mapGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#D1E2F4" strokeWidth="0.8" />
                </pattern>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF6B00" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>

              {/* Grid background */}
              <rect width="100%" height="100%" fill="url(#mapGrid)" />

              {/* Soft geographic land shape silhouette */}
              <path
                d="M 60,30 Q 130,10 220,35 Q 280,60 250,130 Q 210,180 150,175 Q 80,170 50,110 Z"
                fill="#DEEBF7"
                opacity="0.85"
              />

              {/* Transit Route Line */}
              <path
                d="M 90,135 Q 140,115 175,65"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="3.5"
                strokeDasharray="6,4"
              />

              {/* Origin Point: Bengaluru */}
              <circle cx="90" cy="135" r="7" fill="#FF6B00" />
              <circle cx="90" cy="135" r="14" fill="#FF6B00" opacity="0.25" className="animate-ping" />

              {/* Moving Vehicle Position */}
              <g transform="translate(130, 102)">
                <circle cx="0" cy="0" r="10" fill="#3B82F6" />
                <text x="0" y="3.5" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">🚚</text>
              </g>

              {/* Destination Point: Hyderabad */}
              <circle cx="175" cy="65" r="7" fill="#EF4444" />
              <circle cx="175" cy="65" r="13" fill="#EF4444" opacity="0.25" />
            </svg>

            {/* Crisp Floating Tooltip Card */}
            <div className="absolute top-2.5 right-3 bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-lg border border-slate-200/90 text-left z-10 max-w-[175px]">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-4 h-4 rounded bg-[#FF6B00] flex items-center justify-center text-white text-[9px] font-black">
                  📦
                </div>
                <span className="font-mono font-bold text-[11px] text-[#0F172A]">
                  TRK-9821-BLR
                </span>
              </div>
              <div className="inline-block px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-bold text-[9px] mb-1">
                In Transit
              </div>
              <p className="text-[10px] font-semibold text-slate-700 leading-tight">
                Bengaluru → Hyderabad
              </p>
              <p className="text-[9px] text-slate-400 mt-0.5 font-medium">Est. 2 days</p>
            </div>

            {/* Map Zoom Controls on Bottom Right */}
            <div className="absolute bottom-2 right-2 flex flex-col gap-1 z-10">
              <button
                type="button"
                onClick={() => setMapZoom((prev) => Math.min(prev + 0.2, 1.6))}
                className="w-6 h-6 rounded-md bg-white hover:bg-slate-50 border border-slate-200 shadow-sm text-slate-700 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setMapZoom((prev) => Math.max(prev - 0.2, 0.8))}
                className="w-6 h-6 rounded-md bg-white hover:bg-slate-50 border border-slate-200 shadow-sm text-slate-700 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                -
              </button>
            </div>
          </div>
        </div>

        {/* CARD 3: DELIVERING A CONNECTED WORLD (3 cols) - Ultra-crisp vector globe & dark blue theme */}
        <div className="lg:col-span-3 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-sm flex flex-col justify-between text-white relative overflow-hidden bg-gradient-to-br from-[#0B1528] via-[#0F1E36] to-[#0A1325] min-h-[190px]">
          {/* Crisp Background SVG Network Arcs & Globe (Zero blur) */}
          <svg className="absolute -right-4 -bottom-4 w-44 h-44 opacity-25 pointer-events-none" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#38BDF8" strokeWidth="1" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="#38BDF8" strokeWidth="0.8" />
            <path d="M 5,50 Q 50,20 95,50" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3,3" />
            <path d="M 5,50 Q 50,80 95,50" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx="35" cy="40" r="3" fill="#FF6B00" />
            <circle cx="65" cy="45" r="3" fill="#38BDF8" />
            <circle cx="50" cy="65" r="3" fill="#10B981" />
          </svg>

          {/* Top header & Icon */}
          <div className="relative z-10">
            <div className="w-8 h-8 rounded-lg bg-[#FF6B00] flex items-center justify-center text-white mb-2 shadow-sm">
              <Package className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black leading-tight text-white tracking-tight">
              Delivering a Connected World
            </h3>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              Real-time tracking across India & beyond.
            </p>
          </div>

          {/* Bottom 3 metrics matching the screenshot */}
          <div className="relative z-10 grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center">
            <div>
              <span className="block font-black text-xs sm:text-sm text-white">42+</span>
              <span className="text-[9px] text-slate-300 leading-tight block">Logistics Hubs</span>
            </div>
            <div>
              <span className="block font-black text-xs sm:text-sm text-white">24/7</span>
              <span className="text-[9px] text-slate-300 leading-tight block">Live Tracking</span>
            </div>
            <div>
              <span className="block font-black text-xs sm:text-sm text-white">99.9%</span>
              <span className="text-[9px] text-slate-300 leading-tight block">Uptime</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM ROW (Recent Shipments Table, Top Locations, Delivery Performance) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* CARD 1: RECENT SHIPMENTS TABLE (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0F172A]">Recent Shipments</h3>
              <button
                type="button"
                onClick={() => navigate('/shipments')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                View All →
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 font-bold text-[10px] uppercase border-b border-slate-100">
                    <th className="py-2.5 px-2">Tracking No</th>
                    <th className="py-2.5 px-2">Customer</th>
                    <th className="py-2.5 px-2">Status</th>
                    <th className="py-2.5 px-2">Date</th>
                    <th className="py-2.5 px-2">Location</th>
                    <th className="py-2.5 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentShipments.map((s) => (
                    <tr
                      key={s.trackingNo}
                      onClick={() => handleOpenTracker(s.trackingNo)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-2.5 px-2 font-mono font-bold text-slate-900 group-hover:text-[#FF6B00] whitespace-nowrap">
                        {s.trackingNo}
                      </td>
                      <td className="py-2.5 px-2 font-medium text-slate-700 whitespace-nowrap">
                        {s.customer}
                      </td>
                      <td className="py-2.5 px-2 whitespace-nowrap">
                        {getStatusBadge(s.status)}
                      </td>
                      <td className="py-2.5 px-2 text-slate-500 whitespace-nowrap text-[11px]">
                        {s.date}
                      </td>
                      <td className="py-2.5 px-2 text-slate-600 font-medium whitespace-nowrap">
                        {s.location}
                      </td>
                      <td className="py-2.5 px-2 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 text-slate-400 group-hover:text-slate-700">
                          <Eye className="w-3.5 h-3.5 hover:text-[#FF6B00]" />
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CARD 2: TOP DELIVERY LOCATIONS (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0F172A]">Top Delivery Locations</h3>
              <button
                type="button"
                className="px-2 py-0.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1 hover:bg-slate-100 transition cursor-pointer"
              >
                <span>{locationsMonth}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            {/* List with Progress Bars */}
            <div className="space-y-3 mt-3">
              {topLocations.map((loc) => (
                <div key={loc.city} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-[90px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-800">{loc.city}</span>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="flex-1 mx-3 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${loc.color}`}
                      style={{ width: `${(loc.count / 350) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-2 text-right min-w-[65px] justify-end">
                    <span className="font-bold text-slate-900">{loc.count}</span>
                    <span className="text-[11px] text-slate-400">{loc.pct}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 3: DELIVERY PERFORMANCE (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0F172A]">Delivery Performance</h3>
              <button
                type="button"
                className="px-2 py-0.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1 hover:bg-slate-100 transition cursor-pointer"
              >
                <span>{performanceMonth}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            {/* Donut Chart & Legend */}
            <div className="flex items-center justify-between gap-3 mt-3.5">
              <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="3.8"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#0EA5E9"
                    strokeDasharray="98.4, 100"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-black text-[#0F172A] leading-none">
                    98.4%
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400 mt-0.5 leading-none">
                    Success Rate
                  </span>
                </div>
              </div>

              {/* Legend with Counts */}
              <div className="space-y-1.5 flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Delivered
                  </span>
                  <span className="font-bold text-slate-900">1,024</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    In Transit
                  </span>
                  <span className="font-bold text-slate-900">342</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Pending
                  </span>
                  <span className="font-bold text-slate-900">116</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Returned
                  </span>
                  <span className="font-bold text-slate-900">24</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. INTERACTIVE LIVE TRACKING MODAL */}
      <Modal
        isOpen={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
        title="Live Parcel Tracking Telemetry"
        subtitle="GPS route inspection and delivery milestones"
        maxWidth="max-w-xl"
      >
        {trackedShipment && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Consignment ID
                </span>
                <p className="font-mono font-black text-lg text-[#0F172A]">
                  {trackedShipment.trackingNo}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Recipient: <strong className="text-slate-800">{trackedShipment.customer}</strong>
                </p>
              </div>
              <div>{getStatusBadge(trackedShipment.status)}</div>
            </div>

            {/* Timeline */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 pb-2 border-b border-slate-100">
                <span className="text-blue-600 flex items-center gap-1">
                  <Truck className="w-4 h-4 animate-bounce" />
                  <span>Current: {trackedShipment.status}</span>
                </span>
                <span className="text-slate-500 font-normal">
                  ETA: <strong className="text-slate-800">{trackedShipment.eta}</strong>
                </span>
              </div>

              {/* Progress Milestones */}
              <div className="relative py-2">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />
                <div className="absolute top-1/2 left-0 w-2/3 h-1 bg-[#FF6B00] -translate-y-1/2 z-0" />

                <div className="relative z-10 flex items-center justify-between text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-[#FF6B00] text-white flex items-center justify-center text-xs font-bold ring-4 ring-orange-100">
                      ✓
                    </div>
                    <span className="text-[10px] font-bold text-slate-800 mt-1">Picked Up</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-[#FF6B00] text-white flex items-center justify-center text-xs font-bold ring-4 ring-orange-100">
                      ✓
                    </div>
                    <span className="text-[10px] font-bold text-slate-800 mt-1">In Transit</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-blue-100 animate-pulse">
                      ●
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 mt-1">Out for Delivery</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold">
                      ○
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 mt-1">Delivered</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400">Origin:</span>
                  <p className="font-semibold text-slate-800">{trackedShipment.origin}</p>
                </div>
                <div>
                  <span className="text-slate-400">Destination:</span>
                  <p className="font-semibold text-slate-800">{trackedShipment.destination}</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between text-xs text-orange-900">
              <span className="font-semibold">Live GPS Telemetry Connected</span>
              <button
                type="button"
                onClick={() => toast.success(`Location pinged for ${trackedShipment.trackingNo}`)}
                className="font-bold text-[#FF6B00] hover:underline cursor-pointer"
              >
                Ping Driver
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setTrackModalOpen(false);
                navigate(`/tracking?number=${trackedShipment.trackingNo}`);
              }}
              className="w-full py-2.5 bg-[#FF6B00] hover:bg-[#EA580C] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <span>Open Full Tracking Radar & Audit</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DashboardPage;
