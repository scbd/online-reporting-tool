#!/usr/bin/env node
/**
 * NR7 Indicator Counts + Published Discrepancy CSV
 *
 * - Pull NR7 records from:
 *   https://api.cbd.int/api/v2013/index/select?q=schema_s:nationalReport7&rows=200&fl=identifier_s,government_s
 *
 * - For each record:
 *   1) Fetch NR7 doc: /documents/{identifier}  (CBD storage API pattern) [1](https://unitednations.sharepoint.com/sites/MEA-CBD-Secretariat/Shared%20Documents/General/Working%20Folders/32-00%20-%20PMRR%20Unit/32-09%20Global%20Review/Global%20Report/7th%20national%20report%20pdfs/7NR-Brunei_Darussalam.pdf?web=1)
 *   2) Extract NR7 indicator codes from:
 *      body.sectionIII[].indicatorData.{headline|binary|component|complementary|national}[]
 *      where code is item.indicator.identifier (e.g. GBF-INDICATOR-A.1) [2](https://learn.microsoft.com/en-us/sharepoint/dev/sp-add-ins/working-with-lists-and-list-items-with-rest)
 *   3) Fetch indicator documents (published): collection=all
 *   4) Fetch indicator documents (draft): collection=alldraft (auth required)
 *   5) Compare NR7 national indicators vs published indicator docs (indicatorCode)
 *   6) Output CSV:
 *      - per-type counts from NR7
 *      - counts from published & draft indicator docs
 *      - discrepancy count and missing list (missing in published)
 *
 * Requirements: Node >= 18 (global fetch)
 *
 * Usage:
 *   export CBD_TOKEN="BearerTokenForDrafts"
 *   node nr7_indicator_counts_and_discrepancy.js
 *
 * Optional env vars:
 *   SOLR_ROWS=200
 *   CONCURRENCY=4
 *   CSV_PATH=nr7_indicator_counts.csv
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

// -------------------- CONFIG --------------------
const API_BASE = "https://api.cbd.int/api/v2013";
const SOLR_SELECT = `${API_BASE}/index/select`;

const SOLR_QUERY = "schema_s:nationalReport7";
const SOLR_ROWS = Number(process.env.SOLR_ROWS || 200);

const TOP = 500;
const ORDER_BY = "updatedOn desc";
const INCLUDE_BODY = true;

// Draft token (you will supply/update)
const DRAFTS_TOKEN = process.env.CBD_TOKEN || "";

// Use alldraft as you specified
const DRAFT_COLLECTION = "alldraft";

// Concurrency
const CONCURRENCY = Number(process.env.CONCURRENCY || 1);

// Output
const CSV_PATH = process.env.CSV_PATH || "nr7_indicator_counts.csv";

// Optional: only include NR7 docs that appear "published"
const FILTER_PUBLISHED_NR7 = process.argv.includes("--published-only");

// -------------------- UTILITIES --------------------
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJson(url, { headers = {}, retries = 4 } = {}) {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try {
      // Keep realm header (ORT) as in your script and internal guidance references. [3](https://unitednations.sharepoint.com/sites/MEA-CBD-Secretariat/Shared%20Documents/General/Working%20Folders/32-00%20-%20PMRR%20Unit/32-09%20Global%20Review/Global%20Report/7th%20national%20report%20pdfs/7NR-Pakistan.pdf?web=1)
      headers["realm"] = "ORT";

      const res = await fetch(url, { headers });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} - ${txt.slice(0, 300)}`);
      }
      return await res.json();
    } catch (e) {
      lastErr = e;
      await sleep(250 * Math.pow(2, i));
    }
  }
  throw lastErr;
}

function encodeODataFilter(filter) {
  return encodeURIComponent(filter);
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

function isPublishedDoc(doc) {
  const status = (doc?.status || doc?.workflowState || doc?.publicationStatus || "")
    .toString()
    .toLowerCase();
  if (status.includes("published")) return true;
  if (doc?.publishedOn || doc?.publishedDate || doc?.meta?.publishedOn) return true;
  return false;
}

/**
 * Normalize owner string for indicator doc query:
 * - Solr government_s may already be "country:xx" or it may be "xx"
 * - Ensure final is "country:xx"
 */
function normalizeOwner(government_s) {
  const g = String(government_s || "").trim();
  if (!g) return "";
  return g.startsWith("country:") ? g : `country:${g}`;
}

// -------------------- NR7 EXTRACTION (your confirmed structure) --------------------
// sectionIII[].indicatorData has keys: headline, binary, component, complementary, national
const NR7_TYPES = ["headline", "binary", "component", "complementary", "national"];

