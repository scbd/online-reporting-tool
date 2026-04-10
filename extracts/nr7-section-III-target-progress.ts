import path from 'path';
import writeXlsxFile, { type Schema as XlsxSchema } from 'write-excel-file/node';

const API_URL    = process.env.NUXT_PUBLIC_API_URL || 'https://api.cbd.int';
const ORT_URL    = process.env.ORT_URL             || 'https://ort.cbd.int';
const REALM      = process.env.REALM               || 'ort';

const SCHEMA_NR7              = 'nationalReport7';
const SCHEMA_NT7              = 'nationalTarget7';
const GBF_TARGET              = 'GBF-TARGET-14';
const LEVEL_OF_PROGRESS_DOMAIN = 'EF99BEFD-5070-41C4-91F0-C051B338EEA6';

const BASE_FIELDS = [
    'id',
    'recDate:updatedDate_dt',
    'identifier_s',
    'government_s',
    'government_EN_s',
    'schema_s',
    'recTitle:title_EN_t',
    'recCountryName:government_EN_t',
].join(', ');

interface SolrDoc {
    identifier_s: string;
    government_s: string;
    government_EN_s?: string;
    updatedDate_dt?: string;
    [key: string]: unknown;
}

interface SolrResponse {
    response: {
        docs: SolrDoc[];
        numFound: number;
    };
}

interface ETerm {
    identifier: string;
    title?: Record<string, string>;
}

interface SectionIIIEntry {
    target: ETerm;
    targetType?: string;
    levelOfProgress?: ETerm;
    [key: string]: unknown;
}

interface Nr7ReportBody {
    sectionIII?: SectionIIIEntry[];
    [key: string]: unknown;
}

interface Nr7Report {
    identifier: string;
    government: string;
    countryName?: string;
    updatedOn?: string;
    body?: Nr7ReportBody | null;
}

interface ThesaurusTerm {
    identifier: string;
    name: string;
    title?: Record<string, string>;
}

interface TargetProgressRow {
    country              : string;
    countryName          : string | undefined;
    nr7Identifier        : string;
    targetIdentifier     : string;
    targetType           : string;
    targetTitle          : string | undefined;
    levelOfProgress      : string | null;
    levelOfProgressTitle : string | null;
    targetLink           : string;
    ortLink              : string;
}

async function fetchLevelOfProgressTerms(): Promise<Map<string, string>> {
    const url = `${API_URL}/api/v2013/thesaurus/domains/${LEVEL_OF_PROGRESS_DOMAIN}/terms`;
    const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!resp.ok) throw new Error(`Thesaurus fetch failed: ${resp.status} ${resp.statusText}`);
    const terms = await resp.json() as ThesaurusTerm[];
    return new Map(terms.map(t => [t.identifier, t.title?.en ?? t.name]));
}

async function queryIndex(params: Record<string, unknown>): Promise<SolrResponse> {
    const url = `${API_URL}/api/v2013/index/select`;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    
    const resp = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(params),
    });

    if (!resp.ok) throw new Error(`Solr query failed: ${resp.status} ${resp.statusText}`);
    return resp.json() as Promise<SolrResponse>;
}

async function fetchDocumentBody(identifier: string): Promise<{ body?: unknown } | null> {
    const url = `${API_URL}/api/v2013/documents/${encodeURIComponent(identifier)}`;
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    
    const resp = await fetch(url, { headers });
    if (!resp.ok) {
        console.warn(`  Could not fetch body for ${identifier}: ${resp.status}`);
        return null;
    }
    return resp.json() as Promise<{ body?: unknown }>;
}

async function loadAllNr7Reports(): Promise<Nr7Report[]> {
    const rowsPerPage = 100;
    let start = 0;
    let numFound = Infinity;
    const all: Nr7Report[] = [];

    const queryParams: Record<string, unknown> = {
        df  : 'text_EN_txt',
        fq  : [`_state_s:public`, `realm_ss:${REALM}`, `schema_s:${SCHEMA_NR7}`],
        q   : "''",
        sort: 'updatedDate_dt desc',
        fl  : BASE_FIELDS,
        wt  : 'json',
        rows: rowsPerPage,
    };

    console.log(`Fetching NR7 reports from ${API_URL} (realm: ${REALM})...`);

    while (start < numFound) {
        const result = await queryIndex({ ...queryParams, start });
        numFound = result.response.numFound;

        const docs = result.response.docs;
        if (!docs.length) break;

        for (const doc of docs) {
            all.push({
                identifier  : doc.identifier_s,
                government  : doc.government_s,
                countryName : doc.government_EN_s ?? (doc['recCountryName'] as string),
                updatedOn   : doc.updatedDate_dt  ?? (doc['recDate'] as string),
            });
        }

        console.log(`  Loaded ${all.length} / ${numFound}`);
        start += rowsPerPage;
    }

    return all;
}

interface NationalTarget {
    identifier: string;
    government: string;
    countryName?: string;
    title?: string;
    updatedOn?: string;
    globalTargetAlignment?: string[];
}

