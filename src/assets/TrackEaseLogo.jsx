import React from 'react';

export const TrackEaseLogo = ({ className = 'h-10', showText = true, textClass = 'text-2xl', subtitle = false }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* 3D Isometric Package with Speed Trails */}
      <div className="relative flex-shrink-0 w-11 h-11 flex items-center justify-center">
        <svg
          viewBox="0 0 100 80"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Speed Streaks */}
          <path d="M5 25 H28" stroke="#FF6B00" strokeWidth="6" strokeLinecap="round" />
          <path d="M12 37 H32" stroke="#FF6B00" strokeWidth="6" strokeLinecap="round" />
          <path d="M2 49 H26" stroke="#FF6B00" strokeWidth="6" strokeLinecap="round" />

          {/* 3D Isometric Cube Box */}
          {/* Top Flap / Lid (Orange) */}
          <polygon
            points="55,10 82,24 55,38 28,24"
            fill="#FF6B00"
          />
          {/* Top Highlight strip */}
          <polygon
            points="55,10 68,17 55,24 42,17"
            fill="#FFA040"
          />

          {/* Left Face (Dark Navy / Black) */}
          <polygon
            points="28,24 55,38 55,70 28,56"
            fill="#0F172A"
          />
          {/* Inner package seam left */}
          <line x1="28" y1="24" x2="55" y2="38" stroke="#334155" strokeWidth="1" />

          {/* Right Face (Deep Navy Blue) */}
          <polygon
            points="55,38 82,24 82,56 55,70"
            fill="#1E293B"
          />
          {/* Orange tape line down right face */}
          <polygon
            points="66,32 72,29 72,61 66,64"
            fill="#FF6B00"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <div className={`font-black tracking-tight leading-none text-[#0F172A] ${textClass}`}>
            Track<span className="text-[#FF6B00]">Ease</span>
          </div>
          {subtitle && (
            <span className="text-[11px] font-medium text-slate-500 mt-1 tracking-normal">
              Courier & Parcel Tracking System
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackEaseLogo;
