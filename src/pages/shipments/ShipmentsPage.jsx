import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Download,
  Compass,
  LayoutGrid,
  List,
  Copy,
  ArrowRight,
  Printer,
  Sparkles,
  Layers,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useShipments } from '../../context/ShipmentContext';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import { SkeletonRow } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';

export const ShipmentsPage = () => {
  const navigate = useNavigate();
  const { shipments, loading, error, createShipment, updateShipment, deleteShipment } = useShipments();

  // Search, Filter & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const itemsPerPage = viewMode === 'grid' ? 6 : 7;

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  // Forms
  const createForm = useForm({
    defaultValues: {
      senderName: '',
      receiverName: '',
      pickupAddress: '',
      deliveryAddress: '',
      parcelWeight: '2.5',
      parcelType: 'Standard Box',
      shippingDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      deliveryStatus: 'In Transit',
      notes: ''
    }
  });

  const editForm = useForm();

  // Copy tracking number
  const handleCopyTracking = (e, trk) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(trk);
    toast.success(`Copied tracking number: ${trk}`);
  };

  // Open Edit modal
  const handleOpenEdit = (shipment, e) => {
    e?.stopPropagation();
    setSelectedShipment(shipment);
    editForm.reset({
      senderName: shipment.senderName,
      receiverName: shipment.receiverName,
      pickupAddress: shipment.pickupAddress,
      deliveryAddress: shipment.deliveryAddress,
      parcelWeight: parseFloat(shipment.parcelWeight) || 2.5,
      parcelType: shipment.parcelType,
      shippingDate: shipment.shippingDate,
      expectedDeliveryDate: shipment.expectedDeliveryDate,
      deliveryStatus: shipment.deliveryStatus,
      notes: shipment.notes || ''
    });
    setIsEditModalOpen(true);
  };

  // Open Details modal
  const handleOpenDetails = (shipment, e) => {
    e?.stopPropagation();
    setSelectedShipment(shipment);
    setIsDetailsModalOpen(true);
  };

  // Open Delete modal
  const handleOpenDelete = (shipment, e) => {
    e?.stopPropagation();
    setSelectedShipment(shipment);
    setIsDeleteModalOpen(true);
  };

  // Submit Create
  const onSubmitCreate = async (data) => {
    try {
      const created = await createShipment(data);
      toast.success(`Shipment created! Tracking: ${created.trackingNumber}`);
      setIsCreateModalOpen(false);
      createForm.reset();
    } catch (err) {
      toast.error('Failed to create shipment.');
    }
  };

  // Submit Edit
  const onSubmitEdit = async (data) => {
    try {
      await updateShipment(selectedShipment.id, data);
      toast.success(`Shipment ${selectedShipment.trackingNumber} updated successfully!`);
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error('Failed to update shipment.');
    }
  };

  // Confirm Delete
  const onConfirmDelete = async () => {
    try {
      await deleteShipment(selectedShipment.id);
      toast.info(`Shipment ${selectedShipment.trackingNumber} deleted.`);
      setIsDeleteModalOpen(false);
    } catch (err) {
      toast.error('Failed to delete shipment.');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Tracking Number,Sender,Receiver,Pickup,Delivery,Type,Weight,Status,Date,ETA'];
    const rows = filteredShipments.map(s => 
      `"${s.trackingNumber}","${s.senderName}","${s.receiverName}","${s.pickupAddress}","${s.deliveryAddress}","${s.parcelType}","${s.parcelWeight}","${s.deliveryStatus}","${s.shippingDate}","${s.expectedDeliveryDate}"`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shipments-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Shipments manifest exported to CSV');
  };

  // Metrics summary
  const metrics = useMemo(() => {
    const total = shipments.length;
    const inTransit = shipments.filter(s => s.deliveryStatus === 'In Transit').length;
    const delivered = shipments.filter(s => s.deliveryStatus === 'Delivered').length;
    const pending = shipments.filter(s => ['Pending', 'Picked Up'].includes(s.deliveryStatus)).length;
    const rate = total > 0 ? ((delivered / total) * 100).toFixed(0) : 0;
    return { total, inTransit, delivered, pending, rate };
  }, [shipments]);

  // Filter & Sort Logic
  const filteredShipments = useMemo(() => {
    return shipments
      .filter((item) => {
        const matchesStatus = statusFilter === 'All' || item.deliveryStatus.toLowerCase() === statusFilter.toLowerCase();
        const matchesType = typeFilter === 'All' || item.parcelType === typeFilter;
        const matchesSearch =
          searchTerm === '' ||
          item.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesType && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.shippingDate) - new Date(a.shippingDate);
        if (sortBy === 'date-asc') return new Date(a.shippingDate) - new Date(b.shippingDate);
        if (sortBy === 'weight-desc') return (parseFloat(b.parcelWeight) || 0) - (parseFloat(a.parcelWeight) || 0);
        if (sortBy === 'weight-asc') return (parseFloat(a.parcelWeight) || 0) - (parseFloat(b.parcelWeight) || 0);
        return 0;
      });
  }, [shipments, searchTerm, statusFilter, typeFilter, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage) || 1;
  const paginatedShipments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredShipments.slice(start, start + itemsPerPage);
  }, [filteredShipments, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-bold mb-2">
            <Package className="w-3.5 h-3.5" />
            <span>Consignment & Freight Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Shipments Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create consignments, monitor multi-hub dispatch, and manage tracking records across regions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 bg-[#FF6B00] hover:bg-[#EA580C] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 inline-flex items-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Shipment</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Consignments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs relative overflow-hidden group hover:border-orange-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Consignments</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Package className="w-4 h-4 text-[#FF6B00]" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">{metrics.total}</span>
            <span className="text-xs font-semibold text-emerald-600 inline-flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14% mo
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Registered freight records</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400 opacity-80" />
        </div>

        {/* Active In Transit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs relative overflow-hidden group hover:border-blue-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">In Transit</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">{metrics.inTransit}</span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Live on road
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Actively moving parcels</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-80" />
        </div>

        {/* Delivered Success */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs relative overflow-hidden group hover:border-emerald-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Delivered</span>
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
          <p className="text-[11px] text-slate-400 mt-1">Successfully fulfilled orders</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-80" />
        </div>

        {/* Pending & Picked Up */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs relative overflow-hidden group hover:border-amber-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Dispatch</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">{metrics.pending}</span>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              Queued
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting origin pickup & scans</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-400 opacity-80" />
        </div>
      </div>

      {/* Control Bar: Search, Filters, Sorting & View Toggle */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Bar (5 cols) */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by tracking no, sender, receiver, address..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B00] focus:bg-white transition"
            />
          </div>

          {/* Filter by Status (3 cols) */}
          <div className="lg:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B00] font-semibold text-slate-700 transition"
            >
              <option value="All">All Delivery Statuses</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Picked Up">Picked Up</option>
              <option value="Pending">Pending</option>
              <option value="Failed Delivery">Failed Delivery</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Filter by Parcel Type (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B00] font-semibold text-slate-700 transition"
            >
              <option value="All">All Parcel Types</option>
              <option value="Standard Box">Standard Box</option>
              <option value="Express Document">Express Document</option>
              <option value="Fragile Cargo">Fragile Cargo</option>
              <option value="Heavy Freight">Heavy Freight</option>
            </select>
          </div>

          {/* Sort By (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B00] font-semibold text-slate-700 transition"
            >
              <option value="date-desc">Newest Date First</option>
              <option value="date-asc">Oldest Date First</option>
              <option value="weight-desc">Weight: High to Low</option>
              <option value="weight-asc">Weight: Low to High</option>
            </select>
          </div>

          {/* View Mode Toggle (1 col) */}
          <div className="lg:col-span-1 flex items-center justify-end">
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'table' ? 'bg-white shadow-2xs text-[#FF6B00]' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid' ? 'bg-white shadow-2xs text-[#FF6B00]' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Cards Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filter Status Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-slate-400 mr-1">Status:</span>
            {['All', 'In Transit', 'Delivered', 'Out for Delivery', 'Pending'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer text-xs ${
                  statusFilter === st
                    ? 'bg-[#FF6B00] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-slate-700">{filteredShipments.length}</strong> of {shipments.length} records
          </span>
        </div>
      </div>

      {/* Main Content Area: Loading, Error, Empty, Table or Grid */}
      {loading ? (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/90 shadow-2xs text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">Connection Error</h3>
          <p className="text-xs text-slate-500 mt-1">{error}</p>
        </div>
      ) : filteredShipments.length === 0 ? (
        <div className="bg-white py-14 rounded-3xl border border-slate-200/90 shadow-2xs">
          <EmptyState
            title="No Shipments Found"
            description="No consignment records match your active search terms or status filters."
            actionText="Clear All Filters"
            onAction={() => {
              setSearchTerm('');
              setStatusFilter('All');
              setTypeFilter('All');
              setSortBy('date-desc');
            }}
          />
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARDS VIEW */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedShipments.map((s) => (
              <div
                key={s.id}
                onClick={() => handleOpenDetails(s)}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-orange-200 transition-all p-5 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#0F172A] group-hover:text-[#FF6B00] transition">
                        {s.trackingNumber}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopyTracking(e, s.trackingNumber)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                        title="Copy tracking number"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <Badge status={s.deliveryStatus} size="sm" />
                  </div>

                  {/* Route Visualizer */}
                  <div className="py-3 space-y-2">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                        A
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-slate-400 font-medium">Pickup (Sender)</p>
                        <p className="text-xs font-bold text-slate-800 truncate">{s.senderName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{s.pickupAddress}</p>
                      </div>
                    </div>

                    <div className="ml-2.5 border-l-2 border-dashed border-slate-200 h-3" />

                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-orange-100 text-[#FF6B00] flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                        B
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-slate-400 font-medium">Destination (Receiver)</p>
                        <p className="text-xs font-bold text-slate-800 truncate">{s.receiverName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{s.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>

                  {/* Specs & Schedule */}
                  <div className="bg-slate-50/80 rounded-xl p-2.5 grid grid-cols-2 gap-2 text-[11px] mt-1 border border-slate-100">
                    <div>
                      <span className="text-slate-400 block font-medium">Parcel Type</span>
                      <span className="font-semibold text-slate-700 truncate block">{s.parcelType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Weight</span>
                      <span className="font-semibold text-slate-700 block">{s.parcelWeight} kg</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Shipped On</span>
                      <span className="font-semibold text-slate-700 block">{s.shippingDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Expected ETA</span>
                      <span className="font-semibold text-slate-700 block">{s.expectedDeliveryDate}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/tracking?number=${s.trackingNumber}`);
                    }}
                    className="text-xs font-bold text-[#FF6B00] hover:text-[#EA580C] inline-flex items-center gap-1 transition"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Track Live</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleOpenDetails(s, e)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleOpenEdit(s, e)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition"
                      title="Edit Shipment"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleOpenDelete(s, e)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition"
                      title="Delete Shipment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredShipments.length} total shipments)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                    currentPage === i + 1
                      ? 'bg-[#FF6B00] text-white shadow-2xs'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-4 px-5">Tracking Code</th>
                  <th className="py-4 px-5">Parties (Sender / Consignee)</th>
                  <th className="py-4 px-5">Route & Addresses</th>
                  <th className="py-4 px-5">Type & Weight</th>
                  <th className="py-4 px-5">Schedule</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedShipments.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => handleOpenDetails(s)}
                    className="hover:bg-orange-50/25 transition-colors cursor-pointer group"
                  >
                    {/* Tracking No */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#0F172A] group-hover:text-[#FF6B00] transition">
                          {s.trackingNumber}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyTracking(e, s.trackingNumber)}
                          className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                          title="Copy tracking"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Sender & Receiver */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {s.receiverName?.slice(0, 2).toUpperCase() || 'NA'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">{s.receiverName}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">From: {s.senderName}</p>
                        </div>
                      </div>
                    </td>

                    {/* Route */}
                    <td className="py-4 px-5 max-w-[220px]">
                      <div className="truncate text-xs text-slate-700 font-semibold flex items-center gap-1" title={s.pickupAddress}>
                        <span className="text-slate-400">📍</span>
                        <span className="truncate">{s.pickupAddress}</span>
                      </div>
                      <div className="truncate text-[11px] text-slate-500 mt-0.5 flex items-center gap-1" title={s.deliveryAddress}>
                        <span className="text-orange-500">🏁</span>
                        <span className="truncate">{s.deliveryAddress}</span>
                      </div>
                    </td>

                    {/* Weight & Type */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className="font-bold text-slate-800 block">{s.parcelWeight} kg</span>
                      <span className="text-[11px] text-slate-400 block">{s.parcelType}</span>
                    </td>

                    {/* Dates */}
                    <td className="py-4 px-5 whitespace-nowrap text-xs">
                      <span className="text-slate-700 block font-semibold">Shipped: {s.shippingDate}</span>
                      <span className="text-slate-400 text-[11px] block">ETA: {s.expectedDeliveryDate}</span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <Badge status={s.deliveryStatus} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/tracking?number=${s.trackingNumber}`);
                          }}
                          className="p-1.5 rounded-lg hover:bg-orange-50 text-slate-400 hover:text-[#FF6B00] transition"
                          title="Track Parcel"
                        >
                          <Compass className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleOpenDetails(s, e)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleOpenEdit(s, e)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition"
                          title="Edit Shipment"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleOpenDelete(s, e)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                          title="Delete Shipment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar */}
          <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredShipments.length} total shipments)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                    currentPage === i + 1
                      ? 'bg-[#FF6B00] text-white shadow-2xs'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: CREATE SHIPMENT */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Shipment"
        subtitle="Generates unique tracking ID, booking manifest, and route status"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={createForm.handleSubmit(onSubmitCreate)} className="space-y-4">
          <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-100 flex items-center gap-2.5 text-xs text-orange-950">
            <Sparkles className="w-4 h-4 text-[#FF6B00] shrink-0" />
            <span>Standard barcode and 12-digit tracking identifier will be automatically assigned.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sender / Consignor *</label>
              <input
                type="text"
                placeholder="e.g. Apex Electronics Ltd"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none transition"
                {...createForm.register('senderName', { required: 'Sender name is required' })}
              />
              {createForm.formState.errors.senderName && (
                <span className="text-[11px] text-rose-500 font-medium">{createForm.formState.errors.senderName.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Receiver / Consignee *</label>
              <input
                type="text"
                placeholder="e.g. Rahul Verma"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none transition"
                {...createForm.register('receiverName', { required: 'Receiver name is required' })}
              />
              {createForm.formState.errors.receiverName && (
                <span className="text-[11px] text-rose-500 font-medium">{createForm.formState.errors.receiverName.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Address (Origin) *</label>
              <input
                type="text"
                placeholder="e.g. Unit 4B, Koramangala, Bengaluru"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none transition"
                {...createForm.register('pickupAddress', { required: 'Pickup address is required' })}
              />
              {createForm.formState.errors.pickupAddress && (
                <span className="text-[11px] text-rose-500 font-medium">{createForm.formState.errors.pickupAddress.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Address (Destination) *</label>
              <input
                type="text"
                placeholder="e.g. 102 Andheri East, Mumbai"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none transition"
                {...createForm.register('deliveryAddress', { required: 'Delivery address is required' })}
              />
              {createForm.formState.errors.deliveryAddress && (
                <span className="text-[11px] text-rose-500 font-medium">{createForm.formState.errors.deliveryAddress.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Parcel Category</label>
              <select
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none font-medium"
                {...createForm.register('parcelType')}
              >
                <option value="Standard Box">Standard Box</option>
                <option value="Express Document">Express Document</option>
                <option value="Fragile Cargo">Fragile Cargo</option>
                <option value="Heavy Freight">Heavy Freight</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Weight (kg) *</label>
              <input
                type="number"
                step="0.1"
                placeholder="2.5"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none"
                {...createForm.register('parcelWeight', { required: true })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Initial Dispatch Status</label>
              <select
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none font-medium"
                {...createForm.register('deliveryStatus')}
              >
                <option value="In Transit">In Transit</option>
                <option value="Pending">Pending</option>
                <option value="Picked Up">Picked Up</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dispatch Date</label>
              <input
                type="date"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none"
                {...createForm.register('shippingDate')}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Delivery (ETA)</label>
              <input
                type="date"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none"
                {...createForm.register('expectedDeliveryDate')}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-[#FF6B00] hover:bg-[#EA580C] text-white rounded-xl shadow-md shadow-orange-500/20 transition cursor-pointer"
            >
              Generate Shipment & Tracking No
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: EDIT SHIPMENT */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Shipment: ${selectedShipment?.trackingNumber}`}
        subtitle="Modify shipment information, addresses, weight or status"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sender Name</label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none"
                {...editForm.register('senderName', { required: true })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Receiver Name</label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none"
                {...editForm.register('receiverName', { required: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Address</label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none"
                {...editForm.register('pickupAddress', { required: true })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Address</label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none"
                {...editForm.register('deliveryAddress', { required: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Parcel Type</label>
              <select
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none font-medium"
                {...editForm.register('parcelType')}
              >
                <option value="Standard Box">Standard Box</option>
                <option value="Express Document">Express Document</option>
                <option value="Fragile Cargo">Fragile Cargo</option>
                <option value="Heavy Freight">Heavy Freight</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none"
                {...editForm.register('parcelWeight')}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Status</label>
              <select
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none font-medium"
                {...editForm.register('deliveryStatus')}
              >
                <option value="Pending">Pending</option>
                <option value="Picked Up">Picked Up</option>
                <option value="In Transit">In Transit</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Failed Delivery">Failed Delivery</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Shipping Date</label>
              <input
                type="date"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none"
                {...editForm.register('shippingDate')}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Expected Delivery Date</label>
              <input
                type="date"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none"
                {...editForm.register('expectedDeliveryDate')}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-[#FF6B00] hover:bg-[#EA580C] text-white rounded-xl shadow-md shadow-orange-500/20 transition cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: SHIPMENT DETAILS VIEW */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Consignment Airway Bill"
        subtitle={`Manifest ID: ${selectedShipment?.trackingNumber}`}
        maxWidth="max-w-2xl"
      >
        {selectedShipment && (
          <div className="space-y-5">
            {/* Airway Bill Header Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">Official Tracking Code</span>
                <p className="font-mono font-black text-2xl tracking-wider text-white mt-0.5">{selectedShipment.trackingNumber}</p>
                <p className="text-xs text-slate-300 mt-1">
                  {selectedShipment.parcelType} • Weight: <span className="font-bold text-white">{selectedShipment.parcelWeight} kg</span>
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge status={selectedShipment.deliveryStatus} size="md" />
                <button
                  type="button"
                  onClick={(e) => handleCopyTracking(e, selectedShipment.trackingNumber)}
                  className="text-[11px] font-semibold text-slate-300 hover:text-white inline-flex items-center gap-1 transition"
                >
                  <Copy className="w-3 h-3" /> Copy Code
                </button>
              </div>
            </div>

            {/* Route & Progress Card */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 pb-2 border-b border-slate-100">
                <span className="text-[#FF6B00] flex items-center gap-1.5">
                  <Truck className="w-4 h-4" />
                  <span>Current Status: {selectedShipment.deliveryStatus}</span>
                </span>
                <span className="text-slate-500 font-normal">
                  ETA: <strong className="text-slate-800 font-bold">{selectedShipment.expectedDeliveryDate}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">Origin / Pickup Hub:</span>
                  <p className="font-bold text-slate-800 text-sm mt-1">{selectedShipment.senderName}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{selectedShipment.pickupAddress}</p>
                </div>
                <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-100">
                  <span className="text-orange-600 font-bold text-[10px] uppercase">Destination / Consignee:</span>
                  <p className="font-bold text-slate-800 text-sm mt-1">{selectedShipment.receiverName}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{selectedShipment.deliveryAddress}</p>
                </div>
              </div>
            </div>

            {/* Logistics Timing */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Booking Date</span>
                <p className="font-bold text-slate-800 mt-0.5">{selectedShipment.shippingDate}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Delivery</span>
                <p className="font-bold text-slate-800 mt-0.5">{selectedShipment.expectedDeliveryDate}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Dispatch Node</span>
                <p className="font-bold text-slate-800 mt-0.5">Automated Gateway</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  navigate(`/tracking?number=${selectedShipment.trackingNumber}`);
                }}
                className="px-4 py-2.5 bg-[#FF6B00] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 inline-flex items-center gap-2 transition"
              >
                <Compass className="w-4 h-4" />
                <span>Track Live on Map</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 4: DELETE CONFIRMATION */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Shipment Deletion"
        subtitle="This action will permanently remove the consignment manifest."
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600">
            Are you sure you want to delete shipment <strong className="font-mono text-slate-900">{selectedShipment?.trackingNumber}</strong>?
          </p>
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
            This will remove this record from local cache and active monitoring.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirmDelete}
              className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md shadow-rose-600/20"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ShipmentsPage;
