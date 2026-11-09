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
      color: "text-violet-400",
      bg: "bg-violet-500/10 border-violet-500/20",
    },
    {
      label: "UDP Trackers (BEP 15)",
      value: stats.protocols.udp.toLocaleString(),
      sub: "Low-overhead Datagrams",
      icon: Zap,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "HTTP & HTTPS Trackers",
      value: (stats.protocols.http + stats.protocols.https).toLocaleString(),
      sub: `${stats.protocols.https} HTTPS / ${stats.protocols.http} HTTP`,
      icon: Layers,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      label: "Blacklist Eliminated",
      value: `${stats.blacklistRemoved} Hosts`,
      sub: "Dead & Malicious Purged",
      icon: ShieldCheck,
      color: "text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="glass-card p-4 rounded-2xl flex items-center gap-3.5 relative overflow-hidden"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${c.bg}`}>
              <Icon className={`w-5 h-5 ${c.color}`} />
            </div>
            <div className="min-w-0">
              <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {c.value}
              </div>
              <div className="text-xs font-medium text-slate-400 truncate">{c.label}</div>
              <div className="text-[10px] text-slate-500 truncate">{c.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
