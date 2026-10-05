import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  Compass,
  Truck,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  ArrowRight
} from 'lucide-react';
import TrackEaseLogo from '../../assets/TrackEaseLogo';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen, onOpenTrackModal }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out.');
    navigate('/login');
  };

  const navLinks = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: 'Active'
    },
    {
      to: '/shipments',
      label: 'Shipments',
      icon: Package,
      badge: 'M3'
    },
    {
      to: '/customers',
      label: 'Customers',
      icon: Users,
      badge: 'M4'
    },
    {
      to: '/tracking',
      label: 'Parcel Tracking',
      icon: Compass,
      badge: 'M5'
    },
    {
      to: '/delivery-status',
      label: 'Delivery Status',
      icon: Truck,
      badge: 'M6'
    },
    {
      to: '/notifications',
      label: 'Notifications',
      icon: Bell,
      notifCount: 2,
      badge: 'M7'
    },
    {
      to: '/reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      badge: 'M8'
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings
    }
  ];

  const handleNavClick = (link, e) => {
    if (link.to !== '/dashboard') {
      e.preventDefault();
      if (link.to === '/tracking') {
        onOpenTrackModal && onOpenTrackModal();
      } else {
        toast.info(`${link.label} belongs to ${link.badge || 'Module'}. Currently in Module 1 & 2 scope.`);
      }
    }
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header & Navigation */}
        <div className="overflow-y-auto overflow-x-hidden flex-1 flex flex-col">
          {/* Logo & Collapse Button */}
          <div className="h-20 flex items-center justify-between px-5 border-b border-slate-100 flex-shrink-0">
            {isCollapsed ? (
              <div className="mx-auto cursor-pointer" onClick={() => setIsCollapsed(false)}>
                <TrackEaseLogo showText={false} />
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <TrackEaseLogo showText={true} textClass="text-xl font-black text-[#0F172A]" subtitle={true} />
                <button
                  type="button"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors focus:outline-none flex-shrink-0 ml-2 cursor-pointer"
                  title="Collapse sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <div className="p-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isDashboard = link.to === '/dashboard';
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={(e) => handleNavClick(link, e)}
                  title={isCollapsed ? link.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 group relative cursor-pointer ${
                      isActive && isDashboard
                        ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/25'
                        : 'text-slate-600 hover:bg-orange-50/60 hover:text-[#FF6B00]'
                    } ${isCollapsed ? 'justify-center' : ''}`
                  }
                >
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isDashboard ? 'text-white' : 'text-slate-500 group-hover:text-[#FF6B00]'}`} />

                  {!isCollapsed && (
                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <span className="truncate">{link.label}</span>
                      <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                        {link.notifCount && (
                          <span className="w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {link.notifCount}
                          </span>
                        )}
                        {link.badge && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              link.badge === 'Active'
                                ? 'bg-white/25 text-white'
                                : 'bg-slate-100 text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-700'
                            }`}
                          >
                            {link.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tooltip on collapsed hover */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                      {link.label}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Promotional Card (Matching the Reference Image) */}
          {!isCollapsed && (
            <div className="mx-3 mt-auto mb-2 p-3.5 rounded-2xl bg-gradient-to-br from-[#FFF7ED] via-[#FFEDD5] to-[#FED7AA] border border-orange-200/80 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-xs font-black text-[#0F172A] leading-tight">
                  Fast. Safe.<br />Everywhere.
                </h4>
                <p className="text-[10px] text-slate-600 mt-1 max-w-[110px] leading-snug">
                  Track your shipments in real-time.
                </p>
                <button
                  type="button"
                  onClick={() => onOpenTrackModal && onOpenTrackModal('TRK-9821-BLR')}
                  className="mt-2.5 px-3 py-1 bg-[#FF6B00] hover:bg-[#EA580C] text-white text-[10px] font-bold rounded-lg shadow-sm shadow-orange-500/20 inline-flex items-center gap-1 transition cursor-pointer"
                >
                  <span>Track Now</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Truck Graphic in Bottom Right of Promo Card */}
              <div className="absolute -bottom-1 -right-1 w-24 h-16 pointer-events-none opacity-90">
                <img
                  src="/dash-promo.jpg"
                  alt="Delivery Truck"
                  className="w-full h-full object-contain object-bottom"
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom User Area matching reference image */}
        <div className="p-3 border-t border-slate-100 flex-shrink-0">
          {!isCollapsed ? (
            <div className="p-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={currentUser?.name || 'Admin Manager'}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500/20 flex-shrink-0"
                />
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {currentUser?.name || 'Admin Manager'}
                  </p>
                  <p className="text-[10px] font-semibold text-[#FF6B00] flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>{currentUser?.role || 'Admin'}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-7 h-7 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt="User"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-orange-500/20 cursor-pointer"
                onClick={() => setIsCollapsed(false)}
              />
              <button
                type="button"
                onClick={handleLogout}
                className="w-8 h-8 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