function extractNr7IndicatorTypeSets(nr7Doc) {
  const sets = Object.fromEntries(NR7_TYPES.map((k) => [k, new Set()]));

  const body = nr7Doc?.body || nr7Doc?.data?.body || nr7Doc?.content?.body || nr7Doc || {};
  const sectionIII = body?.sectionIII;

  if (!Array.isArray(sectionIII)) return sets;

  for (const entry of sectionIII) {
    const indicatorData = entry?.indicatorData;
    if (!indicatorData || typeof indicatorData !== "object") continue;

    for (const type of NR7_TYPES) {
      const arr = indicatorData[type];
      if (!Array.isArray(arr)) continue;

      for (const item of arr) {
        // Your sample: item.indicator.identifier = "GBF-INDICATOR-A.1" etc. [2](https://learn.microsoft.com/en-us/sharepoint/dev/sp-add-ins/working-with-lists-and-list-items-with-rest)
        const code = item?.indicator?.identifier;
        if (code) sets[type].add(String(code).trim());
      }
    }
  }

  return sets;
}

function unionAllSets(sets) {
  const all = new Set();
  for (const s of Object.values(sets)) for (const v of s) all.add(v);
  return all;
}

// -------------------- INDICATOR DOC EXTRACTION --------------------
function getIndicatorCodeFromIndicatorDoc(doc) {
  const candidates = [
    doc?.indicatorCode,
    doc?.indicatorcode,
    doc?.indicatorCode_s,
    doc?.indicatorcode_s,
    doc?.body?.indicatorCode,
    doc?.body?.indicatorcode,
    doc?.body?.indicatorCode_s,
    doc?.body?.indicatorcode_s
  ].filter((v) => v != null && String(v).trim() !== "");

  if (candidates.length) return String(candidates[0]).trim();

  // fallback
  return String(doc?.identifier || doc?.identifier_s || doc?.id || doc?._id || "UNKNOWN");
}

// -------------------- API CALLS --------------------
async function getAllNr7FromSolr() {
  const all = [];
  let start = 0;

  while (true) {
    const url =
      `${SOLR_SELECT}?q=${encodeURIComponent(SOLR_QUERY)} AND realm_ss:ORT` +
      `&rows=${SOLR_ROWS}&start=${start}` +
      `&fl=${encodeURIComponent("identifier_s,government_s, government_EN_s")}`;

    const data = await fetchJson(url);
    const docs = data?.response?.docs || [];
    all.push(...docs);

    // Correct paging condition: break only if less than page size
    if (docs.length < SOLR_ROWS) break;
    start += SOLR_ROWS;
  }

  return all;
}

async function getDocumentById(identifier) {
  // CBD storage API doc endpoint pattern [1](https://unitednations.sharepoint.com/sites/MEA-CBD-Secretariat/Shared%20Documents/General/Working%20Folders/32-00%20-%20PMRR%20Unit/32-09%20Global%20Review/Global%20Report/7th%20national%20report%20pdfs/7NR-Brunei_Darussalam.pdf?web=1)
  const url = `${API_BASE}/documents/${encodeURIComponent(identifier)}`;
  return fetchJson(url);
}

async function listIndicatorDocsForOwner(owner, collection, token) {
  // OData filter exactly as you described (owner eq 'country:xx')
  const filter =
    `(type eq 'nationalReport7IndicatorData' or type eq 'nationalReport7BinaryIndicatorData') and owner eq '${owner}'`;

  let skip = 0;
  const all = [];

  while (true) {
    const url =
      `${API_BASE}/documents/?` +
      `$filter=${encodeODataFilter(filter)}` +
      `&collection=${encodeURIComponent(collection)}` +
      `&$top=${TOP}&$skip=${skip}` +
      `&$orderby=${encodeURIComponent(ORDER_BY)}` +
      `&body=${INCLUDE_BODY ? "true" : "false"}`;

    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const data = await fetchJson(url, { headers });
    const items = Array.isArray(data) ? data : (data?.Items || data?.items || data?.results || []);
    all.push(...items);

    if (!items.length || items.length < TOP) break;
    skip += TOP;
  }

  return all;
}

