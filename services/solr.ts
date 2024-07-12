import {isNumber,isDate, } from 'lodash';

export function escape(value) {

    if(value===undefined) return;
    if(value===null)      return;
    if(value==="")        return;

    if(isNumber(value)) value = value.toString();
    if(isDate  (value)) value = value.toISOString();

    //TODO add more types

    value = value.toString();

    value = value.replace(/\\/g,   '\\\\');
    value = value.replace(/\+/g,   '\\+');
    value = value.replace(/\-/g,   '\\-');
    value = value.replace(/\&\&/g, '\\&&');
    value = value.replace(/\|\|/g, '\\||');
    value = value.replace(/\!/g,   '\\!');
    value = value.replace(/\(/g,   '\\(');
    value = value.replace(/\)/g,   '\\)');
    value = value.replace(/\{/g,   '\\{');
    value = value.replace(/\}/g,   '\\}');
    value = value.replace(/\[/g,   '\\[');
    value = value.replace(/\]/g,   '\\]');
    value = value.replace(/\^/g,   '\\^');
    value = value.replace(/\"/g,   '\\"');
    value = value.replace(/\~/g,   '\\~');
    value = value.replace(/\*/g,   '\\*');
    value = value.replace(/\?/g,   '\\?');
    value = value.replace(/\:/g,   '\\:');

    return value;
}

export function andOr(query, sep) {

    sep = sep || 'AND';

    if(Array.isArray(query)) {

        query = query.map(function(criteria){

            if(Array.isArray(criteria)) {
                return andOr(criteria, sep=="AND" ? "OR" : "AND");
            }

            return criteria;
        });

        query = '(' + query.join(' ' + sep + ' ') + ')';
    }

    return query;
}

export function localizeFields (field, locale){
    return field.replace(/_EN_/ig, `_${locale.toUpperCase()}_`);
}


export function facetsToObject(solrArray, facetFields) {

    var facets = {};
    if(!Array.isArray(facetFields)){
        facetFields = [facetFields]
    }

    facetFields.forEach(function(field){
        if (solrArray){
            var mField = field.replace(/{.*}/, ''); //remove tags(${!ex=xxx}) is specified in field names
            for (var i = 0; i < solrArray[mField].length; i += 2) {
                if(!facets[mField])
                    facets[mField] = {};
                facets[mField][solrArray[mField][i]] = solrArray[mField][i + 1];
            }
        }
    });
                                           
    return facets;
};

export async function facets(searchQuery:Object){

    const result = await useAPIFetch('/api/v2013/index/select', {method:'POST', body : searchQuery})
    console.log(result)
    if(result){
        const facetResult = facetsToObject(result.facet_counts.facet_fields, searchQuery['facet.field']);

        return { facets : facetResult, facetPivot : result.facet_counts.facet_pivot, docs : result.response.docs }
    }
}