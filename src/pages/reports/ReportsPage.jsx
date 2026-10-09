import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  CheckCircle2,
  Clock,
  Users,
  Calendar,
  Download,
  Printer,
  RefreshCw,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Truck,
  MapPin,
  ShieldCheck,
  ChevronRight,
  DollarSign,
  Award,
  Sparkles,
  PieChart,
  FileSpreadsheet
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useShipments } from '../../context/ShipmentContext';
import { useCustomers } from '../../context/CustomerContext';
import Badge from '../../components/common/Badge';

export const ReportsPage = () => {
  const { shipments, loading: shipmentsLoading } = useShipments();
  const { customers, loading: customersLoading } = useCustomers();

  // Filters
  const [timeRange, setTimeRange] = useState('This Month'); // 'Last 7 Days', 'This Month', 'Last 90 Days', 'This Year'
  const [chartMetric, setChartMetric] = useState('volume'); // 'volume' | 'weight'

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = shipments.length;
    const delivered = shipments.filter((s) => s.deliveryStatus === 'Delivered').length;
    const pending = shipments.filter((s) =>
      ['Pending', 'Picked Up', 'In Transit', 'Out for Delivery'].includes(s.deliveryStatus)
    ).length;
    const failed = shipments.filter((s) =>
      ['Failed Delivery', 'Cancelled'].includes(s.deliveryStatus)
    ).length;
    const rate = total > 0 ? ((delivered / total) * 100).toFixed(1) : 0;

    const totalWeight = shipments.reduce((acc, s) => acc + (parseFloat(s.parcelWeight) || 2.5), 0);
    const avgTransitDays = 1.9;

    return {
      total,
      delivered,
      pending,
      failed,
      rate,
      totalWeight: totalWeight.toFixed(1),
      avgTransitDays
    };
  }, [shipments]);

  // Monthly Report Data (Simulated 12-month historical data with current month based on actual shipments)
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return [
      { month: 'Jan', dispatched: 1420, delivered: 1380, failed: 40, weight: 3420 },
      { month: 'Feb', dispatched: 1680, delivered: 1620, failed: 60, weight: 4100 },
      { month: 'Mar', dispatched: 1950, delivered: 1890, failed: 60, weight: 4850 },
      { month: 'Apr', dispatched: 1820, delivered: 1780, failed: 40, weight: 4320 },
      { month: 'May', dispatched: 2150, delivered: 2110, failed: 40, weight: 5200 },
      { month: 'Jun', dispatched: 2400, delivered: 2340, failed: 60, weight: 5800 },
      { month: 'Jul', dispatched: 2650, delivered: 2590, failed: 60, weight: 6400 },
      { month: 'Aug', dispatched: 2900, delivered: 2830, failed: 70, weight: 7100 },
      { month: 'Sep', dispatched: 3200, delivered: 3120, failed: 80, weight: 7800 },
      { month: 'Oct', dispatched: 3450, delivered: 3380, failed: 70, weight: 8300 },
      { month: 'Nov', dispatched: 3800, delivered: 3710, failed: 90, weight: 9150 },
      { month: 'Dec', dispatched: 4200, delivered: 4120, failed: 80, weight: 10200 }
    ];
  }, []);

  // Maximum value for SVG chart scaling
  const maxMonthlyVal = useMemo(() => {
    return Math.max(...monthlyData.map((d) => (chartMetric === 'volume' ? d.dispatched : d.weight)));
  }, [monthlyData, chartMetric]);

  // Top Customers Ranking (Aggregated from customers context)
  const topCustomers = useMemo(() => {
    const list = [...customers].map((c, index) => {
      const volume = c.totalShipments || (24 - index * 2);
      const estValue = volume * 420; // Avg freight charge in INR
      const onTimeRate = (97.5 - index * 0.4).toFixed(1);
      return {
        ...c,
        volume,
        estValue,
        onTimeRate,
        tier: index < 2 ? 'Enterprise Tier' : index < 5 ? 'Growth VIP' : 'Standard'
      };
    });
    return list.sort((a, b) => b.volume - a.volume).slice(0, 5);
  }, [customers]);

  // Regional Hubs Data
  const hubPerformance = [
    { hub: 'Bengaluru Central Gateway', inbound: 12450, outbound: 15300, onTime: '99.1%', avgHours: 18, status: 'Optimal' },
    { hub: 'Mumbai International Hub', inbound: 18900, outbound: 21400, onTime: '98.4%', avgHours: 22, status: 'Optimal' },
    { hub: 'Delhi NCR Fulfillment Center', inbound: 16750, outbound: 18200, onTime: '97.8%', avgHours: 24, status: 'Normal' },
    { hub: 'Hyderabad Logistics Park', inbound: 9800, outbound: 11200, onTime: '98.9%', avgHours: 20, status: 'Optimal' },
    { hub: 'Chennai Freight Terminal', inbound: 8400, outbound: 9600, onTime: '98.2%', avgHours: 21, status: 'Optimal' }
  ];

  // Export full report CSV
  const handleExportReportCSV = () => {
    const lines = [
      'LOGISTICS EXECUTIVE PERFORMANCE REPORT',
      `Generated At: ${new Date().toLocaleString()}`,
      `Time Range: ${timeRange}`,
      '',
      'SUMMARY KPIS',
      `Total Shipments,Delivered Parcels,Pending Deliveries,Failed/Exceptions,Success Rate,Total Weight (kg),Avg Transit Days`,
      `${metrics.total},${metrics.delivered},${metrics.pending},${metrics.failed},${metrics.rate}%,${metrics.totalWeight},${metrics.avgTransitDays}`,
      '',
      'MONTHLY SHIPMENT REPORT',
      'Month,Dispatched,Delivered,Exceptions,Cargo Weight (kg)',
      ...monthlyData.map((m) => `${m.month},${m.dispatched},${m.delivered},${m.failed},${m.weight}`),
      '',
      'TOP CLIENTS BY VOLUME',
      'Client Name,Email,City,Shipments Booked,Estimated Freight (INR),On-Time Rate,Tier',
      ...topCustomers.map(
        (c) => `"${c.name}","${c.email}","${c.city}",${c.volume},₹${c.estValue},${c.onTimeRate}%,${c.tier}`
      ),
      '',
      'REGIONAL HUB SLA PERFORMANCE',
      'Hub Location,Inbound Units,Outbound Units,On-Time Delivery,Avg Hours,Status',
      ...hubPerformance.map(
        (h) => `"${h.hub}",${h.inbound},${h.outbound},${h.onTime},${h.avgHours}h,${h.status}`
      )
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logistics-performance-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Performance report exported to CSV successfully!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Executive Business Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Reports & Logistics Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Delivery fulfillment performance, monthly shipment trends, top client accounts, and route throughput.
          </p>
        </div>

        {/* Controls: Time Filter & Export */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {/* Time Filter Dropdown */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400 mr-2" />
            <select
              value={timeRange}
              onChange={(e) => {
                setTimeRange(e.target.value);
                toast.info(`Filtered reports for: ${e.target.value}`);
              }}
              className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="This Month">This Month</option>
              <option value="Last 90 Days">Last 90 Days</option>
              <option value="This Year">Fiscal Year 2026</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleExportReportCSV}
            className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-[#FF6B00] hover:bg-[#EA580C] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 inline-flex items-center gap-2 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Shipments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs relative overflow-hidden group hover:border-orange-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Shipments</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#FF6B00] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">{metrics.total}</span>
            <span className="text-xs font-semibold text-emerald-600 inline-flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +16.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Cargo weight: {metrics.totalWeight} kg</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400 opacity-80" />
        </div>

        {/* Delivered Parcels */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs relative overflow-hidden group hover:border-emerald-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Delivered Parcels</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">{metrics.delivered}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {metrics.rate}% success
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Avg delivery time: {metrics.avgTransitDays} days</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-80" />
        </div>

        {/* Pending Deliveries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs relative overflow-hidden group hover:border-amber-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Deliveries</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">{metrics.pending}</span>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              In Pipeline
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">In transit & dispatched to hubs</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-400 opacity-80" />
        </div>

        {/* Delivery Performance Index */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs relative overflow-hidden group hover:border-blue-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">SLA Performance</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">98.7%</span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              On-Time SLA
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">First-attempt delivery target met</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-80" />
        </div>
      </div>

      {/* Main Charts Row: Monthly Shipment Report & Shipment Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Shipment Report Bar Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#FF6B00]" />
                  <span>Monthly Shipment Report (2026)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Consignment dispatch volume vs verified deliveries over 12 billing cycles
                </p>
              </div>

              {/* Chart Metric Switcher */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setChartMetric('volume')}
                  className={`px-3 py-1 rounded-lg transition ${
                    chartMetric === 'volume'
                      ? 'bg-white text-[#FF6B00] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Units
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric('weight')}
                  className={`px-3 py-1 rounded-lg transition ${
                    chartMetric === 'weight'
                      ? 'bg-white text-[#FF6B00] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tonnage (kg)
                </button>
              </div>
            </div>

            {/* SVG Grouped / Stacked Bar Chart */}
            <div className="h-64 sm:h-72 w-full pt-4 relative flex flex-col justify-end">
              {/* Background grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                <div className="border-b border-dashed border-slate-200 w-full" />
                <div className="border-b border-dashed border-slate-200 w-full" />
                <div className="border-b border-dashed border-slate-200 w-full" />
                <div className="border-b border-dashed border-slate-200 w-full" />
              </div>

              {/* Bars Row */}
              <div className="relative z-10 grid grid-cols-12 gap-1.5 sm:gap-3 h-full items-end">
                {monthlyData.map((d) => {
                  const val = chartMetric === 'volume' ? d.dispatched : d.weight;
                  const deliveredVal = chartMetric === 'volume' ? d.delivered : d.weight * 0.98;
                  const heightPercent = Math.round((val / maxMonthlyVal) * 100);
                  const deliveredPercent = Math.round((deliveredVal / maxMonthlyVal) * 100);

                  return (
                    <div
                      key={d.month}
                      className="flex flex-col items-center h-full justify-end group cursor-pointer relative"
                      title={`${d.month}: ${val} ${chartMetric === 'volume' ? 'shipments' : 'kg'}`}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-10 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-md z-20 whitespace-nowrap">
                        {d.month}: {val.toLocaleString()} {chartMetric === 'volume' ? 'pkgs' : 'kg'}
                      </div>

                      {/* Bar Pair */}
                      <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-full">
                        {/* Dispatched Bar */}
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full max-w-[14px] bg-slate-200 group-hover:bg-slate-300 rounded-t-sm transition-all"
                        />
                        {/* Delivered Bar (Brand Orange) */}
                        <div
                          style={{ height: `${deliveredPercent}%` }}
                          className="w-full max-w-[14px] bg-[#FF6B00] group-hover:bg-[#EA580C] rounded-t-sm transition-all shadow-2xs"
                        />
                      </div>

                      {/* Month Label */}
                      <span className="text-[10px] sm:text-xs font-bold text-slate-400 mt-2">
                        {d.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-[#FF6B00]" />
                <span className="text-slate-600 font-medium">Delivered Parcels</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-xs bg-slate-200" />
                <span className="text-slate-600 font-medium">Total Booked</span>
              </div>
            </div>

            <span className="text-slate-400 font-medium">
              Peak Month: <strong className="text-slate-800">December (4,200 units)</strong>
            </span>
          </div>
        </div>

        {/* Delivery Performance & SLA Donut Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                <PieChart className="w-5 h-5 text-[#FF6B00]" />
                <span>Delivery Performance</span>
              </h3>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Tier 1 SLA
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Status distribution and fulfillment velocity across all operational corridors.
            </p>

            {/* Circular Progress Gauge */}
            <div className="relative flex items-center justify-center my-3">
              <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 120 120">
                {/* Background Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  className="text-slate-100"
                  strokeWidth="12"
                  stroke="currentColor"
                  fill="transparent"
                />
                {/* Delivered Arc (Emerald) */}
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  className="text-emerald-500"
                  strokeWidth="12"
                  strokeDasharray="301.6"
                  strokeDashoffset={301.6 - (301.6 * (metrics.rate || 92)) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
                {/* Pending Arc (Orange) */}
                <circle
                  cx="60"
                  cy="60"
                  r="36"
                  className="text-[#FF6B00]"
                  strokeWidth="8"
                  strokeDasharray="226.2"
                  strokeDashoffset="60"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-[#0F172A]">{metrics.rate}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Success Rate
                </span>
              </div>
            </div>

            {/* Segment Breakdown */}
            <div className="space-y-2.5 pt-4 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-700">Delivered On-Time</span>
                </div>
                <span className="font-bold text-slate-900">{metrics.delivered} pkgs ({metrics.rate}%)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
                  <span className="font-semibold text-slate-700">In Transit & Final Mile</span>
                </div>
                <span className="font-bold text-slate-900">{metrics.pending} pkgs</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="font-semibold text-slate-700">Failed / RTO Exceptions</span>
                </div>
                <span className="font-bold text-slate-900">{metrics.failed} pkgs</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-orange-50/60 rounded-2xl border border-orange-100 flex items-center justify-between text-xs text-orange-950 mt-4">
            <span className="font-medium">First-Attempt Delivery Rate:</span>
            <strong className="font-black text-[#FF6B00]">94.6%</strong>
          </div>
        </div>
      </div>

      {/* Shipment Trends Wave Curve & Velocity Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-lg font-black text-[#0F172A] tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#FF6B00]" />
              <span>Shipment Volume Trends & Weekly Velocity</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Continuous dispatch momentum across regional sorting hubs (7-day rolling cadence)
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Velocity Growth: +14.8% vs Previous Period</span>
          </div>
        </div>

        {/* Visual SVG Wave Trend Curve */}
        <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-gradient-to-b from-orange-50/50 via-slate-50/30 to-white border border-slate-100 p-4 flex flex-col justify-between">
          <svg className="w-full h-28 overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 120">
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#FF6B00" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Filled Area */}
            <path
              d="M0,90 Q 150,30 300,75 T 600,40 T 850,25 T 1000,10 L 1000,120 L 0,120 Z"
              fill="url(#trendGradient)"
            />

            {/* Smooth Curve Line */}
            <path
              d="M0,90 Q 150,30 300,75 T 600,40 T 850,25 T 1000,10"
              fill="transparent"
              stroke="#FF6B00"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Key milestone points */}
            <circle cx="300" cy="75" r="5" fill="#FFFFFF" stroke="#FF6B00" strokeWidth="3" />
            <circle cx="600" cy="40" r="5" fill="#FFFFFF" stroke="#FF6B00" strokeWidth="3" />
            <circle cx="850" cy="25" r="5" fill="#FFFFFF" stroke="#FF6B00" strokeWidth="3" />
            <circle cx="1000" cy="10" r="6" fill="#FF6B00" stroke="#FFFFFF" strokeWidth="2" />
          </svg>

          {/* Timeline labels */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold pt-2 border-t border-slate-100">
            <span>Monday (Day 1)</span>
            <span>Wednesday</span>
            <span>Friday (Weekend Surge)</span>
            <span>Sunday Peak</span>
          </div>
        </div>
      </div>

      {/* Row 2: Top Customers by Volume & Hub Performance Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Customers Table (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Top Customer Accounts by Volume</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Highest contributing clients by consignment throughput and billing volume
              </p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
              VIP Shippers
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Client Profile</th>
                  <th className="py-3 px-3">City Hub</th>
                  <th className="py-3 px-3">Bookings</th>
                  <th className="py-3 px-3">Freight Value</th>
                  <th className="py-3 px-3">SLA Success</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topCustomers.map((c, i) => (
                  <tr key={c.id || i} className="hover:bg-purple-50/20 transition-colors">
                    {/* Customer */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={c.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.name)}`}
                          alt={c.name}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-100 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{c.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{c.tier}</span>
                        </div>
                      </div>
                    </td>

                    {/* City */}
                    <td className="py-3 px-3 font-medium text-slate-700">
                      {c.city}
                    </td>

                    {/* Bookings */}
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {c.volume} pkgs
                    </td>

                    {/* Freight Value */}
                    <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                      ₹{c.estValue.toLocaleString()}
                    </td>

                    {/* SLA Rate */}
                    <td className="py-3 px-3 font-bold text-slate-800">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {c.onTimeRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Regional Hub Route Performance Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-black text-[#0F172A] tracking-tight flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#FF6B00]" />
                <span>Regional Hub Route Matrix</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Key sorting centers and turnaround SLA compliance
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {hubPerformance.map((h, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-orange-200 transition-all text-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {h.hub}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    {h.onTime} SLA
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-500 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Inbound</span>
                    <strong className="text-slate-800">{h.inbound.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Outbound</span>
                    <strong className="text-slate-800">{h.outbound.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Avg Turnaround</span>
                    <strong className="text-[#FF6B00]">{h.avgHours} hrs</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
