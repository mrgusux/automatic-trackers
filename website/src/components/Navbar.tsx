import React from "react";
import { Radio, Github, Terminal, ShieldCheck, Download } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-tight">AutomaticTrackers</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-violet-500/15 text-violet-300 rounded-full border border-violet-500/30">
                v1.1
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none">Automated BitTorrent Tracker Hub</p>
          </div>
        </div>

        {/* Live Status & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>1,234 Active Trackers</span>
          </div>

          <a
            href="/api/v1/trackers?format=txt"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/30 transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">API Feed</span>
          </a>

          <a
            href="https://github.com/mrguseynov/automatic-trackers"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
            title="GitHub Repository"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
