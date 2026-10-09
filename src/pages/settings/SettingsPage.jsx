import React, { useState } from 'react';
import {
  Settings,
  User,
  Bell,
  Truck,
  Shield,
  Database,
  Save,
  RotateCcw,
  CheckCircle2,
  Lock,
  Mail,
  Building,
  Key,
  HardDrive,
  Download,
  Trash2,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useShipments } from '../../context/ShipmentContext';
import { useCustomers } from '../../context/CustomerContext';

export const SettingsPage = () => {
  const { currentUser } = useAuth();
  const { resetNotifications } = useNotifications();
  const { shipments } = useShipments();
  const { customers } = useCustomers();

  // Active Tab: 'profile' | 'notifications' | 'logistics' | 'data'
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form State
  const [profileName, setProfileName] = useState(currentUser?.name || 'Operations Lead');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || 'admin@trackease.com');
  const [profileRole, setProfileRole] = useState(currentUser?.role || 'Admin');
  const [profilePhone, setProfilePhone] = useState('+91 98450 12345');
  const [profileHub, setProfileHub] = useState('Bengaluru Central Gateway (BLR-01)');

  // Logistics Configuration State
  const [defaultCarrier, setDefaultCarrier] = useState('TrackEase Priority Express');
  const [autoBarcode, setAutoBarcode] = useState(true);
  const [trackingPrefix, setTrackingPrefix] = useState('TRK');
  const [slaTargetDays, setSlaTargetDays] = useState('2');

  // Notification Preferences State
  const [notifInApp, setNotifInApp] = useState(true);
  const [notifEmailAlerts, setNotifEmailAlerts] = useState(true);
  const [notifSmsConsignee, setNotifSmsConsignee] = useState(false);
  const [notifSound, setNotifSound] = useState(true);

  // Save Handlers
  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success('User profile updated successfully!');
  };

  const handleSaveLogistics = (e) => {
    e.preventDefault();
    toast.success('Logistics dispatch configurations saved!');
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    toast.success('Notification preferences updated!');
  };

  // Export Full JSON Backup
  const handleExportSystemBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      user: { name: profileName, email: profileEmail, role: profileRole },
      shipmentsCount: shipments.length,
      customersCount: customers.length,
      shipments,
      customers
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trackease-system-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Complete system backup downloaded!');
  };

  // Reset Demo Dataset
  const handleResetData = () => {
    if (window.confirm('Reset all demo records back to fresh factory data?')) {
      localStorage.removeItem('trackease_shipments_data');
      localStorage.removeItem('trackease_customers_data');
      localStorage.removeItem('trackease_notifications_list');
      resetNotifications();
      toast.info('Factory data reset initiated. Refreshing workspace...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const tabs = [
    { id: 'profile', label: 'User Profile & Identity', icon: User },
    { id: 'logistics', label: 'Dispatch & Carrier Defaults', icon: Truck },
    { id: 'notifications', label: 'Alert Preferences', icon: Bell },
    { id: 'data', label: 'Storage & Backup', icon: Database }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] text-xs font-bold mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>Workspace Preferences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            System Settings & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage administrative credentials, dispatch parameters, alerts, and offline storage.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportSystemBackup}
          className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer inline-flex items-center gap-2 self-start md:self-auto"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export System Backup</span>
        </button>
      </div>

      {/* Settings Grid: Left Tabs / Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar Tabs (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs space-y-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Account Info Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#FF6B00] font-black flex items-center justify-center text-sm">
                {profileName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{profileName}</h4>
                <span className="text-[11px] text-slate-400 font-medium">{profileRole} Access</span>
              </div>
            </div>
            <div className="pt-3 text-[11px] text-slate-500 space-y-1">
              <p>Active Session: <strong>Token Verified</strong></p>
              <p>Primary Hub: <strong>Bengaluru (BLR)</strong></p>
              <p>System Version: <strong>TrackEase v2.4 Enterprise</strong></p>
            </div>
          </div>
        </div>

        {/* Tab Content Panel (8 cols) */}
        <div className="lg:col-span-8">
          {/* TAB 1: USER PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
              <div>
                <h3 className="text-lg font-black text-[#0F172A] tracking-tight">
                  User Profile & Account Information
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update administrative credentials and operational identification.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Administrator Name
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none transition font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Email Address
                    </label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none transition font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contact Mobile Number
                    </label>
                    <input
                      type="text"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none transition font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Assigned Primary Hub
                    </label>
                    <input
                      type="text"
                      value={profileHub}
                      onChange={(e) => setProfileHub(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none transition font-medium"
                    />
                  </div>
                </div>

                <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-orange-950 block">Account Permission Level</span>
                    <span className="text-orange-700 text-[11px]">Full access to Shipment CRUD, Tracking Overrides, and Customer Records</span>
                  </div>
                  <span className="px-3 py-1 bg-white font-bold text-[#FF6B00] rounded-xl border border-orange-200 shadow-2xs">
                    {profileRole}
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#EA580C] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 transition flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: LOGISTICS & CARRIER DEFAULTS */}
          {activeTab === 'logistics' && (
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
              <div>
                <h3 className="text-lg font-black text-[#0F172A] tracking-tight">
                  Dispatch & Carrier Assignment Defaults
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure automatic booking formats, carrier routing, and default manifest rules.
                </p>
              </div>

              <form onSubmit={handleSaveLogistics} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Default Courier Provider
                    </label>
                    <select
                      value={defaultCarrier}
                      onChange={(e) => setDefaultCarrier(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none transition font-semibold text-slate-800"
                    >
                      <option value="TrackEase Priority Express">TrackEase Priority Express</option>
                      <option value="BlueDart Air Express">BlueDart Air Express</option>
                      <option value="Delhivery Surface Freight">Delhivery Surface Freight</option>
                      <option value="DTDC National Cargo">DTDC National Cargo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tracking ID Prefix Format
                    </label>
                    <input
                      type="text"
                      value={trackingPrefix}
                      onChange={(e) => setTrackingPrefix(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none transition font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Default SLA Delivery Target (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="14"
                      value={slaTargetDays}
                      onChange={(e) => setSlaTargetDays(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-[#FF6B00] focus:bg-white focus:outline-none transition font-semibold"
                    />
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoBarcode}
                        onChange={(e) => setAutoBarcode(e.target.checked)}
                        className="rounded border-slate-300 text-[#FF6B00] focus:ring-orange-200"
                      />
                      <span className="text-xs font-bold text-slate-700">
                        Auto-generate QR code & Barcode labels on creation
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#EA580C] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 transition flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Dispatch Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: ALERT PREFERENCES */}
          {activeTab === 'notifications' && (
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
              <div>
                <h3 className="text-lg font-black text-[#0F172A] tracking-tight">
                  Notification & Operational Alerts
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select which system events trigger real-time toasts and audible indicators.
                </p>
              </div>

              <form onSubmit={handleSaveNotifications} className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">In-App Floating Toast Alerts</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Display immediate toast popup when parcels change lifecycle status.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifInApp(!notifInApp)}
                      className={`text-2xl transition cursor-pointer ${notifInApp ? 'text-[#FF6B00]' : 'text-slate-300'}`}
                    >
                      {notifInApp ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Email Exception Alerts</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Trigger automated email to support desk whenever a parcel fails delivery.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifEmailAlerts(!notifEmailAlerts)}
                      className={`text-2xl transition cursor-pointer ${notifEmailAlerts ? 'text-[#FF6B00]' : 'text-slate-300'}`}
                    >
                      {notifEmailAlerts ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Consignee SMS Notifications</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Send simulated SMS OTP and tracking links to recipient's phone number.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifSmsConsignee(!notifSmsConsignee)}
                      className={`text-2xl transition cursor-pointer ${notifSmsConsignee ? 'text-[#FF6B00]' : 'text-slate-300'}`}
                    >
                      {notifSmsConsignee ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Audible Notification Chime</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Play subtle audio cue when new critical dispatches are registered.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifSound(!notifSound)}
                      className={`text-2xl transition cursor-pointer ${notifSound ? 'text-[#FF6B00]' : 'text-slate-300'}`}
                    >
                      {notifSound ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#EA580C] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 transition flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Alert Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: DATA STORAGE & BACKUP */}
          {activeTab === 'data' && (
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
              <div>
                <h3 className="text-lg font-black text-[#0F172A] tracking-tight">
                  System Storage & Cache Controls
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage LocalStorage persistence, export data dumps, or restore initial demo state.
                </p>
              </div>

              <div className="space-y-4">
                {/* Cache Health */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Client Cache Storage Health</span>
                    <span className="font-mono text-emerald-600 font-bold">Healthy (Synchronized)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Shipments Cached</span>
                      <strong className="text-slate-900">{shipments.length} records</strong>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Customers Cached</span>
                      <strong className="text-slate-900">{customers.length} accounts</strong>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Storage Engine</span>
                      <strong className="text-slate-900">HTML5 LocalStorage</strong>
                    </div>
                  </div>
                </div>

                {/* Data Operations */}
                <div className="space-y-3 pt-2">
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Download Complete JSON Backup</h4>
                      <p className="text-xs text-slate-500">
                        Export full snapshot of all consignments, customer CRM records, and audit history.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportSystemBackup}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer inline-flex items-center gap-1.5 shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Snapshot</span>
                    </button>
                  </div>

                  <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-rose-950">Reset to Default Factory Dataset</h4>
                      <p className="text-xs text-rose-700">
                        Restores initial pre-loaded consignments and customers, clearing manual modifications.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetData}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition cursor-pointer inline-flex items-center gap-1.5 shrink-0 shadow-sm"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Factory Reset</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
