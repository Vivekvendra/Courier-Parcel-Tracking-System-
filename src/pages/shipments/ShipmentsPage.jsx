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
  Compass
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
  const { shipments, loading, error, createShipment, updateShipment, deleteShipment, generateTrackingNumber } = useShipments();

  // Search, Filter & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, weight-desc, weight-asc
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  // Handle open Edit modal
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

  // Handle open Details modal
  const handleOpenDetails = (shipment, e) => {
    e?.stopPropagation();
    setSelectedShipment(shipment);
    setIsDetailsModalOpen(true);
  };

  // Handle open Delete modal
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
      toast.info(`Shipment ${selectedShipment.trackingNumber} has been deleted.`);
      setIsDeleteModalOpen(false);
    } catch (err) {
      toast.error('Failed to delete shipment.');
    }
  };

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
  }, [filteredShipments, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-bold mb-1.5">
            <Package className="w-3.5 h-3.5" />
            <span>Module 3: Shipment Lifecycle Management</span>
          </div>
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
            Shipments Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create consignments, monitor multi-hub dispatch, and manage tracking records.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-[#FF6B00] hover:bg-[#EA580C] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 inline-flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Shipment</span>
        </button>
      </div>

      {/* Control Bar: Search, Filters, Sorting */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Bar (5 cols) */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by tracking no, sender, receiver, destination..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B00] focus:bg-white"
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
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B00] font-medium text-slate-700"
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
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B00] font-medium text-slate-700"
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
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B00] font-medium text-slate-700"
            >
              <option value="date-desc">Newest Date First</option>
              <option value="date-asc">Oldest Date First</option>
              <option value="weight-desc">Weight: High to Low</option>
              <option value="weight-asc">Weight: Low to High</option>
            </select>
          </div>
        </div>

        {/* Status Pills Quick Strip */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-400">Quick Filters:</span>
          {['All', 'In Transit', 'Delivered', 'Pending'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                setStatusFilter(st);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#FF6B00] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-400">
            Showing <strong>{filteredShipments.length}</strong> consignments
          </span>
        </div>
      </div>

      {/* Shipments Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">Connection Error</h3>
            <p className="text-xs text-slate-500 mt-1">{error}</p>
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No Shipments Match Filter"
              description="Adjust your search query, status, or parcel type to display records."
              actionText="Reset All Filters"
              onAction={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setTypeFilter('All');
                setSortBy('date-desc');
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Tracking Number</th>
                  <th className="py-3.5 px-4">Parties (Sender / Receiver)</th>
                  <th className="py-3.5 px-4">Route & Addresses</th>
                  <th className="py-3.5 px-4">Type & Weight</th>
                  <th className="py-3.5 px-4">Schedule</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedShipments.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => handleOpenDetails(s)}
                    className="hover:bg-orange-50/30 transition-colors cursor-pointer group"
                  >
                    {/* Tracking No */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0F172A] group-hover:text-[#FF6B00] whitespace-nowrap">
                      {s.trackingNumber}
                    </td>

                    {/* Sender & Receiver */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800 leading-tight">{s.receiverName}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">From: {s.senderName}</p>
                    </td>

                    {/* Route */}
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <div className="truncate text-xs text-slate-700 font-medium" title={s.pickupAddress}>
                        📍 {s.pickupAddress}
                      </div>
                      <div className="truncate text-[11px] text-slate-500 mt-0.5" title={s.deliveryAddress}>
                        🏁 {s.deliveryAddress}
                      </div>
                    </td>

                    {/* Weight & Type */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 block">{s.parcelWeight}</span>
                      <span className="text-[11px] text-slate-400 block">{s.parcelType}</span>
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                      <span className="text-slate-700 block font-medium">Shipped: {s.shippingDate}</span>
                      <span className="text-slate-400 text-[11px] block">ETA: {s.expectedDeliveryDate}</span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge status={s.deliveryStatus} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/tracking?number=${s.trackingNumber}`);
                          }}
                          className="p-1.5 rounded-lg hover:bg-orange-50 text-slate-500 hover:text-[#FF6B00] transition"
                          title="Track Parcel (Module 5)"
                        >
                          <Compass className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleOpenDetails(s, e)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#FF6B00] transition"
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && filteredShipments.length > 0 && (
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
        )}
      </div>

      {/* MODAL 1: CREATE SHIPMENT (Module 3 Requirement) */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Shipment"
        subtitle="Generates unique tracking ID, booking manifest, and route status"
        maxWidth="max-w-xl"
      >
        <form onSubmit={createForm.handleSubmit(onSubmitCreate)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sender Name *</label>
              <input
                type="text"
                placeholder="e.g. Reliance Retail Hub"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none"
                {...createForm.register('senderName', { required: 'Sender name is required' })}
              />
              {createForm.formState.errors.senderName && (
                <span className="text-[11px] text-rose-500 font-medium">{createForm.formState.errors.senderName.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Receiver Name *</label>
              <input
                type="text"
                placeholder="e.g. Ananya Sen"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none"
                {...createForm.register('receiverName', { required: 'Receiver name is required' })}
              />
              {createForm.formState.errors.receiverName && (
                <span className="text-[11px] text-rose-500 font-medium">{createForm.formState.errors.receiverName.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Address *</label>
              <input
                type="text"
                placeholder="e.g. Plot 14, Whitefield, Bengaluru"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none"
                {...createForm.register('pickupAddress', { required: 'Pickup address is required' })}
              />
              {createForm.formState.errors.pickupAddress && (
                <span className="text-[11px] text-rose-500 font-medium">{createForm.formState.errors.pickupAddress.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Address *</label>
              <input
                type="text"
                placeholder="e.g. 52 Jubilee Hills, Hyderabad"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none"
                {...createForm.register('deliveryAddress', { required: 'Delivery address is required' })}
              />
              {createForm.formState.errors.deliveryAddress && (
                <span className="text-[11px] text-rose-500 font-medium">{createForm.formState.errors.deliveryAddress.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Parcel Type</label>
              <select
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none bg-white font-medium"
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
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none"
                {...createForm.register('parcelWeight', { required: true })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Initial Status</label>
              <select
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none bg-white font-medium"
                {...createForm.register('deliveryStatus')}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Shipping Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none"
                {...createForm.register('shippingDate')}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Expected Delivery Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none"
                {...createForm.register('expectedDeliveryDate')}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-[#FF6B00] hover:bg-[#EA580C] text-white rounded-xl shadow-md shadow-orange-500/20"
            >
              Generate Shipment & Tracking No
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: EDIT SHIPMENT (Module 3 Requirement) */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Shipment: ${selectedShipment?.trackingNumber}`}
        subtitle="Update addresses, courier weights, or delivery status"
        maxWidth="max-w-xl"
      >
        <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sender Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none"
                {...editForm.register('senderName', { required: true })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Receiver Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none"
                {...editForm.register('receiverName', { required: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Address</label>
              <input
                type="text"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none"
                {...editForm.register('pickupAddress', { required: true })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Address</label>
              <input
                type="text"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none"
                {...editForm.register('deliveryAddress', { required: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Parcel Type</label>
              <select
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none bg-white font-medium"
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
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none"
                {...editForm.register('parcelWeight')}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Status</label>
              <select
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none bg-white font-medium"
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

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-[#FF6B00] hover:bg-[#EA580C] text-white rounded-xl shadow-md shadow-orange-500/20"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: SHIPMENT DETAILS VIEW (Module 3 Requirement) */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Shipment Details"
        subtitle={`Manifest ID: ${selectedShipment?.trackingNumber}`}
        maxWidth="max-w-xl"
      >
        {selectedShipment && (
          <div className="space-y-5">
            {/* Header Badge Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Tracking Code</span>
                <p className="font-mono font-black text-xl text-[#0F172A]">{selectedShipment.trackingNumber}</p>
                <p className="text-xs text-slate-500 mt-0.5">{selectedShipment.parcelType} • {selectedShipment.parcelWeight}</p>
              </div>
              <Badge status={selectedShipment.deliveryStatus} size="md" />
            </div>

            {/* Timeline Progress */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 pb-2 border-b border-slate-100">
                <span className="text-blue-600 flex items-center gap-1.5">
                  <Truck className="w-4 h-4" />
                  <span>Current Status: {selectedShipment.deliveryStatus}</span>
                </span>
                <span className="text-slate-500 font-normal">
                  ETA: <strong className="text-slate-800">{selectedShipment.expectedDeliveryDate}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <span className="text-slate-400 font-medium">Pickup / Origin:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedShipment.pickupAddress}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Sender: {selectedShipment.senderName}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Destination:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedShipment.deliveryAddress}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Receiver: {selectedShipment.receiverName}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400">Booking / Shipping Date:</span>
                <p className="font-semibold text-slate-800">{selectedShipment.shippingDate}</p>
              </div>
              <div>
                <span className="text-slate-400">Target Delivery Date:</span>
                <p className="font-semibold text-slate-800">{selectedShipment.expectedDeliveryDate}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Close Details
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
