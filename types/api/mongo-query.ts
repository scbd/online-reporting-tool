export interface MongoQuery {

    count? : boolean
    length?: Number
    skip?  : Number
    sort?  : Record<string, number>
    
}