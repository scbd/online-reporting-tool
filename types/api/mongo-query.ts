export interface MongoQuery {

    count? : number
    length?: number
    skip?  : number
    sort?  : Record<string, number>
    
}