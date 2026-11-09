"use client";

import React, { useState, useEffect } from "react";
import { CopyButton } from "./CopyButton";
import { Sparkles } from "lucide-react";

export function BadgePreview() {
  const [badgeLabel, setBadgeLabel] = useState("trackers");
  const [badgeColor, setBadgeColor] = useState("9e9eff");
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
    <div className="glass-surface p-6 sm:p-8 rounded-[24px] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#C5CEE0]/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#9E9EFF] uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>GitHub Dynamic Badges</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Real-Time SVG Status Badge</h2>
          <p className="text-xs text-[#898F9D] mt-1">
            Embed an auto-updating SVG badge in your GitHub repository README or project documentation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left: Interactive Preview */}
        <div className="space-y-4 bg-[#070E17] p-5 rounded-2xl border border-[#C5CEE0]/15">
          <div className="text-xs font-semibold text-[#898F9D]">Live Rendered Badge:</div>
          <div className="p-6 rounded-xl bg-[#0B0F16] border border-[#C5CEE0]/15 flex items-center justify-center">
            {/* SVG Badge rendering */}
            <img
              src={badgePath}
              alt="Live BitTorrent Trackers Badge"
              className="h-7 drop-shadow-md transition-all hover:scale-105"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[10px] uppercase font-semibold text-[#898F9D]">Label text:</label>
              <input
                type="text"
                value={badgeLabel}
                onChange={(e) => setBadgeLabel(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 bg-[#0B0F16] border border-[#C5CEE0]/20 rounded-xl text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#9E9EFF]"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-semibold text-[#898F9D]">Hex color:</label>
              <input
                type="text"
                value={badgeColor}
                onChange={(e) => setBadgeColor(e.target.value.replace("#", ""))}
                className="w-full mt-1 px-3 py-1.5 bg-[#0B0F16] border border-[#C5CEE0]/20 rounded-xl text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#9E9EFF]"
              />
            </div>
          </div>
        </div>

        {/* Right: Copyable Embed Snippets */}
        <div className="space-y-3 font-mono text-xs">
          <div>
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-sans font-semibold text-[#898F9D]">Markdown (README.md):</span>
              <CopyButton text={markdownCode} label="Copy Markdown" />
            </div>
            <div className="p-3 rounded-xl bg-[#070E17] border border-[#C5CEE0]/15 text-white select-all break-all text-[11px]">
              {markdownCode}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-sans font-semibold text-[#898F9D]">HTML Snippet:</span>
              <CopyButton text={htmlCode} label="Copy HTML" />
            </div>
            <div className="p-3 rounded-xl bg-[#070E17] border border-[#C5CEE0]/15 text-white select-all break-all text-[11px]">
              {htmlCode}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-sans font-semibold text-[#898F9D]">Raw SVG URL:</span>
              <CopyButton text={fullBadgeUrl} label="Copy URL" />
            </div>
            <div className="p-3 rounded-xl bg-[#070E17] border border-[#C5CEE0]/15 text-[#9E9EFF] select-all break-all text-[11px]">
              {fullBadgeUrl}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

