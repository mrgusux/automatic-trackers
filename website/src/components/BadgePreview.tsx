"use client";

import React, { useState, useEffect } from "react";
import { CopyButton } from "./CopyButton";
import { Sparkles, Terminal, Code2, ExternalLink } from "lucide-react";

export function BadgePreview() {
  const [badgeLabel, setBadgeLabel] = useState("trackers");
  const [badgeColor, setBadgeColor] = useState("10b981");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const badgePath = `/api/badge/trackers.svg?label=${encodeURIComponent(badgeLabel)}&color=${badgeColor.replace("#", "")}`;
  const fullBadgeUrl = origin ? `${origin}${badgePath}` : `https://automatic-trackers.vercel.app${badgePath}`;
  const markdownCode = `![Trackers](${fullBadgeUrl})`;
  const htmlCode = `<img src="${fullBadgeUrl}" alt="Active Trackers Badge" />`;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>GitHub Dynamic Badges</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Real-Time SVG Status Badge</h2>
          <p className="text-xs text-slate-400 mt-1">
            Embed an auto-updating SVG badge in your GitHub repository README or project documentation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left: Interactive Preview */}
        <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-white/5">
          <div className="text-xs font-semibold text-slate-300">Live Rendered Badge:</div>
          <div className="p-6 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-center">
            {/* SVG Badge rendering */}
            <img
              src={badgePath}
              alt="Live BitTorrent Trackers Badge"
              className="h-7 drop-shadow-md transition-all hover:scale-105"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[10px] uppercase font-semibold text-slate-400">Label text:</label>
              <input
                type="text"
                value={badgeLabel}
                onChange={(e) => setBadgeLabel(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-semibold text-slate-400">Hex color:</label>
              <input
                type="text"
                value={badgeColor}
                onChange={(e) => setBadgeColor(e.target.value.replace("#", ""))}
                className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
          </div>
        </div>

        {/* Right: Copyable Embed Snippets */}
        <div className="space-y-3 font-mono text-xs">
          <div>
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-sans font-semibold text-slate-400">Markdown (README.md):</span>
              <CopyButton text={markdownCode} label="Copy Markdown" />
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-white/5 text-slate-300 select-all break-all text-[11px]">
              {markdownCode}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-sans font-semibold text-slate-400">HTML Snippet:</span>
              <CopyButton text={htmlCode} label="Copy HTML" />
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-white/5 text-slate-300 select-all break-all text-[11px]">
              {htmlCode}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-sans font-semibold text-slate-400">Raw SVG URL:</span>
              <CopyButton text={fullBadgeUrl} label="Copy URL" />
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-white/5 text-violet-300 select-all break-all text-[11px]">
              {fullBadgeUrl}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
