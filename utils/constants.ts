// export * from './thesaurus.js'

export const THESAURUS = {
    GBF_GLOBAL_GOALS            : 'GBF-GOALS',
    GBF_GLOBAL_TARGETS          : 'GBF-TARGETS',
    GBF_GLOBAL_GOALS_TARGETS    : 'GBF-GOALS-TARGETS',
    GBF_HEADLINE_INDICATORS     : 'GBF-HEADLINE-INDICATORS',
    GBF_BINARY_INDICATORS       : 'KMGBF-BINARY-INDICATORS',    
    GBF_COMPONENT_INDICATORS    : 'GBF-COMPONENT-INDICATORS',
    GBF_COMPLEMENTARY_INDICATORS: 'GBF-COMPLEMENTARY-INDICATORS',
    GBF_TARGETS_CONSIDERATIONS  : 'GBF-TARGETS-CONSIDERATIONS',
    GBF_DEGREE_OF_ALIGNMENT     : 'GBF-DEGREE-OF-ALIGNMENT',
    OTHER_LANGUAGES             : 'ISO639-2',
    UN_LANGUAGES                : '52AFC0EE-7A02-4EFA-9277-8B6C327CE21F',
    POLICY_INSTRUMENTS          : '35772D10-DB54-4BF8-954E-F685A05F7FEA',
    STAKEHOLDERS                : '5C948D98-B7CC-4755-A767-3A4B9607DE52',
    ASSESSMENT_PROGRESS         : 'EF99BEFD-5070-41C4-91F0-C051B338EEA6'
}

export const ROLES = {
    ADMINISTRATOR           : 'administrator',
    NATIONAL_FOCALPOINT     : 'nationalFocalPoint',
    NATIONAL_AUTHORIZED_USER: 'nationalAuthorizedUser',
    PUBLISHING_AUTHORITIES  : 'publishingAuthorities',
    ALL_NATIONAL_USERS      : ['nationalFocalPoint', 'nationalAuthorizedUser', 'publishingAuthorities']
}
// ROLES["ALL_NATIONAL_USERS"] = [ROLES.NATIONAL_FOCALPOINT]

export const SCHEMAS = {
    NATIONAL_TARGET_7                   : 'nationalTarget7',
    NATIONAL_TARGET_7_MAPPING           : 'nationalTarget7Mapping',    
    NATIONAL_REPORT                     : 'nationalReport',
    NATIONAL_REPORT_6                   : 'nationalReport6',
    NATIONAL_REPORT_7                   : 'nationalReport7',
    NATIONAL_REPORT_7_INDICATOR_DATA    : 'nationalReport7IndicatorData',
    NATIONAL_REPORT_7_BINARY_INDICATOR_DATA    : 'nationalReport7BinaryIndicatorData'
}

export const UTILS = {
    ROWS_PER_PAGE : 25,
    CACHE_TIMEOUT : 1000 * 60 * 5 // 5 minutes
}