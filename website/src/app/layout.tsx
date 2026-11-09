import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "AutomaticTrackers — Curated High-Speed BitTorrent Tracker Hub",
  description:
    "1,234+ verified alive BitTorrent trackers with UDP BEP 15, HTTP, HTTPS, and WebSocket support. Sanitized against blacklists every 3 hours with SHA-256 integrity verification.",
  keywords: [
    "bittorrent trackers",
    "trackers list",
    "qbittorrent trackers",
    "aria2 bt-tracker",
    "udp tracker bep 15",
    "webtorrent trackers",
    "automatic trackers",
    "torrent speed boost",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090c15] text-slate-100 flex flex-col selection:bg-violet-500/30 selection:text-violet-200">
        {/* Subtle background glow */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-violet-600/10 via-indigo-600/5 to-transparent rounded-full blur-3xl opacity-70" />
          <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-3xl" />
        </div>

        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
