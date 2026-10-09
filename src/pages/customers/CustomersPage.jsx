import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Building,
  Package,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Shield,
  CheckCircle2,
  AlertCircle,
  Download,
  LayoutGrid,
  List,
  Sparkles,
  TrendingUp,
  Globe,
  ExternalLink,
  Award
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useCustomers } from '../../context/CustomerContext';
import Modal from '../../components/common/Modal';
import { SkeletonRow } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';

export const CustomersPage = () => {
  const { customers, loading, error, addCustomer, updateCustomer, deleteCustomer } = useCustomers();

  // Search & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const itemsPerPage = viewMode === 'grid' ? 6 : 7;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // React Hook Forms
  const addForm = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: ''
    }
  });

  const editForm = useForm();

  // Open Edit Modal
  const handleOpenEdit = (customer, e) => {
    e?.stopPropagation();
    setSelectedCustomer(customer);
    editForm.reset({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      postalCode: customer.postalCode
    });
    setIsEditModalOpen(true);
  };

  // Open Profile View Modal
  const handleOpenProfile = (customer, e) => {
    e?.stopPropagation();
    setSelectedCustomer(customer);
    setIsProfileModalOpen(true);
  };

  // Open Delete Confirmation Modal
  const handleOpenDelete = (customer, e) => {
    e?.stopPropagation();
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  // Submit Add
  const onSubmitAdd = async (data) => {
    try {
      const added = await addCustomer(data);
      toast.success(`Customer "${added.name}" registered successfully!`);
      setIsAddModalOpen(false);
      addForm.reset();
    } catch (err) {
      toast.error('Failed to add customer.');
    }
  };

  // Submit Edit
  const onSubmitEdit = async (data) => {
    try {
      await updateCustomer(selectedCustomer.id, data);
      toast.success(`Customer "${data.name}" profile updated!`);
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error('Failed to update customer profile.');
    }
  };

  // Confirm Delete
  const onConfirmDelete = async () => {
    try {
      await deleteCustomer(selectedCustomer.id);
      toast.info(`Customer "${selectedCustomer.name}" deleted from registry.`);
      setIsDeleteModalOpen(false);
    } catch (err) {
      toast.error('Failed to delete customer.');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Name,Email,Phone,Address,City,Postal Code,Total Shipments'];
    const rows = filteredCustomers.map(c => 
      `"${c.name}","${c.email}","${c.phone}","${c.address}","${c.city}","${c.postalCode}","${c.totalShipments || 0}"`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-directory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Customer contacts exported to CSV');
  };

  // Cities list for quick filter
  const cities = useMemo(() => {
    const list = new Set(customers.map((c) => c.city).filter(Boolean));
    return ['All', ...Array.from(list)];
  }, [customers]);

  // Top metric stats
  const metrics = useMemo(() => {
    const total = customers.length;
    const distinctCities = new Set(customers.map(c => c.city).filter(Boolean)).size;
    const totalOrders = customers.reduce((acc, c) => acc + (c.totalShipments || 10), 0);
    const avgOrders = total > 0 ? (totalOrders / total).toFixed(1) : 0;
    return { total, distinctCities, totalOrders, avgOrders };
  }, [customers]);

  // Filter Logic
  const filteredCustomers = useMemo(() => {
    return customers.filter((item) => {
      const matchesCity = selectedCity === 'All' || item.city.toLowerCase() === selectedCity.toLowerCase();
      const matchesSearch =
        searchTerm === '' ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.address.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCity && matchesSearch;
    });
  }, [customers, searchTerm, selectedCity]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, currentPage, itemsPerPage]);

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Customer Directory & Master Accounts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Customer Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage corporate shippers, verified consignees, delivery addresses, and account order history.
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
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-[#FF6B00] hover:bg-[#EA580C] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 inline-flex items-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Customer</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Customers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs relative overflow-hidden group hover:border-purple-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Accounts</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">{metrics.total}</span>
            <span className="text-xs font-semibold text-emerald-600 inline-flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12% MoM
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active client profiles</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-400 opacity-80" />
        </div>

        {/* Operating Cities */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs relative overflow-hidden group hover:border-blue-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Coverage Hubs</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">{metrics.distinctCities}</span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Major Cities
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Multi-state service network</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-80" />
        </div>

        {/* Total Associated Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs relative overflow-hidden group hover:border-orange-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Bookings</span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">{metrics.totalOrders}</span>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
              Consignments
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Parcels booked across accounts</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400 opacity-80" />
        </div>

        {/* Avg Volume Per Account */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs relative overflow-hidden group hover:border-emerald-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg Volume</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">{metrics.avgOrders}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Per Client
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">High client retention rate</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-80" />
        </div>
      </div>

      {/* Control Bar: Search, City Filter & View Mode */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Bar (7 cols) */}
          <div className="sm:col-span-7 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search customer by name, email, phone, city..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B00] focus:bg-white transition"
            />
          </div>

          {/* City Filter (3 cols) */}
          <div className="sm:col-span-3">
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B00] font-semibold text-slate-700 transition"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Operating Cities' : `City: ${c}`}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle (2 cols) */}
          <div className="sm:col-span-2 flex items-center justify-end">
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

        {/* Quick City Filter Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-slate-400 mr-1">Hub City:</span>
            {cities.slice(0, 5).map((cty) => (
              <button
                key={cty}
                type="button"
                onClick={() => {
                  setSelectedCity(cty);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer text-xs ${
                  selectedCity === cty
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cty}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Active CRM accounts: <strong className="text-slate-700">{filteredCustomers.length}</strong>
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
          <h3 className="text-base font-bold text-slate-800">Unable to Load Customers</h3>
          <p className="text-xs text-slate-500 mt-1">{error}</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="bg-white py-14 rounded-3xl border border-slate-200/90 shadow-2xs">
          <EmptyState
            title="No Customers Found"
            description="No customer records match your active search terms or selected hub city."
            actionText="Reset All Filters"
            onAction={() => {
              setSearchTerm('');
              setSelectedCity('All');
            }}
          />
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARDS VIEW */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedCustomers.map((c) => (
              <div
                key={c.id}
                onClick={() => handleOpenProfile(c)}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-purple-200 transition-all p-5 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Card Header with Avatar & Tier */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.name)}`}
                        alt={c.name}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-100 shrink-0"
                      />
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-[#FF6B00] transition-colors leading-tight">
                          {c.name}
                        </h3>
                        <span className="text-[11px] text-slate-400 font-mono">ID: {c.id.slice(0, 10)}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                      <CheckCircle2 className="w-3 h-3 text-purple-600" /> Verified
                    </span>
                  </div>

                  {/* Contact Information */}
                  <div className="py-3 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Mail className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <a
                        href={`mailto:${c.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="truncate hover:text-[#FF6B00] transition"
                      >
                        {c.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <a
                        href={`tel:${c.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-[#FF6B00] transition"
                      >
                        {c.phone}
                      </a>
                    </div>
                    <div className="flex items-start gap-2 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                      <p className="truncate text-[11px]">{c.address}</p>
                    </div>
                  </div>

                  {/* Location & Orders Badge Strip */}
                  <div className="bg-slate-50/80 rounded-xl p-2.5 flex items-center justify-between text-xs border border-slate-100">
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {c.city} ({c.postalCode})
                    </span>
                    <span className="font-bold text-[#0F172A] bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {c.totalShipments || 12} shipments
                    </span>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => handleOpenProfile(c, e)}
                    className="text-xs font-bold text-purple-600 hover:text-purple-800 inline-flex items-center gap-1 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleOpenEdit(c, e)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition"
                      title="Edit Customer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleOpenDelete(c, e)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                      title="Delete Customer"
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
              Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> - <strong>{Math.min(currentPage * itemsPerPage, filteredCustomers.length)}</strong> of <strong>{filteredCustomers.length}</strong> customers
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
                  <th className="py-4 px-5">Customer Profile</th>
                  <th className="py-4 px-5">Contact Details</th>
                  <th className="py-4 px-5">Hub & Physical Address</th>
                  <th className="py-4 px-5">Postal Code</th>
                  <th className="py-4 px-5">Total Shipments</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedCustomers.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => handleOpenProfile(c)}
                    className="hover:bg-purple-50/20 transition-colors cursor-pointer group"
                  >
                    {/* Customer Name & Avatar */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.name)}`}
                          alt={c.name}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-100 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-[#FF6B00] transition-colors leading-tight">
                            {c.name}
                          </p>
                          <span className="text-[11px] text-slate-400 font-mono">ID: {c.id.slice(0, 10)}</span>
                        </div>
                      </div>
                    </td>

                    {/* Email & Phone */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.phone}</span>
                      </div>
                    </td>

                    {/* Address & City */}
                    <td className="py-4 px-5 max-w-[220px]">
                      <p className="truncate text-xs text-slate-700 font-medium" title={c.address}>
                        {c.address}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md mt-1 border border-purple-100">
                        <Building className="w-3 h-3 text-purple-500" />
                        {c.city}
                      </span>
                    </td>

                    {/* Postal Code */}
                    <td className="py-4 px-5 font-mono font-bold text-slate-700">
                      {c.postalCode}
                    </td>

                    {/* Total Shipments */}
                    <td className="py-4 px-5">
                      <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg text-xs">
                        {c.totalShipments || 12} orders
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => handleOpenProfile(c, e)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-purple-600 transition"
                          title="View Customer Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleOpenEdit(c, e)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition"
                          title="Edit Customer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleOpenDelete(c, e)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                          title="Delete Customer"
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
              Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> - <strong>{Math.min(currentPage * itemsPerPage, filteredCustomers.length)}</strong> of <strong>{filteredCustomers.length}</strong> customers
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

      {/* MODAL 1: ADD CUSTOMER */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Customer"
        subtitle="Register customer in master directory"
        maxWidth="max-w-lg"
      >
        <form onSubmit={addForm.handleSubmit(onSubmitAdd)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Customer Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Divya Prakash"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none transition"
              {...addForm.register('name', { required: 'Customer name is required' })}
            />
            {addForm.formState.errors.name && (
              <span className="text-[11px] text-rose-500 font-medium">{addForm.formState.errors.name.message}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                placeholder="e.g. divya@example.com"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none transition"
                {...addForm.register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email pattern'
                  }
                })}
              />
              {addForm.formState.errors.email && (
                <span className="text-[11px] text-rose-500 font-medium">{addForm.formState.errors.email.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
              <input
                type="text"
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none transition"
                {...addForm.register('phone', {
                  required: 'Mobile number is required',
                  minLength: { value: 8, message: 'Invalid phone length' }
                })}
              />
              {addForm.formState.errors.phone && (
                <span className="text-[11px] text-rose-500 font-medium">{addForm.formState.errors.phone.message}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Physical Address *</label>
            <input
              type="text"
              placeholder="e.g. Flat 402, Sunshine Apartments, Indiranagar"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none transition"
              {...addForm.register('address', { required: 'Address is required' })}
            />
            {addForm.formState.errors.address && (
              <span className="text-[11px] text-rose-500 font-medium">{addForm.formState.errors.address.message}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City Hub *</label>
              <input
                type="text"
                placeholder="e.g. Bengaluru"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none transition"
                {...addForm.register('city', { required: 'City is required' })}
              />
              {addForm.formState.errors.city && (
                <span className="text-[11px] text-rose-500 font-medium">{addForm.formState.errors.city.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Postal Code *</label>
              <input
                type="text"
                placeholder="e.g. 560038"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none transition"
                {...addForm.register('postalCode', { required: 'Postal code is required' })}
              />
              {addForm.formState.errors.postalCode && (
                <span className="text-[11px] text-rose-500 font-medium">{addForm.formState.errors.postalCode.message}</span>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-[#FF6B00] hover:bg-[#EA580C] text-white rounded-xl shadow-md shadow-orange-500/20 transition cursor-pointer"
            >
              Save Customer
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: EDIT CUSTOMER */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Customer Profile"
        subtitle={`Editing profile for ${selectedCustomer?.name}`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Customer Full Name</label>
            <input
              type="text"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none transition"
              {...editForm.register('name', { required: true })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none transition"
                {...editForm.register('email', { required: true })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none transition"
                {...editForm.register('phone', { required: true })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Physical Address</label>
            <input
              type="text"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none transition"
              {...editForm.register('address', { required: true })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City Hub</label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none transition"
                {...editForm.register('city', { required: true })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Postal Code</label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none transition"
                {...editForm.register('postalCode', { required: true })}
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
              Update Customer Profile
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: CUSTOMER PROFILE VIEW */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Customer Profile Dossier"
        subtitle="Complete client record and shipping volume"
        maxWidth="max-w-lg"
      >
        {selectedCustomer && (
          <div className="space-y-5">
            {/* Profile Header */}
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-md">
              <img
                src={selectedCustomer.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedCustomer.name)}`}
                alt={selectedCustomer.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/40 shadow-sm"
              />
              <div>
                <h3 className="text-lg font-black text-white">{selectedCustomer.name}</h3>
                <p className="text-xs text-purple-200 font-mono mt-0.5">Account ID: {selectedCustomer.id}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Verified Corporate Client
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Mail className="w-4 h-4 text-purple-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Official Email</span>
                  <a href={`mailto:${selectedCustomer.email}`} className="font-semibold text-slate-800 hover:text-[#FF6B00]">
                    {selectedCustomer.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Phone className="w-4 h-4 text-purple-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Contact Number</span>
                  <a href={`tel:${selectedCustomer.phone}`} className="font-semibold text-slate-800 hover:text-[#FF6B00]">
                    {selectedCustomer.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <MapPin className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Billing & Delivery Hub</span>
                  <p className="font-semibold text-slate-800">{selectedCustomer.address}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{selectedCustomer.city} • PIN: {selectedCustomer.postalCode}</p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-100/70 text-center">
              <div>
                <span className="text-[11px] text-slate-500 font-bold uppercase">Lifetime Shipments</span>
                <p className="text-2xl font-black text-[#0F172A] mt-0.5">{selectedCustomer.totalShipments || 12}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-bold uppercase">Account Status</span>
                <p className="text-2xl font-black text-emerald-600 mt-0.5">Active VIP</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Close Dossier
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 4: DELETE CONFIRMATION */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Customer Deletion"
        subtitle="This action will remove the customer from master records."
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600">
            Are you sure you want to delete customer <strong className="text-slate-900">{selectedCustomer?.name}</strong>?
          </p>
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
            This customer's profile and contact records will be permanently expunged.
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

export default CustomersPage;
