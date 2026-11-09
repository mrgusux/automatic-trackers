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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#070E17]/95 text-white border border-[#9E9EFF]/50 shadow-2xl backdrop-blur-xl text-xs font-semibold">
          <Check className="w-4 h-4 text-[#9E9EFF]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Control Console */}
      <div className="glass-surface p-6 sm:p-8 rounded-[24px] space-y-6">
        {/* Search Bar + Protocol Tabs */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#898F9D]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tracker by domain, port (e.g. 1337, rarbg, tracker.opentrackr)..."
              className="w-full pl-11 pr-4 py-2.5 bg-[#070E17] border border-[#C5CEE0]/20 rounded-full text-sm text-white placeholder-[#898F9D] focus:outline-none focus:ring-1 focus:ring-[#9E9EFF] focus:border-[#9E9EFF] transition-all"
            />
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#070E17] border border-[#C5CEE0]/20 text-xs text-[#898F9D] shrink-0 font-mono">
            <span>Matching:</span>
            <span className="font-bold text-[#9E9EFF]">{filteredTrackers.length}</span>
            <span className="text-[#84878C]">/ {stats.total}</span>
          </div>
        </div>

        {/* Protocol Filter Tabs (Segmented Capsule Control) */}
        <div className="pt-4 border-t border-[#C5CEE0]/15 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-[#898F9D] uppercase tracking-wider mr-1">Protocol:</span>
          <div className="inline-flex flex-wrap items-center gap-1.5 p-1 bg-[#070E17] border border-[#C5CEE0]/20 rounded-full">
            {protocols.map((proto) => {
              const isActive = selectedProto === proto.id;
              return (
                <button
                  key={proto.id}
                  onClick={() => setSelectedProto(proto.id)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs transition-all ${
                    isActive
                      ? "bg-white text-black font-bold shadow-md"
                      : "text-[#898F9D] hover:text-white font-medium"
                  }`}
                >
                  <span>{proto.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? "bg-black/10 text-black font-bold" : "bg-white/10 text-[#898F9D]"
                    }`}
                  >
                    {proto.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Format Selector Bar */}
        <div className="pt-4 border-t border-[#C5CEE0]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-[#898F9D] uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#9E9EFF]" />
              <span>Target Output Format</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "single", label: "Clean 1-per-line (Standard)" },
                { id: "tier", label: "qBittorrent Tier Format" },
                { id: "aria2", label: "aria2 Command (--bt-tracker)" },
                { id: "comma", label: "Comma-Delimited" },
              ].map((fmt) => {
                const isActive = selectedFormat === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt.id as any)}
                    className={`px-4 py-1.5 rounded-full text-xs transition-all ${
                      isActive
                        ? "bg-white text-black font-bold shadow-sm"
                        : "bg-[#070E17] hover:bg-[#111A2C] text-[#898F9D] hover:text-white border border-[#C5CEE0]/15 font-medium"
                    }`}
                  >
                    {fmt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 pt-2 sm:pt-0">
            <button
              onClick={handleCopyFormatted}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-slate-200 text-black font-bold text-xs transition-all shadow-lg shadow-white/5 active:scale-95"
            >
              <Copy className="w-3.5 h-3.5 text-black" />
              <span>Copy All ({filteredTrackers.length})</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#070E17] hover:bg-[#111A2C] text-white border border-[#C5CEE0]/25 font-semibold text-xs transition-colors active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-[#9E9EFF]" />
              <span>Download .txt</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Formatted Output Preview Console */}
      <div className="glass-surface p-5 sm:p-6 rounded-[24px] space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-[#898F9D] pb-2 border-b border-[#C5CEE0]/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#9E9EFF] animate-pulse" />
            <span className="text-white font-semibold">Live Preview — {selectedFormat.toUpperCase()}</span>
          </div>
          <span className="text-[11px] text-[#84878C]">
            {selectedFormat === "tier"
              ? "Each tracker separated by \\n\\n for client tier balancing"
              : selectedFormat === "aria2"
              ? "Flag formatted for aria2c CLI downloads"
              : selectedFormat === "comma"
              ? "Comma-delimited URLs for aria2/curl/wget scripts"
              : "Standard newline-separated announce list"}
          </span>
        </div>

        <div className="bg-[#070E17] p-4 rounded-xl border border-[#C5CEE0]/10 max-h-40 overflow-y-auto font-mono text-xs text-white leading-relaxed">
          <pre className="whitespace-pre-wrap select-all break-all">
            {formattedContent.slice(0, 1500)}
            {formattedContent.length > 1500 ? "\n... [truncated in preview — click 'Copy All' or 'Download .txt']" : ""}
          </pre>
        </div>
      </div>

      {/* Detailed Tracker Explorer Table */}
      <div className="glass-surface rounded-[24px] overflow-hidden space-y-0">
        <div className="px-6 py-4 bg-[#070E17] border-b border-[#C5CEE0]/15 flex items-center justify-between">
          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#9E9EFF]" />
            <span>Active Swarm Announce Endpoints</span>
          </h3>
          <span className="text-xs text-[#898F9D] font-mono">Showing {Math.min(filteredTrackers.length, 100)} trackers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-[#070E17]/60 border-b border-[#C5CEE0]/15 text-[#898F9D] uppercase text-[10px] tracking-wider">
                <th className="py-3 px-5">Protocol</th>
                <th className="py-3 px-5">Tracker URL</th>
                <th className="py-3 px-5">Host / Port</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C5CEE0]/10">
              {filteredTrackers.slice(0, 100).map((tracker, idx) => (
                <tr key={idx} className="hover:bg-[#9E9EFF]/5 transition-colors text-white">
                  <td className="py-3 px-5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono ${
                        tracker.protocol === "udp"
                          ? "bg-white/10 text-white border border-white/20"
                          : tracker.protocol === "https"
                          ? "bg-[#9E9EFF]/15 text-[#9E9EFF] border border-[#9E9EFF]/30"
                          : tracker.protocol === "ws"
                          ? "bg-[#9E9EFF]/20 text-[#9E9EFF] border border-[#9E9EFF]/40"
                          : "bg-white/5 text-[#898F9D] border border-white/10"
                      }`}
                    >
                      {tracker.protocol}
                    </span>
                  </td>

                  <td className="py-3 px-5 max-w-md truncate text-white font-medium">
                    {tracker.url}
                  </td>

                  <td className="py-3 px-5 text-[#898F9D]">
                    <span>{tracker.host}</span>
                    {tracker.port && <span className="text-[#9E9EFF]">:{tracker.port}</span>}
                  </td>

                  <td className="py-3 px-5 font-sans">
                    <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Online</span>
                    </div>
                  </td>

                  <td className="py-3 px-5 text-right">
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
            <div className="p-12 text-center text-[#898F9D]">
              <Radio className="w-8 h-8 mx-auto mb-2 opacity-50 text-[#898F9D]" />
              <p className="text-sm font-semibold text-white">No trackers matched your current search filters.</p>
            </div>
          )}

          {filteredTrackers.length > 100 && (
            <div className="p-3 bg-[#070E17] border-t border-[#C5CEE0]/15 text-center text-xs text-[#898F9D]">
              Showing top 100 of {filteredTrackers.length} trackers. Use "Copy All" or "Download .txt" above for the full dataset.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

