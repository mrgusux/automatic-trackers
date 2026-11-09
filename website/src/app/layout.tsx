import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "AutomaticTrackers — Curated High-Speed BitTorrent Tracker Hub",
  description:
    "1,234+ verified alive BitTorrent trackers with UDP BEP 15, HTTP, HTTPS, and WebSocket support. Sanitized against blacklists every 6 hours with SHA-256 integrity verification.",
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
      <body className="min-h-screen bg-[#090E19] text-white flex flex-col selection:bg-[#9E9EFF]/30 selection:text-white antialiased">
        {/* Atmospheric Space Background & Perspective Grid Floor */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Subtle Deep Navy Ambient Glow */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-[#9E9EFF]/10 via-[#070E17]/40 to-transparent rounded-full blur-3xl opacity-60" />
          {/* Grid Floor */}
          <div className="absolute inset-0 grid-floor opacity-50" />
        </div>

        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

