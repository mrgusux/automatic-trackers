"use client";

import React, { useState, useRef } from "react";
import { ChecksumItem } from "@/lib/types";
import { ShieldCheck, FileCheck, CheckCircle2, XCircle, Hash, Upload } from "lucide-react";
import { CopyButton } from "./CopyButton";

interface ChecksumVerifierProps {
  checksums: ChecksumItem[];
}

export function ChecksumVerifier({ checksums }: ChecksumVerifierProps) {
  const [inputText, setInputText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [calculatedHash, setCalculatedHash] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<ChecksumItem | null>(null);
  const [matchNotes, setMatchNotes] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const computeSha256 = async (data: BufferSource): Promise<string> => {
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsVerifying(true);
    setUploadedFileName(file.name);
    try {
      const buffer = await file.arrayBuffer();
      const hashHex = await computeSha256(buffer);
      setCalculatedHash(hashHex);

      const found = checksums.find((c) => c.hash.toLowerCase() === hashHex);
      setMatchResult(found || null);
      setMatchNotes(found ? `Exact binary byte-for-byte match with ${found.filename}` : null);
    } catch {
      setCalculatedHash("Error reading file");
      setMatchResult(null);
      setMatchNotes(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const verifyContent = async (textToVerify: string) => {
    setUploadedFileName(null);
    if (!textToVerify.trim()) {
      setCalculatedHash(null);
      setMatchResult(null);
      setMatchNotes(null);
      return;
    }

    setIsVerifying(true);
    try {
      const trimmed = textToVerify.trim();

      // Check if user pasted an existing 64-char hex hash directly
      if (/^[a-f0-9]{64}$/i.test(trimmed)) {
        const hashHex = trimmed.toLowerCase();
        setCalculatedHash(hashHex);
        const found = checksums.find((c) => c.hash.toLowerCase() === hashHex);
        setMatchResult(found || null);
        setMatchNotes(found ? `Verified direct 64-char SHA-256 hash against ${found.filename}` : null);
        return;
      }

      const encoder = new TextEncoder();
      const rawHash = await computeSha256(encoder.encode(textToVerify));

      // Test raw text
      let found = checksums.find((c) => c.hash.toLowerCase() === rawHash);
      if (found) {
        setCalculatedHash(rawHash);
        setMatchResult(found);
        setMatchNotes(`Direct match: ${found.filename}`);
        return;
      }

      // Test line-ending variations (Windows CRLF vs Unix LF and trailing newlines)
      const baseLF = textToVerify.replace(/\r\n/g, "\n");
      const variations: { label: string; text: string }[] = [
        { label: "CRLF line endings", text: baseLF.replace(/\n/g, "\r\n") },
        { label: "Unix LF line endings", text: baseLF },
        { label: "CRLF with trailing newline", text: baseLF.trimEnd().replace(/\n/g, "\r\n") + "\r\n" },
        { label: "LF with trailing newline", text: baseLF.trimEnd() + "\n" },
        { label: "Trimmed text", text: trimmed },
      ];

      for (const variant of variations) {
        const variantHash = await computeSha256(encoder.encode(variant.text));
        found = checksums.find((c) => c.hash.toLowerCase() === variantHash);
        if (found) {
          setCalculatedHash(variantHash);
          setMatchResult(found);
          setMatchNotes(`Match with ${variant.label}: ${found.filename}`);
          return;
        }
      }

      // No variation matched official checksums
      setCalculatedHash(rawHash);
      setMatchResult(null);
      setMatchNotes(null);
    } catch {
      setCalculatedHash("Error calculating hash");
      setMatchResult(null);
      setMatchNotes(null);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="glass-surface p-6 sm:p-8 rounded-[24px] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#C5CEE0]/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#9E9EFF] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Cryptographic Integrity Verification</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">SHA-256 Checksum Verifier</h2>
          <p className="text-xs text-[#898F9D] mt-1">
            Verify downloaded tracker files against signed SHA-256 digests. Prevents MITM tampering and corrupted downloads.
          </p>
        </div>
      </div>

      {/* Interactive Hash Calculator */}
      <div className="space-y-3 bg-[#070E17] p-4 sm:p-5 rounded-2xl border border-[#C5CEE0]/15">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-semibold text-[#898F9D] flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-[#9E9EFF]" />
            <span>Paste File Content / SHA-256 Hash or Upload File:</span>
          </label>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#9E9EFF]/15 hover:bg-[#9E9EFF]/25 text-[#9E9EFF] border border-[#9E9EFF]/30 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{uploadedFileName ? `Loaded: ${uploadedFileName}` : "Upload .txt File"}</span>
            </button>
          </div>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            verifyContent(e.target.value);
          }}
          placeholder="Paste downloaded tracker list text or SHA-256 hash here, or click 'Upload .txt File' above..."
          rows={3}
          className="w-full p-3 bg-[#0B0F16] border border-[#C5CEE0]/15 rounded-xl text-xs font-mono text-white placeholder-[#898F9D] focus:outline-none focus:ring-1 focus:ring-[#9E9EFF] focus:border-[#9E9EFF] transition-all resize-none"
        />

        {calculatedHash && (
          <div className="p-3.5 rounded-xl bg-[#0B0F16] border border-[#C5CEE0]/15 transition-all text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] text-[#84878C] uppercase tracking-wider">
                {uploadedFileName ? `SHA-256 (${uploadedFileName}):` : "Computed SHA-256:"}
              </div>
              <div className="text-white font-bold select-all break-all">{calculatedHash}</div>
            </div>

            {matchResult ? (
              <div className="flex flex-col sm:items-end gap-1 shrink-0">
                <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5 font-sans font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>MATCH: {matchResult.filename}</span>
                </div>
                {matchNotes && (
                  <span className="text-[10px] text-[#898F9D] font-sans">{matchNotes}</span>
                )}
              </div>
            ) : (
              <div className="px-3.5 py-1.5 rounded-full bg-[#070E17] border border-[#C5CEE0]/20 text-[#898F9D] flex items-center gap-1.5 shrink-0 font-sans font-semibold text-xs">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>No Match (Custom Content)</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Official Signatures Table */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
          Official SHA-256 Release Hashes (SHA256SUMS.txt)
        </h4>
        <div className="divide-y divide-[#C5CEE0]/10 border border-[#C5CEE0]/15 rounded-2xl overflow-hidden bg-[#070E17]">
          {checksums.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#9E9EFF]/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#9E9EFF] shrink-0" />
                <span className="text-xs font-semibold text-white font-mono">{item.filename}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#898F9D] select-all truncate max-w-xs sm:max-w-md">
                  {item.hash}
                </span>
                <CopyButton text={item.hash} label="Hash" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

