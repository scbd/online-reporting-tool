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
    ASSESSMENT_PROGRESS         : 'EF99BEFD-5070-41C4-91F0-C051B338EEA6',
    COUNTRIES                   : 'countries',
    REGIONS                     : 'regions',
    CBD_REGIONAL_GROUPS         : 'E6566232-EE63-4C7B-AF8B-46A26CC295A5',

    JURISDICTIONS               : "50AC1489-92B8-4D99-965A-AAE97A80F38E", 
    APPROVED_STATUS             : "E27760AB-4F87-4FBB-A8EA-927BDE375B48", 
    APPROVING_BODY              : "F1A5BFF1-F555-40D1-A24C-BBE1BE8E82BF", 
    REPORT_STATUS               : "7F0D898A-6BF1-4CE6-AA77-7FEAED3429C6", 
    REPORT_TYPES                : "2FD0C77B-D30B-42BC-8049-8C62D898A193",
    OTHER                       : "5B6177DD-5E5E-434E-8CB7-D63D67D5EBED",
    ORGANIZATION_TYPES          : "Organization Types",
    GEOGRAPHICAL_SCOPE          : "ort-nr-geographical-scope",
}

export const THESAURUS_TERMS = {
    HIGH    : 'AABF237C-F906-40D2-9595-5226C8B18A58',
    MEDIUM  : '68197B76-67B4-40AD-BB14-A8C340E1320B',
    LOW     : '9668759B-3653-4994-A917-3F039B0BAA5C',
    NONE    : 'none',
    STATUS_DRAFT                               : "9D17F3A2-EC92-4D31-81EF-A12521873D7F",
    STATUS_FINAL                               : "1C37E358-5295-46EB-816C-0A7EF2437EC9" ,
    STATUS_APPROVED                            : "851B10ED-AE62-4F28-B178-6D40389CC8DB",
    APPROVING_BODY_NATIONAL_COMMITTEE          : "905C1F7F-C2F4-4DCE-A94E-BE6D6CE6E78F",
    APPROVING_BODY_MINISTER                    : "E7398F2B-FA36-4F42-85C2-5D0044440476",
    APPROVING_BODY_INTER_MINISTERIAL_COMMITTEE : "D3A4624E-21D9-4E49-953F-529734538E56",
    JURISDICTION_FEDERAL                       : "7437F880-7B12-4F26-AA91-CED37250DD0A",
    JURISDICTION_LOCAL                         : "geographical-scope-local",
    JURISDICTION_SUB_NATIONAL                  : "DEBB019D-8647-40EC-8AE5-10CA88572F6E",
    JURISDICTION_NATIONAL                      : "7437F880-7B12-4F26-AA91-CED37250DD0A",
    JURISDICTION_REGIONAL                      : "528B1187-F1BD-4479-9FB3-ADBD9076D361",
    JURISDICTION_MULTINATIONAL                 : "528B1187-F1BD-4479-9FB3-ADBD9076D361"
}

export const ROLES = {
    ADMINISTRATOR           : 'administrator',
    NATIONAL_FOCALPOINT     : 'nationalFocalPoint',
    NATIONAL_AUTHORIZED_USER: 'nationalAuthorizedUser',
    PUBLISHING_AUTHORITIES  : 'publishingAuthorities',
    ALL_NATIONAL_USERS      : ['nationalFocalPoint', 'nationalAuthorizedUser', 'publishingAuthorities'],
    EVERYONE                : 'everyone'
}
// ROLES["ALL_NATIONAL_USERS"] = [ROLES.NATIONAL_FOCALPOINT]

export const SCHEMAS = {
    NATIONAL_NBSAP                      : 'nbsap',
    NATIONAL_TARGET_7                   : 'nationalTarget7',
    NATIONAL_TARGET_7_MAPPING           : 'nationalTarget7Mapping',    
    NATIONAL_REPORT                     : 'nationalReport',
    NATIONAL_REPORT_6                   : 'nationalReport6',
    NATIONAL_REPORT_7                   : 'nationalReport7',
    NATIONAL_REPORT_7_INDICATOR_DATA    : 'nationalReport7IndicatorData',
    NATIONAL_REPORT_7_BINARY_INDICATOR_DATA    : 'nationalReport7BinaryIndicatorData',
    REFERENCE_NON_STATE_ACTOR_COMMITMENT_INTENT    : 'nonStateActorCommitmentIntent'
}

export const UTILS = {
    ROWS_PER_PAGE_25  : 25,
    ROWS_PER_PAGE_300 : 300,
    CACHE_TIMEOUT : 1000 * 60 * 5 // 5 minutes
}
export const HTTP_STATUS = {
    BAD_REQUEST : 400,
    INTERNAL_SERVER_ERROR : 500
}

export const CBD_GREEN = '#2c9844';

export const ATTACHMENTS_API_REGEX = /\/api\/v2013\/documents\/(.+?)\/attachments\/(\d+)\/(.*?)(\/.*|$)/;