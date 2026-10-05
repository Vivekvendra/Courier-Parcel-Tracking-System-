import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import DashboardPage from '../../pages/dashboard/DashboardPage';

export const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchTrackQuery, setSearchTrackQuery] = useState('');

  const handleOpenTrackModal = (query = '') => {
    setSearchTrackQuery(query || 'TRK-9821-BLR');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onOpenTrackModal={handleOpenTrackModal}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Navbar */}
        <Navbar
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
          onSearchQuery={(q) => setSearchTrackQuery(q)}
          onOpenTrackModal={handleOpenTrackModal}
        />

        {/* Dashboard Main Viewport */}
        <main className="flex-1 p-3 sm:p-4 lg:p-5 max-w-[1600px] w-full mx-auto">
          <DashboardPage
            initialTrackQuery={searchTrackQuery}
            onClearTrackQuery={() => setSearchTrackQuery('')}
          />
        </main>

        {/* System Footer */}
        <footer className="py-5 px-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400">
          <p>
            TrackEase Courier & Parcel Tracking System • Built with React, Vite & Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
