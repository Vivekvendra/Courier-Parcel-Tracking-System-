import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  CheckCircle,
  Radio,
  AlertCircle,
  LogOut,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { initialNotifications } from '../../data/mockData';
import { toast } from 'react-toastify';

export const Navbar = ({ onOpenMobileSidebar, onSearchQuery, onOpenTrackModal }) => {
  const { currentUser, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const searchInputRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = 2; // matching the "2" badge in reference image

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    onSearchQuery && onSearchQuery(searchTerm.trim());
    onOpenTrackModal && onOpenTrackModal(searchTerm.trim());
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Drawer Trigger & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar with Ctrl+K shortcut matching reference image */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tracking no (e.g. TRK-9821-BLR) or customer..."
            className="w-full pl-10 pr-16 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-100 transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center">
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
              Ctrl + K
            </kbd>
          </div>
        </form>
      </div>

      {/* Right Side: Notification Bell & Profile dropdown matching reference image */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Notification Bell with Badge */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 relative transition-colors focus:outline-none cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
              {unreadCount}
            </span>
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#0F172A]">Notifications</h4>
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 text-xs font-bold">
                    {unreadCount} new
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto my-2">
                {notifications.slice(0, 2).map((n) => (
                  <div
                    key={n.id}
                    className="py-2.5 px-2 rounded-xl transition-colors cursor-pointer flex items-start gap-3 bg-orange-50/30"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {n.type === 'success' ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Radio className="w-3.5 h-3.5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-800">{n.title}</p>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-snug">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile matching reference image: Avatar + "Admin Manager" + "Admin" (orange) */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-50 transition-all focus:outline-none cursor-pointer"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser?.name || 'Admin Manager'}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500/20"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser?.name || 'Admin Manager'}
              </span>
              <span className="text-[10px] font-semibold text-[#FF6B00] leading-none flex items-center gap-1 mt-0.5">
                <span>{currentUser?.role || 'Admin'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </span>
            </div>
          </button>

          {/* Profile Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2.5 bg-slate-50 rounded-xl mb-2">
                <p className="text-xs font-bold text-slate-900">{currentUser?.name || 'Admin Manager'}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser?.email || 'admin@trackease.com'}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  logout();
                  toast.info('Logged out successfully.');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
