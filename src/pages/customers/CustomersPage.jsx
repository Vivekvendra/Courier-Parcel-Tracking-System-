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
  AlertCircle
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
  const itemsPerPage = 6;

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

  // Cities list for quick filter
  const cities = useMemo(() => {
    const list = new Set(customers.map((c) => c.city).filter(Boolean));
    return ['All', ...Array.from(list)];
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
  }, [filteredCustomers, currentPage]);

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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Module 4: Customer Directory & CRM</span>
          </div>
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
            Customer Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage corporate shippers, consignees, delivery addresses, and account profiles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-[#FF6B00] hover:bg-[#EA580C] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 inline-flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Control Bar: Search & City Filter */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Bar (8 cols) */}
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search customer by name, email, phone, city..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B00] focus:bg-white"
            />
          </div>

          {/* City Filter (4 cols) */}
          <div className="sm:col-span-4">
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6B00] font-medium text-slate-700"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Operating Cities' : `City: ${c}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Info Strip */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>Active CRM records: <strong>{filteredCustomers.length}</strong></span>
          <span>Showing page {currentPage} of {totalPages}</span>
        </div>
      </div>

      {/* Customers Table / Grid */}
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
            <h3 className="text-base font-bold text-slate-800">Unable to Load Customers</h3>
            <p className="text-xs text-slate-500 mt-1">{error}</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No Customers Found"
              description="No customer records match your search keyword or selected city."
              actionText="Reset Filter"
              onAction={() => {
                setSearchTerm('');
                setSelectedCity('All');
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Address & Hub</th>
                  <th className="py-3.5 px-4">Postal Code</th>
                  <th className="py-3.5 px-4">Shipments</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
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
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.name)}`}
                          alt={c.name}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-100"
                        />
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-[#FF6B00] transition-colors">
                            {c.name}
                          </p>
                          <span className="text-[11px] text-slate-400 font-mono">ID: {c.id.slice(0, 10)}</span>
                        </div>
                      </div>
                    </td>

                    {/* Email & Phone */}
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <p className="truncate text-xs text-slate-700 font-medium" title={c.address}>
                        {c.address}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md mt-1">
                        <Building className="w-3 h-3" />
                        {c.city}
                      </span>
                    </td>

                    {/* Postal Code */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                      {c.postalCode}
                    </td>

                    {/* Total Shipments */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 text-xs">
                        {c.totalShipments || 0} orders
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => handleOpenProfile(c, e)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-purple-600 transition"
                          title="View Customer Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleOpenEdit(c, e)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition"
                          title="Edit Customer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleOpenDelete(c, e)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition"
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
        )}

        {/* Pagination Bar */}
        {!loading && filteredCustomers.length > 0 && (
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
        )}
      </div>

      {/* MODAL 1: ADD CUSTOMER (Module 4 Requirement) */}
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
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none"
              {...addForm.register('name', { required: 'Customer name is required' })}
            />
            {addForm.formState.errors.name && (
              <span className="text-[11px] text-rose-500 font-medium">{addForm.formState.errors.name.message}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                placeholder="e.g. divya@example.com"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none"
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
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none"
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
            <label className="block text-xs font-bold text-slate-700 mb-1">Address *</label>
            <input
              type="text"
              placeholder="e.g. Flat 402, Sunshine Apartments, Indiranagar"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none"
              {...addForm.register('address', { required: 'Address is required' })}
            />
            {addForm.formState.errors.address && (
              <span className="text-[11px] text-rose-500 font-medium">{addForm.formState.errors.address.message}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                placeholder="e.g. Bengaluru"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none"
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
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none"
                {...addForm.register('postalCode', { required: 'Postal code is required' })}
              />
              {addForm.formState.errors.postalCode && (
                <span className="text-[11px] text-rose-500 font-medium">{addForm.formState.errors.postalCode.message}</span>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-[#FF6B00] hover:bg-[#EA580C] text-white rounded-xl shadow-md shadow-orange-500/20"
            >
              Save Customer
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: EDIT CUSTOMER (Module 4 Requirement) */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Customer Profile"
        subtitle={`Editing ${selectedCustomer?.name}`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Customer Full Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none"
              {...editForm.register('name', { required: true })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none"
                {...editForm.register('email', { required: true })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
              <input
                type="text"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none"
                {...editForm.register('phone', { required: true })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
            <input
              type="text"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none"
              {...editForm.register('address', { required: true })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
              <input
                type="text"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none"
                {...editForm.register('city', { required: true })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Postal Code</label>
              <input
                type="text"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:outline-none"
                {...editForm.register('postalCode', { required: true })}
              />
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
              Update Customer
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: CUSTOMER PROFILE VIEW (Module 4 Requirement) */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Customer Profile View"
        subtitle="Complete client record and shipping volume"
        maxWidth="max-w-md"
      >
        {selectedCustomer && (
          <div className="space-y-5">
            {/* Profile Header */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-orange-50 border border-slate-200/80">
              <img
                src={selectedCustomer.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedCustomer.name)}`}
                alt={selectedCustomer.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-sm"
              />
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">{selectedCustomer.name}</h3>
                <p className="text-xs text-slate-500 font-mono">Customer ID: {selectedCustomer.id}</p>
                <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified Shipper
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <Mail className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span className="font-semibold text-slate-800">{selectedCustomer.email}</span>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <Phone className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span className="font-semibold text-slate-800">{selectedCustomer.phone}</span>
              </div>
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <MapPin className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">{selectedCustomer.address}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{selectedCustomer.city} • PIN: {selectedCustomer.postalCode}</p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-100/70 text-center">
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Lifetime Shipments</span>
                <p className="text-lg font-black text-[#0F172A]">{selectedCustomer.totalShipments || 12}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Customer Status</span>
                <p className="text-lg font-black text-emerald-600">Active</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Close Profile
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
