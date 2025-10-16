export interface EAuthUser {
    email          : string
    government     : string
isAuthenticated: boolean
isEmailVerified: boolean
    name           : string
    roles          : Array<string>
    userGroups     : Array<string>
    userID         : number
}

export interface EUserInfo {
    email          : string
    firstName      : string
    lastName       : string
}