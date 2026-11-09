import React from "react";
import { ShieldCheck, RefreshCw, Radio } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[#C5CEE0]/15 bg-[#0B0F16]/90 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-sm">
          <div className="bg-[#070E17] border border-[#C5CEE0]/15 rounded-2xl p-4 sm:p-5">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2 text-sm">
              <ShieldCheck className="w-4 h-4 text-[#9E9EFF]" />
              Blacklist Sanitization
            </h4>
            <p className="text-xs text-[#898F9D] leading-relaxed">
              Every tracking endpoint is cross-referenced against 391 blocklist entries, actively purging 241+ dead,
              malicious, and honeypot trackers. Zero blank lines and malformed URI elimination.
            </p>
          </div>

          <div className="bg-[#070E17] border border-[#C5CEE0]/15 rounded-2xl p-4 sm:p-5">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2 text-sm">
              <RefreshCw className="w-4 h-4 text-[#9E9EFF]" />
              Automated Swarm Cycle
            </h4>
            <p className="text-xs text-[#898F9D] leading-relaxed">
              Automated GitHub Actions aggregator runs every 6 hours across 95+ community sources with live UDP
              handshakes and SHA-256 hash generation.
            </p>
          </div>

          <div className="bg-[#070E17] border border-[#C5CEE0]/15 rounded-2xl p-4 sm:p-5">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2 text-sm">
              <Radio className="w-4 h-4 text-[#9E9EFF]" />
              P2P Protocol Compliance
            </h4>
            <p className="text-xs text-[#898F9D] leading-relaxed">
              Fully compliant with BEP 15 (UDP Tracker Protocol), BEP 03 (HTTP/HTTPS Tracker), and BEP 48 (WebSocket
              Tracker for WebTorrent).
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-[#C5CEE0]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#84878C]">
          <p>© {new Date().getFullYear()} AutomaticTrackers. Open-source under MIT License.</p>
          <div className="flex items-center gap-5">
            <a href="/api/v1/trackers" className="hover:text-[#9E9EFF] transition-colors">API</a>
            <a href="/api/badge/trackers.svg" className="hover:text-[#9E9EFF] transition-colors">Live SVG Badge</a>
            <a href="https://github.com/mrgusux/automatic-trackers" target="_blank" rel="noopener noreferrer" className="hover:text-[#9E9EFF] transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

