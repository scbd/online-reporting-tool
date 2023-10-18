interface IUser {
    email          : String
    government     : String
    isAuthenticated: Boolean
    isEmailVerified: Boolean
    name           : String
    roles          : Array<String>
    userGroups     : Array<String>
    userID         : BigInteger
}