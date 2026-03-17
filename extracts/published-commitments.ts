import path from 'path';
import writeXlsxFile, { type Schema as XlsxSchema } from 'write-excel-file/node';

const API_URL = process.env.NUXT_PUBLIC_API_URL || 'https://api.cbd.int';
const ORT_URL = process.env.ORT_URL             || 'https://ort.cbd.int';
const REALM   = process.env.REALM               || 'ort';

const SCHEMA_STAKEHOLDER_COMMITMENT = 'stakeholderCommitment';

const BASE_FIELDS = [
    'id',
    'identifier_s',
    'government_s',
    'government_EN_s',
    'updatedDate_dt',
    'submittedDate_dt',
    'title_EN_t',
].join(', ');

interface SolrDoc {
    identifier_s     : string;
    government_s     : string;
    government_EN_s ?: string;
    updatedDate_dt  ?: string;
    submittedDate_dt?: string;
    title_EN_t      ?: string;
    [key: string]    : unknown;
}

interface SolrResponse {
    response: {
        docs    : SolrDoc[];
        numFound: number;
    };
}

interface ETerm {
    identifier: string;
    title     ?: Record<string, string>;
}

interface ELstring {
    [lang: string]: string;
}

interface ELink {
    url  ?: string;
    title?: ELstring;
}

interface EReference {
    identifier: string;
    [key: string]: unknown;
}

interface EStakeholderCommitmentBody {
    // Contact / organization
    firstName              ?: string;
    lastName               ?: string;
    organization           ?: ELstring;
    organizationAcronym    ?: ELstring;
    organizationType       ?: ETerm;
    country                ?: ETerm;
    emails                 ?: string[];
    websites               ?: ELink[];
    // Commitment
    title                  ?: ELstring;
    description            ?: ELstring;
    jurisdiction           ?: ETerm;
    jurisdictionCountries  ?: ETerm[];
    jurisdictionRegions    ?: ETerm[];
    coverageScope          ?: 'national' | 'multiCountries' | 'global';
    coverageCountries      ?: ETerm[];
    coverageRegions        ?: ETerm[];
    // Timeline
    timelineStartDate      ?: string | null;
    timelineEndDate        ?: string | null;
    isOpenEnded            ?: boolean;
    // GBF alignment
    primaryGlobalAlignment ?: ETerm;
    otherGlobalAlignments  ?: ETerm[];
    primaryNationalTarget  ?: EReference;
    otherNationalTargets   ?: EReference[];
    indicators             ?: ETerm[];
    // Implementation
    fundingSource          ?: ELstring;
    isFundingSufficient    ?: boolean;
    partners               ?: ELstring;
    isProgressTracked      ?: boolean;
    progressTrackingUrl    ?: ELstring;
    isLinkedToNbsap        ?: boolean;
    isReportingOnTarget15  ?: boolean;
    [key: string]           : unknown;
}

interface CommitmentDocument {
    identifier  : string;
    government  : string;
    countryName?: string;
    publishedOn?: string;
    updatedOn  ?: string;
    body       ?: EStakeholderCommitmentBody | null;
}

interface CommitmentRow {
    identifier          : string;
    link                : string;
    organization        : string;
    organizationAcronym : string;
    organizationType    : string;
    contactCountry      : string;
    contactName         : string;
    emails              : string;
    website             : string;
    title               : string;
    description         : string;
    jurisdiction        : string;
    coverageScope       : string;
    coverageCountries   : string;
    timelineStartDate   : string;
    timelineEndDate     : string;
    isOpenEnded         : string;
    primaryGbfTarget    : string;
    otherGbfTargets     : string;
    indicators          : string;
    isFundingSufficient : string;
    isProgressTracked   : string;
    progressUrl         : string;
    isLinkedToNbsap     : string;
    isReportingTarget15 : string;
    publishedOn         : string;
}

async function queryIndex(params: Record<string, unknown>): Promise<SolrResponse> {
    const url  = `${API_URL}/api/v2013/index/select`;
    const resp = await fetch(url, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body   : JSON.stringify(params),
    });
    if (!resp.ok) throw new Error(`Solr query failed: ${resp.status} ${resp.statusText}`);
    return resp.json() as Promise<SolrResponse>;
}

async function fetchDocumentBody(identifier: string): Promise<{ body?: EStakeholderCommitmentBody } | null> {
    const url  = `${API_URL}/api/v2013/documents/${encodeURIComponent(identifier)}`;
    const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!resp.ok) {
        console.warn(`  Could not fetch body for ${identifier}: ${resp.status}`);
        return null;
    }
    return resp.json() as Promise<{ body?: EStakeholderCommitmentBody }>;
}

// ── Thesaurus resolution ─────────────────────────────────────────────────────

const thesaurusCache = new Map<string, string>();

