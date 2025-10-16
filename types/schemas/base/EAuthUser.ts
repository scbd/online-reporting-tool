export interface EAuthUser {
    email          : string
    government     : string
    isAuthenticated: Boolean
    isEmailVerified: Boolean
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