// export * from './thesaurus.js'

export const THEASURUS = {
    GBF_GLOBAL_GOALS            : 'GBF-GOALS',
    GBF_GLOBAL_TARGETS          : 'GBF-TARGETS',
    GBF_GLOBAL_GOALS_TARGETS    : 'GBF-GOALS-TARGETS',
    GBF_HEADLINE_INDICATORS     : 'GBF-HEADLINE-INDICATORS',
    GBF_COMPONENT_INDICATORS    : 'GBF-COMPONENT-INDICATORS',
    GBF_COMPLEMENTARY_INDICATORS: 'GBF-COMPLEMENTARY-INDICATORS',
    GBF_TARGETS_CONSIDERATIONS  : 'GBF-TARGETS-CONSIDERATIONS',
}

export const ROLES = {
    ADMINISTARATOR           : 'administrator',
    NATIONAL_FOCALPOINT     : 'nationalFocalPoint',
    NATIONAL_AUTHORIZED_USER: 'nationalAuthorizedUser',
    PUBLISHING_AUTHORITIES  : 'publishingAuthorities',
    ALL_NATIONAL_USERS      : ['nationalFocalPoint', 'nationalAuthorizedUser', 'publishingAuthorities']
}
// ROLES["ALL_NATIONAL_USERS"] = [ROLES.NATIONAL_FOCALPOINT]

export const SCHEMAS = {
    NATIONAL_TARGET_7         : 'nationalTarget7',
    NATIONAL_TARGET_7_MAPPING : 'nationalTarget7Mapping',
    
    NATIONAL_REPORT_7         : 'nationalReport7'
}

export const UTILS = {
    ROWS_PER_PAGE : 25,
}