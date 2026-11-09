import { NextRequest, NextResponse } from "next/server";
import { getTrackersDataset } from "@/lib/trackers-data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dataset = getTrackersDataset();

  const protocol = searchParams.get("protocol")?.toLowerCase();
  const format = searchParams.get("format")?.toLowerCase() || "txt";
  const rawLimit = searchParams.get("limit");
  const parsedLimit = rawLimit ? parseInt(rawLimit, 10) : null;
  const limit = parsedLimit !== null && !isNaN(parsedLimit) && parsedLimit > 0 ? parsedLimit : null;

  let trackers = dataset.trackers;

  // Filter protocol
  if (protocol && protocol !== "all") {
    trackers = trackers.filter((t) => t.protocol === protocol);
  }

  // Apply limit if specified
  if (limit !== null) {
    trackers = trackers.slice(0, limit);
  }

  // JSON format
  if (format === "json") {
    return NextResponse.json(
      {
        total: trackers.length,
        protocol: protocol || "all",
        stats: dataset.stats,
        trackers,
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  }

  // qBittorrent tier format (double-spaced)
  if (format === "tier") {
    const body = trackers.map((t) => t.url).join("\n\n") + "\n";
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  }

  // aria2 format
  if (format === "aria2") {
    const urls = trackers.map((t) => t.url).join(",");
    const body = `--bt-tracker="${urls}"\n`;
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  }

  // Comma-delimited format (all_trackers_comma.txt)
  if (format === "comma") {
    const body = trackers.map((t) => t.url).join(",") + "\n";
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  }

  // Default clean 1-per-line txt format
  const body = trackers.map((t) => t.url).join("\n") + "\n";
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