async function loadNationalTargetsForGbfTarget(gbfTarget: string): Promise<NationalTarget[]> {
    const rowsPerPage = 100;
    let start = 0;
    let numFound = Infinity;
    const all: NationalTarget[] = [];

    const queryParams: Record<string, unknown> = {
        df  : 'text_EN_txt',
        fq  : [
            `_state_s:public`,
            `realm_ss:${REALM}`,
            `schema_s:${SCHEMA_NT7}`,
            `globalTargetAlignment_ss:${gbfTarget}`,
        ],
        q   : "''",
        sort: 'updatedDate_dt desc',
        fl  : [BASE_FIELDS, 'globalTargetAlignment_ss'].join(', '),
        wt  : 'json',
        rows: rowsPerPage,
    };

    console.log(`Fetching national targets aligned to ${gbfTarget}...`);

    while (start < numFound) {
        const result = await queryIndex({ ...queryParams, start });
        numFound = result.response.numFound;

        const docs = result.response.docs;
        if (!docs.length) break;

        for (const doc of docs) {
            all.push({
                identifier           : doc.identifier_s,
                government           : doc.government_s,
                countryName          : doc.government_EN_s ?? (doc['recCountryName'] as string),
                title                : doc['recTitle'] as string,
                updatedOn            : doc.updatedDate_dt  ?? (doc['recDate'] as string),
                globalTargetAlignment: doc['globalTargetAlignment_ss'] as string[],
            });
        }

        console.log(`  Loaded ${all.length} / ${numFound}`);
        start += rowsPerPage;
    }

    return all;
}

function stripHtml(html: string | undefined | null): string {
    if (!html) return html ?? '';
    // Replace <br> and <p> with newlines, then strip tags, then decode basic entities
    let text = html.replace(/<br\s*\/?>/gi, '\n')
                   .replace(/<\/p>/gi, '\n')
                   .replace(/<[^>]*>?/gm, '');
    
    // Decode common entities
    text = text.replace(/&nbsp;/gi, ' ')
               .replace(/&amp;/gi, '&')
               .replace(/&lt;/gi, '<')
               .replace(/&gt;/gi, '>')
               .replace(/&quot;/gi, '"')
               .replace(/&#39;/gi, "'");
    
    // Remove invalid XML control characters which cause Excel corruption
    text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');

    return text.trim();
}

function extractTargetProgress(nr7Results: Nr7Report[], nationalTargets: NationalTarget[], progressTerms: Map<string, string>): TargetProgressRow[] {
    const targetMap = new Map(nationalTargets.map(t => [t.identifier, t]));
    const rows: TargetProgressRow[] = [];

    for (const report of nr7Results) {
        const sectionIII = report.body?.sectionIII ?? [];
        for (const entry of sectionIII) {
            const targetId   = entry.target?.identifier;
            const targetType = entry.targetType ?? (targetId?.startsWith('GBF-') ? 'global' : 'national');

            const isMatchedNational = targetType === 'national' && targetMap.has(targetId!);
            const isMatchedGlobal   = targetType === 'global'   && targetId === GBF_TARGET;

            if (!targetId || (!isMatchedNational && !isMatchedGlobal)) continue;

            const targetTitle = isMatchedGlobal
                ? (entry.target.title?.['en'] ?? targetId)
                : targetMap.get(targetId)?.title;

            const progressId = entry.levelOfProgress?.identifier ?? null;
            const targetLink = isMatchedGlobal
                ? `${ORT_URL}/taxonomy/gbf/targets/${encodeURIComponent(targetId)}`
                : `${ORT_URL}/national-targets/my-country/part-1/${encodeURIComponent(targetId)}/view`;
            rows.push({
                country              : stripHtml(report.government) as string,
                countryName          : stripHtml(report.countryName),
                nr7Identifier        : report.identifier,
                targetIdentifier     : targetId,
                targetType,
                targetTitle          : stripHtml(targetTitle),
                levelOfProgress      : progressId,
                levelOfProgressTitle : stripHtml(progressId ? progressTerms.get(progressId) : null),
                targetLink,
                ortLink              : `${ORT_URL}/national-reports/nr7/${encodeURIComponent(report.identifier)}`,
            });
        }
    }

    return rows;
}

function hyperlink(url: string, label: string): string {
    return `=HYPERLINK("${url}","${label.replace(/"/g, '""')}")`;
}

async function exportToExcel(rows: TargetProgressRow[], filePath: string): Promise<void> {
    const schema: XlsxSchema<TargetProgressRow> = [
        { column: 'Country',           type: 'Formula', value: (r) => hyperlink(r.ortLink,    r.countryName ?? r.country),              width: 28 },
        { column: 'Target Type',                        value: (r) => r.targetType,                                                      width: 14 },
        { column: 'National Target',   type: 'Formula', value: (r) => hyperlink(r.targetLink, r.targetTitle ?? r.targetIdentifier),      width: 60 },
        { column: 'Level of Progress',                  value: (r) => r.levelOfProgressTitle ?? '',                                      width: 45 },
    ];
    await writeXlsxFile<TargetProgressRow>(rows, { schema, filePath });
}

export async function run() {
    const [reports, nationalTargets, progressTerms] = await Promise.all([
        loadAllNr7Reports(),
        loadNationalTargetsForGbfTarget(GBF_TARGET),
        fetchLevelOfProgressTerms(),
    ]);

    console.log(`\nFound ${reports.length} NR7 reports. Fetching bodies...`);

    const nr7Results: Nr7Report[] = [];

    for (const report of reports) {
        process.stdout.write(`  Fetching ${report.identifier} (${report.countryName})... `);
        const doc = await fetchDocumentBody(report.identifier);
        nr7Results.push({ ...report, body: (doc ?? null) as Nr7ReportBody | null });
        console.log('done');
    }

    const targetProgress = extractTargetProgress(nr7Results, nationalTargets, progressTerms)
        .sort((a, b) => (a.countryName ?? a.country).localeCompare(b.countryName ?? b.country));

    const xlsxOutPath = path.join(import.meta.dirname, 'exports', 'nr7-section-III-target-progress.xlsx');
    await exportToExcel(targetProgress, xlsxOutPath);

    console.log(`\nSaved ${targetProgress.length} rows to ${xlsxOutPath}`);
}

if (process.argv[1] === import.meta.filename) {
    run().catch((err) => { console.error(err); process.exit(1); });
}
