import React from "react";
import { Radio, Github, Terminal } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#C5CEE0]/15 bg-[#0B0F16]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#070E17] border border-[#9E9EFF]/40 flex items-center justify-center text-[#9E9EFF] shadow-lg shadow-[#9E9EFF]/10">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-tight font-sans">AutomaticTrackers</span>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#9E9EFF]/15 text-[#9E9EFF] rounded-full border border-[#9E9EFF]/30 uppercase tracking-wider">
                v1.1
              </span>
            </div>
            <p className="text-[11px] text-[#898F9D] leading-none">Automated BitTorrent Tracker Hub</p>
          </div>
        </div>

        {/* Live Status & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#070E17] border border-[#C5CEE0]/20 text-xs font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-white">1,234</span>
            <span className="text-[#898F9D]">Active Trackers</span>
          </div>

          <a
            href="/api/v1/trackers?format=txt"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#9E9EFF]/15 hover:bg-[#9E9EFF]/25 text-[#9E9EFF] border border-[#9E9EFF]/30 transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">API Feed</span>
          </a>

          <a
            href="https://github.com/mrgusux/automatic-trackers"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full text-[#898F9D] hover:text-white hover:bg-white/5 border border-[#C5CEE0]/15 hover:border-[#9E9EFF]/40 transition-colors"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}

