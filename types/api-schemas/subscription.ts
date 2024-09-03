
export interface Subscription {
    id        : string
    queryTitle: string
    realm     : string
    sendEmail : boolean
    userId    : number
    /**
     * system alerts for eg. absch predefined subscription for IRCC
     */
    isSystemAlert?: boolean
    /**
     * Query used for sharing links, embed or send email
     */
    isSharedQuery?: boolean
    filters:SearchFilter[]
    /**
     * Search sub filters based on Global filters
     */
    subFilters?: { [key: string]: SearchFilter; }
}

interface SearchFilter {
    filterID : String
    id       : String
    name     : String
    otherType: String
    type     : String
}