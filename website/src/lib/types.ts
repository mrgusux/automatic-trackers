export type TrackerProtocol = "udp" | "https" | "http" | "ws";

export interface TrackerItem {
  url: string;
  protocol: TrackerProtocol;
  host: string;
  port: string;
  status: "online" | "degraded" | "offline";
}

export interface TrackerStats {
  total: number;
  protocols: {
    udp: number;
    https: number;
    http: number;
    ws: number;
  };
  blacklistRemoved: number;
  version: string;
  lastUpdated: string;
  updateInterval: string;
  sourcesTotal: number;
  uptime: string;
}

export interface ChecksumItem {
  hash: string;
  filename: string;
}

export interface TrackersDataset {
  stats: TrackerStats;
  checksums: ChecksumItem[];
  trackers: TrackerItem[];
}