// -------------------- CSV OUTPUT --------------------
function toCsv(rows) {
  const header = [
    "government",
    "nr7_identifier",

    // Counts per NR7 type (unique codes)
    "nr7_headline_unique",
    "nr7_binary_unique",
    "nr7_component_unique",
    "nr7_complementary_unique",
    "nr7_national_unique",
    "nr7_total_unique",

    // Published indicator doc stats
    "published_docs",
    "published_unique_indicatorCodes",
    "published_matching_nr7_national",
    "published_headline_unique",
    "published_binary_unique",
    "published_component_unique",
    "published_complementary_unique",
    "published_national_unique",
    "published_total_unique",

    "published_headline_missing",
    "published_binary_missing",
    "published_component_missing",
    "published_complementary_missing",
    "published_national_missing",

    // Draft indicator doc stats
    "draft_docs",
    "draft_unique_indicatorCodes",
    "draft_matching_nr7_national",
    "draft_headline_unique",
    "draft_binary_unique",
    "draft_component_unique",
    "draft_complementary_unique",
    "draft_national_unique",
    "draft_total_unique",

    // Discrepancy + missing list (missing in published)
    "discrepancy_missing_published_count",
    "missing_in_published_indicators"
  ];

  const escape = (v) => {
    const s = String(v ?? "");
    if (s.includes(",") || s.includes("\"") || s.includes("\n")) return `"${s.replace(/\"/g, "\"\"")}"`;
    return s;
  };

  const lines = [header.join(",")];

  for (const r of rows) {
    lines.push([
      r.government,
      r.nr7Id,

      r.nr7_headline_unique,
      r.nr7_binary_unique,
      r.nr7_component_unique,
      r.nr7_complementary_unique,
      r.nr7_national_unique,
      r.nr7_total_unique,

      r.published_docs,
      r.published_unique_indicatorCodes,
      r.published_matching_nr7_national,
      r.published_headline_unique,
      r.published_binary_unique,
      r.published_component_unique,
      r.published_complementary_unique,
      r.published_national_unique,
      r.published_total_unique,

      r.published_headline_missing,
      r.published_binary_missing,
      r.published_component_missing,
      r.published_complementary_missing,
      r.published_national_missing,

      r.draft_docs,
      r.draft_unique_indicatorCodes,
      r.draft_matching_nr7_national,
      r.draft_headline_unique,
      r.draft_binary_unique,
      r.draft_component_unique,
      r.draft_complementary_unique,
      r.draft_national_unique,
      r.draft_total_unique,

      r.discrepancy_missing_published_count,
      r.missing_in_published_indicators.join(" | ")
    ].map(escape).join(","));
  }

  return lines.join("\n");
}