async function fetchThesaurusTitle(identifier: string): Promise<string> {
    if (thesaurusCache.has(identifier)) return thesaurusCache.get(identifier)!;
    const url  = `${API_URL}/api/v2013/thesaurus/terms/${encodeURIComponent(identifier)}`;
    const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
    let title  = identifier;
    if (resp.ok) {
        const term = await resp.json() as { title?: Record<string, string>; name?: string };
        title = term.title?.['en'] ?? (term.title ? term.title[Object.keys(term.title)[0]] : undefined) ?? term.name ?? identifier;
    }
    thesaurusCache.set(identifier, title);
    return title;
}

async function resolveTermTitle(term: ETerm | undefined): Promise<string> {
    if (!term?.identifier) return '';
    return fetchThesaurusTitle(term.identifier);
}

async function resolveTermListTitles(terms: ETerm[] | undefined): Promise<string> {
    if (!terms?.length) return '';
    const titles = await Promise.all(terms.map(t => fetchThesaurusTitle(t.identifier)));
    return titles.filter(Boolean).join('; ');
}

// ── Document title resolution (for Indicators) ───────────────────────────────

const documentTitleCache = new Map<string, string>();

async function fetchDocumentTitle(identifier: string): Promise<string> {
    if (documentTitleCache.has(identifier)) return documentTitleCache.get(identifier)!;
    const url  = `${API_URL}/api/v2013/documents/${encodeURIComponent(identifier)}`;
    const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
    let title  = identifier;
    if (resp.ok) {
        const doc = await resp.json() as { body?: { title?: Record<string, string> } };
        const t   = doc.body?.title;
        title = t?.['en'] ?? (t ? t[Object.keys(t)[0]] : undefined) ?? identifier;
    }
    documentTitleCache.set(identifier, title);
    return title;
}

async function resolveIndicatorTitles(terms: ETerm[] | undefined): Promise<string> {
    if (!terms?.length) return '';
    const titles = await Promise.all(terms.map(t => fetchDocumentTitle(t.identifier)));
    return titles.filter(Boolean).join('; ');
}

async function loadAllPublishedCommitments(): Promise<CommitmentDocument[]> {
    const rowsPerPage = 100;
    let start         = 0;
    let numFound      = Infinity;
    const all: CommitmentDocument[] = [];

    const queryParams: Record<string, unknown> = {
        df  : 'text_EN_txt',
        fq  : [`_state_s:public`, `realm_ss:${REALM}`, `schema_s:${SCHEMA_STAKEHOLDER_COMMITMENT}`],
        q   : "''",
        sort: 'submittedDate_dt desc',
        fl  : BASE_FIELDS,
        wt  : 'json',
        rows: rowsPerPage,
    };

    console.log(`Fetching published commitments from ${API_URL} (realm: ${REALM})...`);

    while (start < numFound) {
        const result = await queryIndex({ ...queryParams, start });
        numFound     = result.response.numFound;

        const docs = result.response.docs;
        if (!docs.length) break;

        for (const doc of docs) {
            all.push({
                identifier : doc.identifier_s,
                government : doc.government_s,
                countryName: doc.government_EN_s,
                publishedOn: doc.submittedDate_dt,
                updatedOn  : doc.updatedDate_dt,
            });
        }

        console.log(`  Loaded ${all.length} / ${numFound}`);
        start += rowsPerPage;
    }

    return all;
}

function en(value: ELstring | undefined): string {
    if (!value) return '';
    return value['en'] ?? value[Object.keys(value)[0]] ?? '';
}


function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
}

function bool(value: boolean | undefined): string {
    if (value === undefined || value === null) return '';
    return value ? 'Yes' : 'No';
}

async function toRow(doc: CommitmentDocument): Promise<CommitmentRow> {
    const b = doc.body ?? {} as EStakeholderCommitmentBody;

    const website = b.websites?.length ? (b.websites[0].url ?? '') : '';

    const [
        organizationType,
        contactCountry,
        jurisdiction,
        coverageItems,
        primaryGbfTarget,
        otherGbfTargets,
        indicators,
    ] = await Promise.all([
        resolveTermTitle(b.organizationType),
        resolveTermTitle(b.country),
        resolveTermTitle(b.jurisdiction),
        b.coverageScope === 'global'
            ? resolveTermListTitles(b.coverageRegions)
            : resolveTermListTitles(b.coverageCountries),
        resolveTermTitle(b.primaryGlobalAlignment),
        resolveTermListTitles(b.otherGlobalAlignments),
        resolveIndicatorTitles(b.indicators),
    ]);

    return {
        identifier         : doc.identifier,
        link               : `${ORT_URL}/register/stakeholderCommitment/${encodeURIComponent(doc.identifier)}/view`,
        organization       : en(b.organization),
        organizationAcronym: en(b.organizationAcronym),
        organizationType,
        contactCountry,
        contactName        : [b.firstName, b.lastName].filter(Boolean).join(' '),
        emails             : (b.emails ?? []).join('; '),
        website,
        title              : en(b.title),
        description        : en(b.description),
        jurisdiction,
        coverageScope      : b.coverageScope ?? '',
        coverageCountries  : coverageItems,
        timelineStartDate  : formatDate(b.timelineStartDate),
        timelineEndDate    : formatDate(b.timelineEndDate),
        isOpenEnded        : bool(b.isOpenEnded),
        primaryGbfTarget,
        otherGbfTargets,
        indicators,
        isFundingSufficient: bool(b.isFundingSufficient),
        isProgressTracked  : bool(b.isProgressTracked),
        progressUrl        : en(b.progressTrackingUrl),
        isLinkedToNbsap    : bool(b.isLinkedToNbsap),
        isReportingTarget15: bool(b.isReportingOnTarget15),
        publishedOn        : formatDate(doc.publishedOn),
    };
}

