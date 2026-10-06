import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchTrackQuery, setSearchTrackQuery] = useState('');

  const handleOpenTrackModal = (query = '') => {
    setSearchTrackQuery(query || 'TRK-9821-BLR');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
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
          isCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        {/* Top Navbar */}
        <Navbar
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
          onSearchQuery={(q) => setSearchTrackQuery(q)}
          onOpenTrackModal={handleOpenTrackModal}
        />

        {/* Dynamic Route Viewport */}
        <main className="flex-1 p-3 sm:p-4 lg:p-5 max-w-[1600px] w-full mx-auto">
          <Outlet context={{ searchTrackQuery, onClearTrackQuery: () => setSearchTrackQuery(''), onOpenTrackModal: handleOpenTrackModal }} />
        </main>

        {/* System Footer */}
        <footer className="py-4 px-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400">
          <p>
            TrackEase Courier & Parcel Tracking System • Operations Suite
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
