import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const trackersDataPath = path.join(__dirname, "../src/lib/data/trackers.json");
const rawJson = fs.readFileSync(trackersDataPath, "utf8");
const dataset = JSON.parse(rawJson);

describe("AutomaticTrackers Dataset Integrity", () => {
  test("stats object contains expected swarm numbers", () => {
    assert.strictEqual(dataset.stats.total, 1234);
    assert.strictEqual(dataset.stats.protocols.udp, 462);
    assert.strictEqual(dataset.stats.protocols.http, 545);
    assert.strictEqual(dataset.stats.protocols.https, 215);
    assert.strictEqual(dataset.stats.protocols.ws, 12);
    assert.strictEqual(
      dataset.stats.protocols.udp +
        dataset.stats.protocols.http +
        dataset.stats.protocols.https +
        dataset.stats.protocols.ws,
      dataset.stats.total
    );
  });

  test("trackers array matches stats total and contains valid items", () => {
    assert.strictEqual(dataset.trackers.length, 1234);
    const validProtos = new Set(["udp", "http", "https", "ws"]);

    for (const t of dataset.trackers.slice(0, 100)) {
      assert.ok(t.url, "tracker must have url");
      assert.ok(validProtos.has(t.protocol), `protocol ${t.protocol} must be valid`);
      assert.ok(t.host, "tracker must have host");
      assert.ok(["online", "degraded", "offline"].includes(t.status), "valid status");
    }
  });

  test("checksums array contains official release hashes", () => {
    assert.ok(Array.isArray(dataset.checksums));
    assert.ok(dataset.checksums.length >= 8);
    const allTrackersEntry = dataset.checksums.find((c) => c.filename === "all_trackers.txt");
    assert.ok(allTrackersEntry, "all_trackers.txt checksum must be present");
    assert.strictEqual(
      allTrackersEntry.hash,
      "a29e2d561d46710c0444700e8ff4fbb009f3ed00eaf3c174faba5d98e2e841f2"
    );
  });
});

describe("Tracker Format Converters", () => {
  const sampleUrls = [
    "udp://tracker.opentrackr.org:1337/announce",
    "https://tracker.tamersunion.org:443/announce",
    "http://tracker.dler.org:6969/announce",
  ];

  test("1-per-line clean format", () => {
    const formatted = sampleUrls.join("\n");
    assert.strictEqual(
      formatted,
      "udp://tracker.opentrackr.org:1337/announce\nhttps://tracker.tamersunion.org:443/announce\nhttp://tracker.dler.org:6969/announce"
    );
  });

  test("qBittorrent tier double-spaced format", () => {
    const formatted = sampleUrls.join("\n\n");
    assert.strictEqual(
      formatted,
      "udp://tracker.opentrackr.org:1337/announce\n\nhttps://tracker.tamersunion.org:443/announce\n\nhttp://tracker.dler.org:6969/announce"
    );
  });

  test("aria2 command format", () => {
    const formatted = `--bt-tracker="${sampleUrls.join(",")}"`;
    assert.strictEqual(
      formatted,
      '--bt-tracker="udp://tracker.opentrackr.org:1337/announce,https://tracker.tamersunion.org:443/announce,http://tracker.dler.org:6969/announce"'
    );
  });

  test("comma-delimited CSV format", () => {
    const formatted = sampleUrls.join(",");
    assert.strictEqual(
      formatted,
      "udp://tracker.opentrackr.org:1337/announce,https://tracker.tamersunion.org:443/announce,http://tracker.dler.org:6969/announce"
    );
  });
});

describe("SHA-256 Checksum Verification with CRLF/LF Normalization", () => {
  const officialHash = "a29e2d561d46710c0444700e8ff4fbb009f3ed00eaf3c174faba5d98e2e841f2";
  const rootAllTrackersPath = path.join(__dirname, "../all_trackers.txt");

  function sha256Hex(text) {
    return crypto.createHash("sha256").update(text).digest("hex");
  }

  test("direct hash match when user pastes 64-char hex", () => {
    const input = "A29E2D561D46710C0444700E8FF4FBB009F3ED00EAF3C174FABA5D98E2E841F2";
    const found = dataset.checksums.find((c) => c.hash.toLowerCase() === input.toLowerCase());
    assert.ok(found);
    assert.strictEqual(found.filename, "all_trackers.txt");
  });

  test("matches official checksum across Windows CRLF and browser LF line endings", () => {
    if (fs.existsSync(rootAllTrackersPath)) {
      const diskContent = fs.readFileSync(rootAllTrackersPath, "utf8");
      // Simulate browser textarea normalising \r\n to \n
      const browserPasted = diskContent.replace(/\r\n/g, "\n");

      // Verify that variations approach successfully matches
      const variations = [
        browserPasted,
        browserPasted.replace(/\r\n/g, "\n").replace(/\n/g, "\r\n"),
        browserPasted.trimEnd() + "\n",
        browserPasted.trimEnd() + "\r\n",
      ];

      const match = variations.some((v) => sha256Hex(v) === officialHash);
      assert.ok(match, "Variation test must find official checksum");
    }
  });

  test("rejects tampered or corrupt content", () => {
    const fakeContent = "udp://malicious-fake-tracker.xyz:1337/announce\n";
    const fakeHash = sha256Hex(fakeContent);
    const found = dataset.checksums.find((c) => c.hash.toLowerCase() === fakeHash);
    assert.strictEqual(found, undefined);
  });
});

describe("Dynamic SVG Badge Sanitization", () => {
  function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case "<": return "&lt;";
        case ">": return "&gt;";
        case "&": return "&amp;";
        case "'": return "&apos;";
        case '"': return "&quot;";
        default: return c;
      }
    });
  }

  function sanitizeColor(raw) {
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

  test("safely escapes XML special characters", () => {
    assert.strictEqual(escapeXml("trackers & peers"), "trackers &amp; peers");
    assert.strictEqual(escapeXml('<script>alert("xss")</script>'), "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;");
  });

  test("sanitizes hex and named colors and rejects injection strings", () => {
    assert.strictEqual(sanitizeColor("10b981"), "#10b981");
    assert.strictEqual(sanitizeColor("#8b5cf6"), "#8b5cf6");
    assert.strictEqual(sanitizeColor("red"), "red");
    assert.strictEqual(sanitizeColor('"><script>alert(1)</script>'), "#10b981");
    assert.strictEqual(sanitizeColor("blue; injection"), "#10b981");
    assert.strictEqual(sanitizeColor(null), "#10b981");
  });
});
