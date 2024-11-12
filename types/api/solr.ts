
export interface SolrQuery{
    searchField : string,
    fieldQueries : string[],
    query : string,
    sort : string,
    fields : string,
    start : number,
    rowsPerPage : number
}