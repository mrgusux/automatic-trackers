import React from "react";
import { getTrackersDataset } from "@/lib/trackers-data";
import { StatsGrid } from "@/components/StatsGrid";
import { TrackerStudio } from "@/components/TrackerStudio";
import { ChecksumVerifier } from "@/components/ChecksumVerifier";
import { BadgePreview } from "@/components/BadgePreview";
import { CopyButton } from "@/components/CopyButton";
import { Radio } from "lucide-react";

export default function HomePage() {
  const dataset = getTrackersDataset();

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="relative pt-4 pb-2 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#070E17] border border-[#9E9EFF]/40 text-[#9E9EFF] text-xs font-semibold shadow-lg shadow-[#9E9EFF]/5">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#9E9EFF]" />
            <span>High-Yield BitTorrent Swarm Optimizing Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Curated BitTorrent <br className="hidden sm:inline" />
            <span className="text-[#9E9EFF]">
              Tracker Aggregator
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#898F9D] leading-relaxed max-w-xl">
            Rebuilt every 6 hours from 95+ community sources. Purged of 241+ dead, malicious, and flooded trackers via 391 blacklist rules.
            Instant 1-click formats for qBittorrent tier balancing, aria2 CLI, and live SVG badges.
          </p>
        </div>

        {/* Quick Start Terminal Box (Glassmorphic 24px surface) */}
        <div className="w-full md:w-[440px] glass-surface rounded-[24px] p-5 relative overflow-hidden text-left">
          <div className="flex items-center justify-between pb-3 border-b border-[#C5CEE0]/10 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#C5CEE0]/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#C5CEE0]/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#9E9EFF]/60" />
              <span className="text-[11px] font-mono text-[#898F9D] ml-2 font-medium">aria2 &amp; curl quickstart</span>
            </div>
            <CopyButton
              text="aria2c --bt-tracker='$(curl -s https://automatic-trackers.vercel.app/api/v1/trackers?format=txt | paste -sd, -)'"
              label="Copy"
            />
          </div>

          <div className="font-mono text-xs space-y-2 text-white overflow-x-auto bg-[#070E17] p-3 rounded-xl border border-[#C5CEE0]/10">
            <div className="text-[#84878C]"># Fetch live UDP &amp; HTTPS trackers</div>
            <div className="text-[#9E9EFF] select-all break-all">
              curl -s &apos;/api/v1/trackers?protocol=udp&apos; | head -n 5
            </div>
            <div className="text-[#84878C] pt-1"># qBittorrent tier format</div>
            <div className="text-white select-all break-all">
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

