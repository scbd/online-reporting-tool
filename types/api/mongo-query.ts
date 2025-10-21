export interface MongoQuery {

    count? : boolean
    length?: number
    skip?  : number
    sort?  : Record<string, number>
    
}