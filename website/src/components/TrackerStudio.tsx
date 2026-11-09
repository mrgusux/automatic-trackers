"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Copy,
  Download,
  Check,
  Radio,
  Sparkles,
  Layers,
  Terminal,
  ExternalLink,
  Filter,
  FileText,
  Cpu,
  ShieldCheck,
} from "lucide-react";
import { TrackerItem, TrackerStats, TrackerProtocol } from "@/lib/types";
import { CopyButton } from "./CopyButton";

interface TrackerStudioProps {
  initialTrackers: TrackerItem[];
  stats: TrackerStats;
}

export function TrackerStudio({ initialTrackers, stats }: TrackerStudioProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProto, setSelectedProto] = useState<string>("all");
  const [selectedFormat, setSelectedFormat] = useState<"single" | "tier" | "aria2" | "comma">("single");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const protocols: { id: string; label: string; count: number }[] = [
    { id: "all", label: "All Protocols", count: stats.total },
    { id: "udp", label: "UDP (BEP 15)", count: stats.protocols.udp },
    { id: "https", label: "HTTPS (BEP 03)", count: stats.protocols.https },
    { id: "http", label: "HTTP (BEP 03)", count: stats.protocols.http },
    { id: "ws", label: "WebSocket (BEP 48)", count: stats.protocols.ws },
  ];

  const filteredTrackers = useMemo(() => {
    return initialTrackers.filter((t) => {
      if (selectedProto !== "all" && t.protocol !== selectedProto) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (!t.url.toLowerCase().includes(term) && !t.host.toLowerCase().includes(term)) {
          return false;
        }
      }
      return true;
    });
  }, [initialTrackers, selectedProto, searchTerm]);

  // Formatted Output Generation
  const formattedContent = useMemo(() => {
    const urls = filteredTrackers.map((t) => t.url);
    if (selectedFormat === "tier") {
      // qBittorrent tier format: separated by an empty line (\n\n)
      return urls.join("\n\n");
    } else if (selectedFormat === "aria2") {
      // aria2 format: --bt-tracker="url1,url2,url3"
      return `--bt-tracker="${urls.join(",")}"`;
    } else if (selectedFormat === "comma") {
      // Comma-delimited format
      return urls.join(",");
    } else {
      // Clean 1-per-line
      return urls.join("\n");
    }
  }, [filteredTrackers, selectedFormat]);

  // 1-Click Copy Formatted Output
  const handleCopyFormatted = async () => {
    if (filteredTrackers.length === 0) {
      showToast("No trackers match current filters to copy.");
      return;
    }

    let success = false;
    if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(formattedContent);
        success = true;
      } catch {
        // Fallback below
      }
    }

    if (!success && typeof document !== "undefined") {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = formattedContent;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        success = document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {
        success = false;
      }
    }

    if (success) {
      const formatLabel =
        selectedFormat === "tier"
          ? "qBittorrent (Tiered)"
          : selectedFormat === "aria2"
          ? "aria2"
          : selectedFormat === "comma"
          ? "Comma-Delimited"
          : "1-per-line";
      showToast(`Copied ${filteredTrackers.length} trackers formatted for ${formatLabel}!`);
    } else {
      showToast("Unable to copy to clipboard.");
    }
  };

  // 1-Click Download .txt
  const handleDownload = () => {
    if (filteredTrackers.length === 0) {
      showToast("No trackers match current filters to download.");
      return;
    }

    const filename =
      selectedFormat === "tier"
        ? "trackers_qbittorrent_tier.txt"
        : selectedFormat === "aria2"
        ? "trackers_aria2.txt"
        : selectedFormat === "comma"
        ? "all_trackers_comma.txt"
        : "all_trackers.txt";

    const blob = new Blob([formattedContent + "\n"], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-violet-950/90 text-violet-200 border border-violet-500/40 shadow-2xl backdrop-blur-xl text-xs font-semibold">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Control Console */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10 space-y-5">
        {/* Search Bar + Protocol Tabs */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tracker by domain, port (e.g. 1337, rarbg, tracker.opentrackr)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
            />
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-white/5 text-xs text-slate-400 shrink-0">
            <span>Matching:</span>
            <span className="font-mono font-bold text-violet-300">{filteredTrackers.length}</span>
            <span className="text-slate-500">/ {stats.total}</span>
          </div>
        </div>

        {/* Protocol Filter Tabs */}
        <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">Protocol:</span>
          {protocols.map((proto) => (
            <button
              key={proto.id}
              onClick={() => setSelectedProto(proto.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedProto === proto.id
                  ? "bg-violet-600 text-white font-bold shadow-md shadow-violet-600/30"
                  : "bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-white/5"
              }`}
            >
              <span>{proto.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedProto === proto.id ? "bg-white/20 text-white" : "bg-white/5 text-slate-400"
                }`}
              >
                {proto.count}
              </span>
            </button>
          ))}
        </div>

        {/* Format Selector Bar */}
        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3 h-3 text-cyan-400" />
              <span>Target Output Format</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedFormat("single")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedFormat === "single"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "bg-slate-900/60 hover:bg-slate-800 text-slate-400 border border-white/5"
                }`}
              >
                Clean 1-per-line (Standard)
              </button>
              <button
                onClick={() => setSelectedFormat("tier")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedFormat === "tier"
                    ? "bg-violet-500/20 text-violet-300 border border-violet-500/40"
                    : "bg-slate-900/60 hover:bg-slate-800 text-slate-400 border border-white/5"
                }`}
              >
                qBittorrent Tier Format (Double-Spaced)
              </button>
              <button
                onClick={() => setSelectedFormat("aria2")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedFormat === "aria2"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-slate-900/60 hover:bg-slate-800 text-slate-400 border border-white/5"
                }`}
              >
                aria2 Command (--bt-tracker)
              </button>
              <button
                onClick={() => setSelectedFormat("comma")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedFormat === "comma"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-slate-900/60 hover:bg-slate-800 text-slate-400 border border-white/5"
                }`}
              >
                Comma-Delimited (CSV / All)
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyFormatted}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-all shadow-md shadow-violet-600/20"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy All ({filteredTrackers.length})</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 font-semibold text-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .txt</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Formatted Output Preview Console */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
            <span className="text-white font-semibold">Live Preview — {selectedFormat.toUpperCase()}</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {selectedFormat === "tier"
              ? "Each tracker separated by \\n\\n for client tier balancing"
              : selectedFormat === "aria2"
              ? "Flag formatted for aria2c CLI downloads"
              : selectedFormat === "comma"
              ? "Comma-delimited URLs for aria2/curl/wget scripts"
              : "Standard newline-separated announce list"}
          </span>
        </div>

        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-white/5 max-h-40 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed">
          <pre className="whitespace-pre-wrap select-all break-all">
            {formattedContent.slice(0, 1500)}
            {formattedContent.length > 1500 ? "\n... [truncated in preview — click 'Copy All' or 'Download .txt']" : ""}
          </pre>
        </div>
      </div>

      {/* Detailed Tracker Explorer Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden space-y-0">
        <div className="px-5 py-3 bg-slate-950/80 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-violet-400" />
            <span>Active Swarm Announce Endpoints</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Showing {Math.min(filteredTrackers.length, 100)} trackers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-slate-950/40 border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Protocol</th>
                <th className="py-3 px-4">Tracker URL</th>
                <th className="py-3 px-4">Host / Port</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTrackers.slice(0, 100).map((tracker, idx) => (
                <tr key={idx} className="hover:bg-white/[0.03] transition-colors text-slate-300">
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        tracker.protocol === "udp"
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : tracker.protocol === "https"
                          ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                          : tracker.protocol === "ws"
                          ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                          : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {tracker.protocol}
                    </span>
                  </td>

                  <td className="py-3 px-4 max-w-md truncate text-white font-medium">
                    {tracker.url}
                  </td>

                  <td className="py-3 px-4 text-slate-400">
                    <span>{tracker.host}</span>
                    {tracker.port && <span className="text-violet-400">:{tracker.port}</span>}
                  </td>

                  <td className="py-3 px-4 font-sans">
                    <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Online</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <CopyButton
                      text={tracker.url}
                      label="Copy"
                      onCopied={() => showToast(`Copied ${tracker.url}!`)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTrackers.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <Radio className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-slate-400">No trackers matched your current search filters.</p>
            </div>
          )}

          {filteredTrackers.length > 100 && (
            <div className="p-3 bg-slate-950/60 border-t border-white/5 text-center text-xs text-slate-400">
              Showing top 100 of {filteredTrackers.length} trackers. Use "Copy All" or "Download .txt" above for the full dataset.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