function hyperlink(url: string, label: string): string {
    return `=HYPERLINK("${url}","${label.replace(/"/g, '""')}")`;
}

async function exportToExcel(rows: CommitmentRow[], filePath: string): Promise<void> {
    const schema: XlsxSchema<CommitmentRow> = [
        { column: 'Identifier',            type: 'Formula', value: (r) => hyperlink(r.link, r.identifier),   width: 38 },
        { column: 'Organization',                           value: (r) => r.organization,                    width: 40 },
        { column: 'Acronym',                                value: (r) => r.organizationAcronym,              width: 20 },
        { column: 'Organization Type',                      value: (r) => r.organizationType,                 width: 28 },
        { column: 'Contact Country',                        value: (r) => r.contactCountry,                   width: 22 },
        { column: 'Contact Name',                           value: (r) => r.contactName,                      width: 26 },
        { column: 'Email(s)',                               value: (r) => r.emails,                           width: 36 },
        { column: 'Website',                type: 'Formula', value: (r) => r.website ? hyperlink(r.website, r.website) : '', width: 36 },
        { column: 'Title',                                  value: (r) => r.title,                            width: 60 },
        { column: 'Description',                            value: (r) => r.description,                      width: 80 },
        { column: 'Jurisdiction',                           value: (r) => r.jurisdiction,                     width: 22 },
        { column: 'Coverage Scope',                         value: (r) => r.coverageScope,                    width: 18 },
        { column: 'Coverage Countries / Regions',           value: (r) => r.coverageCountries,                width: 40 },
        { column: 'Timeline Start',                         value: (r) => r.timelineStartDate,                width: 16 },
        { column: 'Timeline End',                           value: (r) => r.timelineEndDate,                  width: 16 },
        { column: 'Open Ended',                             value: (r) => r.isOpenEnded,                      width: 12 },
        { column: 'Primary GBF Target',                     value: (r) => r.primaryGbfTarget,                 width: 28 },
        { column: 'Other GBF Targets',                      value: (r) => r.otherGbfTargets,                  width: 40 },
        { column: 'Indicators',                             value: (r) => r.indicators,                       width: 40 },
        { column: 'Funding Sufficient',                     value: (r) => r.isFundingSufficient,              width: 18 },
        { column: 'Progress Tracked',                       value: (r) => r.isProgressTracked,                width: 18 },
        { column: 'Progress Tracking URL', type: 'Formula', value: (r) => r.progressUrl ? hyperlink(r.progressUrl, r.progressUrl) : '', width: 40 },
        { column: 'Linked to NBSAP',                        value: (r) => r.isLinkedToNbsap,                  width: 16 },
        { column: 'Reporting on Target 15',                 value: (r) => r.isReportingTarget15,              width: 22 },
        { column: 'Published On',                           value: (r) => r.publishedOn,                      width: 14 },
    ];

    await writeXlsxFile<CommitmentRow>(rows, { schema, filePath });
}

export async function run(): Promise<void> {
    const commitments = await loadAllPublishedCommitments();

    console.log(`\nFound ${commitments.length} published commitments. Fetching document bodies...`);

    const rows: CommitmentRow[] = [];

    for (const commitment of commitments) {
        process.stdout.write(`  Fetching ${commitment.identifier}... `);
        const doc = await fetchDocumentBody(commitment.identifier);
        const body = (doc?.body ?? doc) as EStakeholderCommitmentBody | null;
        rows.push(await toRow({ ...commitment, body }));
        console.log('done');
    }
    rows.sort((a, b) => a.organization.localeCompare(b.organization));

    const xlsxOutPath = path.join(import.meta.dirname, 'exports', 'published-commitments.xlsx');
    await exportToExcel(rows, xlsxOutPath);

    console.log(`\nSaved ${rows.length} rows to ${xlsxOutPath}`);
}

if (process.argv[1] === import.meta.filename) {
    run().catch((err) => { console.error(err); process.exit(1); });
}
