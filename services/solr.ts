//@ts-nocheck
import _, { isNumber, isDate, } from 'lodash';
import { useRealmConfStore } from '@/stores/realmConf';


var base_fields = 'id, recDate:updatedDate_dt, recCreationDate:createdDate_dt, identifier_s, uniqueIdentifier_s, url_ss, government_s, schema_s,schema_EN_s, government_EN_s, schemaSort_i, sort1_i, sort2_i, sort3_i, sort4_i, _revision_i,';
var en_fields = 'recCountryName:government_EN_t, recTitle:title_EN_t, recSummary:summary_t, recType:type_EN_t, recMeta1:meta1_EN_txt, recMeta2:meta2_EN_txt, recMeta3:meta3_EN_txt,recMeta4:meta4_EN_txt,recMeta5:meta5_EN_txt';

var searchDefaults = {
    currentPage: 0,
    rowsPerPage: 25,
    fields: base_fields + en_fields,
    // groupField  : 'government_s',
    // groupLimit  : 100000,
    fieldQuery: [],
    query: "''",
    sort: 'updatedDate_dt desc'
}

export function escape(value) {

    if (value === undefined) return;
    if (value === null) return;
    if (value === "") return;

    if (isNumber(value)) value = value.toString();
    if (isDate(value)) value = value.toISOString();

    //TODO add more types

    value = value.toString();

    value = value.replace(/\\/g, '\\\\');
    value = value.replace(/\+/g, '\\+');
    value = value.replace(/\-/g, '\\-');
    value = value.replace(/\&\&/g, '\\&&');
    value = value.replace(/\|\|/g, '\\||');
    value = value.replace(/\!/g, '\\!');
    value = value.replace(/\(/g, '\\(');
    value = value.replace(/\)/g, '\\)');
    value = value.replace(/\{/g, '\\{');
    value = value.replace(/\}/g, '\\}');
    value = value.replace(/\[/g, '\\[');
    value = value.replace(/\]/g, '\\]');
    value = value.replace(/\^/g, '\\^');
    value = value.replace(/\"/g, '\\"');
    value = value.replace(/\~/g, '\\~');
    value = value.replace(/\*/g, '\\*');
    value = value.replace(/\?/g, '\\?');
    value = value.replace(/\:/g, '\\:');

    return value;
}

export function andOr(query, sep): String {

    sep = sep || 'AND';

    if (Array.isArray(query)) {

        query = query.map(function (criteria) {

            if (Array.isArray(criteria)) {
                return andOr(criteria, sep == "AND" ? "OR" : "AND");
            }

            return criteria;
        });

        query = '(' + query.join(' ' + sep + ' ') + ')';
    }

    return query;
}

export function localizeFields(field, locale = 'EN') {
    return field.replace(/_EN_/ig, `_${locale.toUpperCase()}_`);
}


export function facetsToObject(solrArray, facetFields) {

    var facets = {};
    if (!Array.isArray(facetFields)) {
        facetFields = [facetFields]
    }

    facetFields.forEach(function (field) {
        if (solrArray) {
            var mField = field.replace(/{.*}/, ''); //remove tags(${!ex=xxx}) is specified in field names
            for (var i = 0; i < solrArray[mField]?.length; i += 2) {
                if (!facets[mField])
                    facets[mField] = {};
                facets[mField][solrArray[mField][i]] = solrArray[mField][i + 1];
            }
        }
    });

    return facets;
};

export async function facets(searchQuery: Object) {

    const result = await useAPIFetch('/api/v2013/index/select', { method: 'POST', body: searchQuery})
    const facetResult = facetsToObject(result.facet_counts.facet_fields, searchQuery['facet.field']);

    return { facets: facetResult, facetPivot: result.facet_counts.facet_pivot, docs: result.response.docs }

}

export async function queryIndex(searchQuery: Object) {

    const result = await useAPIFetch('/api/v2013/index/select', { method: 'POST', body: searchQuery })

    const searchResult = {
        docs: result.response.docs,
        numFound: result.response.numFound
    }

    if (searchQuery.facet) { /// Normalize Facets   

        const facetResult = facetsToObject(result.facet_counts.facet_fields, searchQuery['facet.field']);
        searchResult.facets = facetResult;
        searchResult.facetPivot = result.facet_counts.facet_pivot;
    }

    return searchResult;

}


export function parseSolrQuery(searchQuery: Object, locale: String) {

    const realmConfStore = useRealmConfStore();
    const realmConf = realmConfStore.realmConf;

    _.defaults(searchQuery, { ...searchDefaults });

    if (searchQuery.additionalFields)
        searchQuery.fields += ',' + searchQuery.additionalFields;

    var fieldQueries = _.flatten(['_state_s:public', searchQuery.fieldQuery]);

    fieldQueries.push('realm_ss:' + realmConf?.realm?.toLowerCase())

    var queryListParameters = {
        df: localizeFields(searchQuery.df || 'text_EN_txt'),
        fq: _(fieldQueries).flatten().compact().uniq().value(),
        q: searchQuery.query,
        sort: localizeFields(searchQuery.sort),
        fl: localizeFields(searchQuery.fields),
        wt: 'json',
        start: searchQuery.start,
        rows: searchQuery.rowsPerPage
    };

    if (searchQuery.highlight) {
        queryListParameters.hl = true;
        queryListParameters['hl.snippets'] = 5;
        queryListParameters['hl.fl'] = searchQuery.highlightFields || 'text_EN_txt';
    }

    if (searchQuery.facet) {
        queryListParameters.facet = true
        queryListParameters['facet.sort'] = 'index' //alphabetically sorted
        queryListParameters['facet.query'] = searchQuery.query,
        queryListParameters['facet.field'] = searchQuery.facetFields;
        queryListParameters['facet.mincount'] = searchQuery.facetMinCount||1;
        queryListParameters['facet.pivot.mincount'] = searchQuery.facetMinCount||1;
        queryListParameters['facet.limit'] = 512;

        if (searchQuery.pivotFacetFields)
            queryListParameters['facet.pivot'] = searchQuery.pivotFacetFields;
    }

    return queryListParameters;

}

