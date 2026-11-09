import React from "react";
import { Radio, ShieldCheck, Activity, Layers, Zap } from "lucide-react";
import { TrackerStats } from "@/lib/types";

interface StatsGridProps {
  stats: TrackerStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const cards = [
    {
      label: "Active Trackers",
      value: stats.total.toLocaleString(),
      sub: "Verified Live Peers",
      icon: Radio,
      iconColor: "text-[#9E9EFF]",
      badgeBorder: "border-[#9E9EFF]/40",
    },
    {
      label: "UDP Trackers (BEP 15)",
      value: stats.protocols.udp.toLocaleString(),
      sub: "Low-overhead Datagrams",
      icon: Zap,
      iconColor: "text-white",
      badgeBorder: "border-[#C5CEE0]/20",
    },
    {
      label: "HTTP & HTTPS Trackers",
      value: (stats.protocols.http + stats.protocols.https).toLocaleString(),
      sub: `${stats.protocols.https} HTTPS / ${stats.protocols.http} HTTP`,
      icon: Layers,
      iconColor: "text-[#9E9EFF]",
      badgeBorder: "border-[#C5CEE0]/20",
    },
    {
      label: "Blacklist Eliminated",
      value: `${stats.blacklistRemoved} Hosts`,
      sub: "Dead & Malicious Purged",
      icon: ShieldCheck,
      iconColor: "text-[#898F9D]",
      badgeBorder: "border-[#C5CEE0]/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="glass-card p-4 sm:p-5 rounded-[20px] flex items-center gap-3.5 relative overflow-hidden"
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 bg-[#070E17] border ${c.badgeBorder}`}>
              <Icon className={`w-5 h-5 ${c.iconColor}`} />
            </div>
            <div className="min-w-0">
              <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-sans">
                {c.value}
              </div>
              <div className="text-xs font-medium text-[#898F9D] truncate">{c.label}</div>
              <div className="text-[10px] text-[#84878C] truncate font-mono">{c.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

