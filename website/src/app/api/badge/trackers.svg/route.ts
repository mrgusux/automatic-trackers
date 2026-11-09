import { NextRequest, NextResponse } from "next/server";
import { getTrackersDataset } from "@/lib/trackers-data";

export const dynamic = "force-dynamic";

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

function sanitizeColor(raw: string | null): string {
  if (!raw) return "#10b981";
  const trimmed = raw.trim();
  if (/^#?[0-9a-fA-F]{3,8}$/.test(trimmed)) {
    return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  }
  if (/^[a-zA-Z]{3,20}$/.test(trimmed)) {
    return trimmed;
  }
  return "#10b981";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dataset = getTrackersDataset();

  const rawLabel = (searchParams.get("label") || "trackers").slice(0, 60);
  const customCount = searchParams.get("count");
  const rawCountText = (customCount || `${dataset.stats.total.toLocaleString()} live`).slice(0, 60);
  const color = sanitizeColor(searchParams.get("color"));

  const label = escapeXml(rawLabel);
  const countText = escapeXml(rawCountText);

  // Calculate approximate pixel widths based on text length
  const labelWidth = Math.max(rawLabel.length * 7 + 14, 56);
  const valueWidth = Math.max(rawCountText.length * 7 + 14, 64);
  const totalWidth = labelWidth + valueWidth;

  const labelCenter = labelWidth / 2;
  const valueCenter = labelWidth + valueWidth / 2;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${countText}">
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="4" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#1e293b"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">
    <text aria-hidden="true" x="${labelCenter}" y="15" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="${labelCenter}" y="14">${label}</text>
    <text aria-hidden="true" x="${valueCenter}" y="15" fill="#010101" fill-opacity=".3">${countText}</text>
    <text x="${valueCenter}" y="14">${countText}</text>
  </g>
</svg>`;

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
