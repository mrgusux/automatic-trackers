import React from "react";
import { getTrackersDataset } from "@/lib/trackers-data";
import { StatsGrid } from "@/components/StatsGrid";
import { TrackerStudio } from "@/components/TrackerStudio";
import { ChecksumVerifier } from "@/components/ChecksumVerifier";
import { BadgePreview } from "@/components/BadgePreview";
import { CopyButton } from "@/components/CopyButton";
import { Radio, Terminal, ArrowRight, ShieldCheck, Download, Code2, Zap } from "lucide-react";

export default function HomePage() {
  const dataset = getTrackersDataset();

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="relative pt-4 pb-2 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-violet-400" />
            <span>High-Yield BitTorrent Swarm Optimizing Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Curated BitTorrent <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Tracker Aggregator
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
            Sanitized every 3 hours from 44 high-yield sources. Purged of 343 dead mirrors and spam hosts.
            Instant 1-click formats for qBittorrent tier balancing, aria2 CLI, and live SVG badges.
          </p>
        </div>

        {/* Quick Start Terminal Box */}
        <div className="w-full md:w-[420px] glass-panel rounded-2xl p-4 border border-white/10 shadow-2xl relative overflow-hidden text-left">
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-[11px] font-mono text-slate-400 ml-2 font-medium">aria2 & curl quickstart</span>
            </div>
            <CopyButton
              text="aria2c --bt-tracker='$(curl -s https://automatic-trackers.vercel.app/api/v1/trackers?format=txt | paste -sd, -)'"
              label="Copy"
            />
          </div>

          <div className="font-mono text-xs space-y-2 text-slate-300 overflow-x-auto">
            <div className="text-slate-500"># Fetch live UDP & HTTPS trackers</div>
            <div className="text-violet-300 select-all break-all">
              curl -s &apos;/api/v1/trackers?protocol=udp&apos; | head -n 5
            </div>
            <div className="text-slate-500 pt-1"># qBittorrent tier format</div>
            <div className="text-cyan-300 select-all break-all">
              curl -s &apos;/api/v1/trackers?format=tier&apos;
            </div>
          </div>
        </div>
      </div>

      {/* Live Swarm Stats */}
      <StatsGrid stats={dataset.stats} />

      {/* Interactive Tracker Studio (Formats, Protocol Tabs, 1-Click Copy/Download) */}
      <TrackerStudio
        initialTrackers={dataset.trackers}
        stats={dataset.stats}
      />

      {/* Cryptographic SHA-256 Checksum Verifier */}
      <ChecksumVerifier checksums={dataset.checksums} />

      {/* Dynamic SVG Badge Integration */}
      <BadgePreview />
    </div>
  );
}
