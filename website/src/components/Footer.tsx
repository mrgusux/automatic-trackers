import React from "react";
import { ShieldCheck, RefreshCw, Radio } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 bg-slate-950/40 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-sm text-slate-400">
          <div>
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Blacklist Sanitization
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every tracking endpoint is cross-referenced against 343+ blacklisted, dead, malware, and honey-pot
              domains. Zero blank lines and malformed URI elimination.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-violet-400" />
              Automated Swarm Cycle
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated GitHub Action aggregator runs every 3 hours across 44 high-yield public sources with live UDP
              handshakes and SHA-256 hash generation.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              P2P Protocol Compliance
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fully compliant with BEP 15 (UDP Tracker Protocol), BEP 03 (HTTP/HTTPS Tracker), and BEP 48 (WebSocket
              Tracker for WebTorrent).
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AutomaticTrackers. Open-source under MIT License.</p>
          <div className="flex items-center gap-4">
            <a href="/api/v1/trackers" className="hover:text-violet-400 transition-colors">API</a>
            <a href="/api/badge/trackers.svg" className="hover:text-violet-400 transition-colors">Live SVG Badge</a>
            <a href="https://github.com/mrgusux/automatic-trackers" className="hover:text-violet-400 transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
