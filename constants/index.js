// export * from './thesaurus.js'

export const THEASURUS = {
    GBF_GLOBAL_GOALS           : 'GBF-GOALS',
    GBF_GLOBAL_TARGETS         : 'GBF-TARGETS',
    GBF_GLOBAL_GOALS_TARGETS   : 'GBF-GOALS-TARGETS',
    GBF_TARGETS_CONSIDERATIONS : 'GBF-TARGETS-CONSIDERATIONS',
}

export const ROLES = {
    ADMINSTARATOR           : 'administrator',
    NATIONAL_FOCALPOINT     : 'nationalFocalPoint',
    NATIONAL_AUTHORIZED_USER: 'nationalAuthorizedUser',
    PUBLISHING_AUTHORITIES  : 'publishingAuthorities',
    ALL_NATIONAL_USERS      : ['nationalFocalPoint', 'nationalAuthorizedUser', 'publishingAuthorities']
}
// ROLES["ALL_NATIONAL_USERS"] = [ROLES.NATIONAL_FOCALPOINT]