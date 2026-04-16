#!/usr/bin/env node
// @ts-nocheck
/**
 * Fetch Draft Documents Script
 *
 * Iterates through an array of document identifiers and fetches the draft version
 * of each document from the CBD API.
 *
 * API endpoint: /api/v2013/documents/{identifier}/versions/draft?include-deleted=true
 *
 * Requirements: Node >= 18 (global fetch)
 *
 * Usage:
 *   export CBD_TOKEN="BearerTokenForDrafts"
 *   node fetch-draft-documents.js
 *
 * Optional env vars:
 *   CONCURRENCY=4 (number of parallel requests)
 *   OUTPUT_FILE=draft-documents.json (output file path)
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

// -------------------- CONFIG --------------------
const API_BASE = "https://api.cbd.int/api/v2013";

// Draft token (required for authentication)
const DRAFTS_TOKEN = process.env.CBD_TOKEN || "";

// Concurrency control
const CONCURRENCY = Number(process.env.CONCURRENCY || 4);

// Output file
const OUTPUT_FILE = process.env.OUTPUT_FILE || "draft-documents.json";

// -------------------- IDENTIFIERS TO FETCH --------------------
// Replace this array with your actual identifiers
const IDENTIFIERS = [
  // Example identifiers - replace with your actual identifiers
// "6D9F7DAC-5ED9-C888-F9D5-F7B606A9B21D",
// "206674B4-44A2-982A-7003-BFCF32CD6539",
"39A4CC05-4565-5ED1-E2E1-F7F16BF9772A"
// "7E0A678D-EC87-ACFB-ED5E-6CF05CD89298",
// "C1A620B0-9D2A-B6B7-BDA6-67A69FD32288",
// "8849C9E9-E78A-C042-1795-1876879F1A0E",
// "0ADA8309-A1DE-8494-BED0-CEE998F3A1BF",
// "48A1C8FD-28F9-7206-E041-CCBC20D29840",
// "AC6B794F-1176-5BD3-9057-3153D9F2F0F0",
// "BE8A0347-4F9B-ECA5-8623-53EAB322E8E9",
// "5D139C6D-469C-5CE2-9C0D-BF8B6BADEC90",
// "2DD77046-B393-4EA0-2A33-B0638980111A",
// "D8503E76-2991-A807-8F65-70D64D47D991",
// "B877252B-B308-3AD8-C07E-BE99065F877E",
// "9981AF33-CAF2-0953-7793-4041363D38AE",
// "892A7620-19C8-C513-F2F8-AA35ED937421",
// "FAE8C371-88D1-40B0-B40C-79F23B7EA0A7",
// "3A46F5D0-7569-E5C3-657F-2DA42C7B9202",
// "D14F1650-ED80-9B4F-4857-5DA193B0BF7F",
// "DE5C4C76-1C42-0BF3-8FA4-3E5F98F77823",
// "05BAD64E-695C-7640-1F9D-C6F21D49444E",
// "3393FED3-7FF0-E37F-E739-8E36832EBC6E",
// "E7FE361B-E712-7A6B-918B-0B5D3606A326",
// "6CC5B692-525A-B75D-BB92-EB146E85A189",
// "EE4B05A3-35E8-498D-64E5-3F9D244132BD",
// "2D715086-E6FA-5675-AD21-63CD42DDF009",
// "27529264-6312-8487-3519-D66E43B78134"
];

// -------------------- UTILITIES --------------------
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJson(url, { headers = {}, retries = 4 } = {}) {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try {
      // Keep realm header (ORT) as required by the API
      headers["realm"] = "ORT";

      const res = await fetch(url, { headers });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} - ${txt.slice(0, 300)}`);
      }
      return await res.json();
    } catch (e) {
      lastErr = e;
      // Exponential backoff
      await sleep(250 * Math.pow(2, i));
    }
  }
  throw lastErr;
}

function createLimiter(limit) {
  let active = 0;
  const queue = [];
  const next = () => {
    if (active >= limit || queue.length === 0) return;
    active++;
    const { fn, resolve, reject } = queue.shift();
    fn()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        active--;
        next();
      });
  };
  return (fn) =>
    new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      next();
    });
}

const limit = createLimiter(CONCURRENCY);

// -------------------- API CALLS --------------------
async function getDraftDocument(identifier) {
  const url = `${API_BASE}/documents/${encodeURIComponent(identifier)}/versions/draft?include-deleted=true`;
  const headers = {'realm': 'ORT' };

  if (DRAFTS_TOKEN) {
    headers["Authorization"] = `Bearer ${DRAFTS_TOKEN}`;
  }

  return fetchJson(url, { headers });
}

// -------------------- MAIN --------------------
async function main() {
  if (!DRAFTS_TOKEN) {
    console.warn("⚠️  WARNING: CBD_TOKEN env var is not set. Draft requests will likely fail (auth required).");
  }

  if (IDENTIFIERS.length === 0) {
    console.error("❌ ERROR: No identifiers provided. Please add identifiers to the IDENTIFIERS array in the script.");
    process.exit(1);
  }

  console.log(`Fetching ${IDENTIFIERS.length} draft documents...`);
  console.log(`Concurrency: ${CONCURRENCY}`);
  console.log("");

  const results = [];
  let successCount = 0;
  let errorCount = 0;

  // Process all identifiers with concurrency control
  await Promise.all(
    IDENTIFIERS.map((identifier, index) =>
      limit(async () => {
        try {
          console.log(`[${index + 1}/${IDENTIFIERS.length}] Fetching: ${identifier}`);
          const draftDoc = await getDraftDocument(identifier);

          results.push({
            identifier,
            status: "success",
            data: draftDoc
          });

          successCount++;
          console.log(`  ✅ Success: ${identifier}`);
        } catch (error) {
          results.push({
            identifier,
            status: "error",
            error: error.message
          });

          errorCount++;
          console.error(`  ❌ Error: ${identifier} - ${error.message}`);
        }
      })
    )
  );

  // Sort results by original order
  results.sort((a, b) =>
    IDENTIFIERS.indexOf(a.identifier) - IDENTIFIERS.indexOf(b.identifier)
  );

  // Write results to file
  const outputPath = path.resolve(OUTPUT_FILE);
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf8");

  console.log("");
  console.log("================== SUMMARY ==================");
  console.log(`Total identifiers: ${IDENTIFIERS.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${errorCount}`);
  console.log(`Output file: ${outputPath}`);
  console.log("=============================================");
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