// -------------------- MAIN --------------------
async function main() {
  if (!DRAFTS_TOKEN) {
    console.warn("⚠️ CBD_TOKEN env var is not set. Draft requests may fail (auth required).");
  }

  console.log("Fetching NR7 records from Solr index...");
  const nr7IndexDocs = await getAllNr7FromSolr();
  console.log(`Found ${nr7IndexDocs.length} NR7 index records.`);

  const processed = [];
    for(const rec of nr7IndexDocs) {   
        const nr7Id = rec.identifier_s;
        const owner = normalizeOwner(rec.government_s);

        console.log(`Processing ${rec.government_EN_s} - ${nr7Id}`);
        // 1) Fetch NR7 doc
        let nr7Doc;
        try {
            
            nr7Doc = await getDocumentById(nr7Id);
        } catch (e) {
            return {
            government: owner,
            nr7Id,

            nr7_headline_unique: 0,
            nr7_binary_unique: 0,
            nr7_component_unique: 0,
            nr7_complementary_unique: 0,
            nr7_national_unique: 0,
            nr7_total_unique: 0,

            published_docs: 0,
            published_unique_indicatorCodes: 0,
            published_matching_nr7_national: 0,

            draft_docs: 0,
            draft_unique_indicatorCodes: 0,
            draft_matching_nr7_national: 0,

            discrepancy_missing_published_count: 0,
            missing_in_published_indicators: [`NR7 fetch failed: ${e.message}`]
            };
        }

        if (FILTER_PUBLISHED_NR7 && !isPublishedDoc(nr7Doc)) return null;

        // 2) Extract NR7 indicator sets by type
        const sets = extractNr7IndicatorTypeSets(nr7Doc);
        const allNr7 = unionAllSets(sets);

        // Discrepancy base: NR7 national; if empty, fall back to all NR7 indicators
        const expectedNational = sets.national.size ? sets.national : allNr7;

        // 3) Published indicator docs (collection=all)
        const publishedDocs = owner ? await listIndicatorDocsForOwner(owner, "all", null) : [];
        const publishedSet = new Set(publishedDocs.map(getIndicatorCodeFromIndicatorDoc));

        // 4) Draft indicator docs (collection=alldraft)
        const draftDocs = owner ? await listIndicatorDocsForOwner(owner, DRAFT_COLLECTION, DRAFTS_TOKEN) : [];
        const draftSet = new Set(draftDocs.map(getIndicatorCodeFromIndicatorDoc));

        // 5) Compare NR7 national vs published
        const missingInPublished = [...expectedNational].filter((c) => !publishedSet.has(c)).sort();
        const publishedMatchingNational = [...expectedNational].filter((c) => publishedSet.has(c)).length;
        const draftMatchingNational = [...expectedNational].filter((c) => draftSet.has(c)).length;

        const publishedHeadline = publishedDocs.filter(c => sets.headline.has(c?.body?.indicator?.identifier))
        const publishedBinary = publishedDocs.filter(c => sets.binary.has(c?.body?.indicator?.identifier))
        const publishedComponent = publishedDocs.filter(c => sets.component.has(c?.body?.indicator?.identifier))
        const publishedComplementary = publishedDocs.filter(c => sets.complementary.has(c?.body?.indicator?.identifier))
        const publishedNational = publishedDocs.filter(c => sets.national.has(c?.body?.indicator?.identifier))
        
        const draftHeadline = draftDocs.filter(c => sets.headline.has(c?.body?.indicator?.identifier))
        const draftBinary = draftDocs.filter(c => sets.binary.has(c?.body?.indicator?.identifier))
        const draftComponent = draftDocs.filter(c => sets.component.has(c?.body?.indicator?.identifier))
        const draftComplementary = draftDocs.filter(c => sets.complementary.has(c?.body?.indicator?.identifier))
        const draftNational = draftDocs.filter(c => sets.national.has(c?.body?.indicator?.identifier))

        processed.push( {
            government: rec.government_EN_s,
            nr7Id,

            nr7_headline_unique: sets.headline.size,
            nr7_binary_unique: sets.binary.size,
            nr7_component_unique: sets.component.size,
            nr7_complementary_unique: sets.complementary.size,
            nr7_national_unique: sets.national.size,
            nr7_total_unique: allNr7.size,

            published_docs: publishedDocs.length,
            published_unique_indicatorCodes: publishedSet.size, 
            published_headline_unique: publishedHeadline.length,
            published_binary_unique: publishedBinary.length,
            published_component_unique: publishedComponent.length,
            published_complementary_unique: publishedComplementary.length,
            published_national_unique: publishedNational.length,
            published_total_unique: publishedSet.size,
            published_matching_nr7_national: publishedMatchingNational,


            published_headline_missing: [...sets.headline].filter(h=>!publishedHeadline.find(p=>p?.body?.indicator?.identifier == h)).filter(h=>draftHeadline.find(p=>p?.body?.indicator?.identifier == h)).join(" | "),
            published_binary_missing: [...sets.binary].filter(h=>!publishedBinary.find(p=>p?.body?.indicator?.identifier == h)).filter(h=>draftBinary.find(p=>p?.body?.indicator?.identifier == h)).join(" | "),
            published_component_missing: [...sets.component].filter(h=>!publishedComponent.find(p=>p?.body?.indicator?.identifier == h)).filter(h=>draftComponent.find(p=>p?.body?.indicator?.identifier == h)).join(" | "),
            published_complementary_missing: [...sets.complementary].filter(h=>!publishedComplementary.find(p=>p?.body?.indicator?.identifier == h)).filter(h=>draftComplementary.find(p=>p?.body?.indicator?.identifier == h)).join(" | "),
            published_national_missing: [...sets.national].filter(h=>!publishedNational.find(p=>p?.body?.indicator?.identifier == h)).filter(h=>draftNational.find(p=>p?.body?.indicator?.identifier == h)).join(" | "),

            draft_docs: draftDocs.length,
            draft_unique_indicatorCodes: draftSet.size,
            draft_headline_unique: draftHeadline.length,
            draft_binary_unique: draftBinary.length,
            draft_component_unique: draftComponent.length,
            draft_complementary_unique: draftComplementary.length,
            draft_national_unique: draftNational.length,
            draft_total_unique: draftSet.size,
            draft_matching_nr7_national: draftMatchingNational,

            discrepancy_missing_published_count: missingInPublished.length,
            missing_in_published_indicators: missingInPublished
        });
    }

  const rows = processed.filter(Boolean);

  // Sort by highest discrepancy first
  rows.sort(
    (a, b) =>
      (b.discrepancy_missing_published_count || 0) - (a.discrepancy_missing_published_count || 0)
  );

  const csv = toCsv(rows);
  fs.writeFileSync(CSV_PATH, csv, "utf8");
  console.log(`✅ CSV written to: ${path.resolve(CSV_PATH)}`);
  console.log(`Rows: ${rows.length}`);
}

main().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
