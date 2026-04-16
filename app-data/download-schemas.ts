import messages from '~/i18n/dist/app-data/download-schemas.json' with { type: "json" };;

import { useI18n } from 'vue-i18n'
export const downloadSchemas = {
    get schemas(){

        const { t, availableLocales, } = useI18n({            
            messages,
            useScope:'local'
        })
        return {	
            "nationalTarget7" : {
                default: {
                    "publishedOn"                       : t("publishedOn"),
                    "recordUrl"                          : t("url"),
                    "uniqueId"                           : t("uniqueId"),
                    "government"                         : t("government"),
                    "title"                              : t("title"),
                    "description"                        : t("description"),
                    "mainPolicyOfMeasureOrActionInfo"    : t("mainPolicyOfMeasureOrActionInfo"),
                    "globalGoalAlignmentIds"                : t("contributionToGoals"),
                    "globalTargetAlignmentIds"              : t("targetsAlignment"),
                    "globalTargetAndDegreeOfAlignment"   : t("globalTargetAndDegreeOfAlignment"),
                    "degreeOfAlignmentInfo"              : t("degreeOfAlignmentInfo"),
                    "gbfTargetConsideration"             : t("considerationForImplementation"),
                    "implementingConsiderationsInfo"     : t("explainConsideration"),
                    "headlineIndicators"                 : t("headlineIndicators"),
                    "binaryIndicators"                   : t("binaryIndicators"),
                    "componentIndicators"                : t("componentIndicators"),
                    "complementaryIndicators"            : t("complementaryIndicators"),
                    "otherNationalIndicators"            : t("otherNationalIndicators"),
                    "nonStateActorCommitmentInfo"        : t("listOfNonStateActors"),
                    "hasNonStateActors"                  : t("anyOverlaps"),
                    "nonStateActorsInfo"                 : t("commitmentsAndActors"),
                    "additionalImplementation"           : t("additionalImplementation"),
                    "additionalImplementationCustomValue": t("additionalImplementationCustomValue"),
                    "additionalImplementationInfo"       : t("additionalExplanation"),
                    "additionalInformation"              : t("relevantInformation"),
                },
                optional: {}
            },
            "nationalTarget7Mapping" : {
                default: {
                    "publishedOn"                        : t("publishedOn"),
                    "recordUrl"                          : t("url"),
                    "uniqueId"                           : t("uniqueId"),
                    "government"                         : t("government"),
                    "title"                              : t("title"),
                    "elementOfGlobalTargetsInfo"         : t("elementOfGlobalTargetsInfo")                
                },
                optional: {}
            },
            "nbsap" : {
                default: {
                    "publishedOn"                       : t("publishedOn"),
                    "recordUrl"                          : t("url"),
                    "uniqueId"                           : t("uniqueId"),
                    "government"                         : t("government"),
                    "title"                              : t("title"),
                    "summary"                        : t("summary"),
                    "isGbfAligned"        : t("isGbfAligned"),
                    "jurisdiction"        : t("jurisdiction"),
                    "startDate"           : t("startDate"),
                    "endDate"             : t("endDate"),
                    "statusOfTheDocument" : t("statusOfTheDocument"),
                    "adoptionDate"        : t("adoptionDate"),
                    "approvedStatus"      : t("approvedStatus"),
                    "approvingBody"       : t("approvingBody"),
                    "approvingBodyInfo"   : t("approvingBodyInfo"),
                    "documentLinks.url"       : t("documentLinks"),
                    "relevantInformation" : t("relevantInformation"),
                },
                optional: {}
            },
            "nationalReport7-sectionI" : {
                default: {
                    "publishedOn"                       : t("publishedOn"),
                    "recordUrl"                          : t("url"),
                    "uniqueId"                           : t("uniqueId"),
                    "government"                         : t("government"),
                    "cbdRegion"                          : t("cbdRegion"),
                    "contactDetails"                     : t("contactDetails"),
                    "contactPerson"                      : t("contactPerson"),
                },
                optional: {
                    "additionalImplementationInfo"       : t("additionalImplementationInfo"),
                    "additionalInformation"              : t("relevantInformation"),}
            },
            "nationalReport7-sectionII" : {
                default: {
                    "publishedOn"                       : t("publishedOn"),
                    "recordUrl"                          : t("url"),
                    "uniqueId"                           : t("uniqueId"),
                    "government"                         : t("government"),
                    "cbdRegion"                          : t("cbdRegion"),
                    "hasRevisedNbsap"                    : t("hasRevisedNbsap"),
                    "anticipatedNbsapDate"               : t("anticipatedNbsapDate"),
                    "hasStakeholderEngagement"           : t("hasStakeholderEngagement"),
                    "stakeholders"                       : t("stakeholders"),
                    "hasNbsapAdopted"                    : t("hasNbsapAdopted"),
                    "hasNbsapAdoptedInfo"                : t("hasNbsapAdoptedInfo"),
                    "anticipatedNbsapAdoptionDate"       : t("anticipatedNbsapAdoptionDate"),
                    "policyInstrument"                   : t("policyInstrument"),
                    "implementationProgress"             : t("implementationProgress")          
                },
                optional: {}
            },
            "nationalReport7-sectionIII" : {
                default: {
                    "publishedOn"                       : t("publishedOn"),
                    "recordUrl"                          : t("url"),
                    "uniqueId"                           : t("uniqueId"),
                    "government"                         : t("government"),
                    "cbdRegion"                          : t("cbdRegion"),
                    "targetType"                         : t("targetType"),
                    "target"                             : t("target"),
                    "globalGoals"                        : t("globalGoals"),
                    "globalTargets"                      : t("globalTargets"),
                    "degreeOfAlignment"                  : t("degreeOfAlignment"),
                    "mainActionsSummary"                 : t("mainActionsSummary"),
                    "progressSummary"                    : t("progressSummary"),
                    "keyChallengesSummary"               : t("keyChallengesSummary"),
                    "actionEffectivenessSummary"         : t("actionEffectivenessSummary"),
                    "levelOfProgress"                    : t("levelOfProgress")
                },
                optional: {}
            },
            "nationalReport7-sectionIV" : {
                default: {
                    "publishedOn"                       : t("publishedOn"),
                    "recordUrl"                          : t("url"),
                    "uniqueId"                           : t("uniqueId"),
                    "government"                         : t("government"),
                    "cbdRegion"                          : t("cbdRegion"),
                    "goal"                        : t("goal"),
                    "summaryOfProgress"                  : t("summaryOfProgress")
                },
                optional: {}
            },
            "nationalReport7-sectionV" : {
                default: {
                    "publishedOn"                       : t("publishedOn"),
                    "recordUrl"                          : t("url"),
                    "uniqueId"                           : t("uniqueId"),
                    "government"                         : t("government"),
                    "cbdRegion"                          : t("cbdRegion"),
                    "assessmentSummary"                  : t("assessmentSummary"),
                    "additionalDocuments"                : t("additionalDocuments"),
                    "relevantInformation"                : t("relevantInformation")
                },
                optional: {}
            },
            "nationalReport7-indicator-data" : {
                default: {
                   "publishedOn"                       : t("publishedOn"),
                   "recordUrl"                          : t("url"),
                   "uniqueId"                           : t("uniqueId"),
                   "government"                         : t("government"),
                   "cbdRegion"                          : t("cbdRegion"),
                   "targetType"                         : t("targetType"),
                   "target"                             : t("target"),
                   "indicator"                          : t("indicator"),
                   "indicatorCode"                      : t("indicatorCode"),
                   "indicatorType"                      : t("indicatorType"),
                   "globalGoals"                        : t("globalGoals"),
                   "globalTargets"                      : t("globalTargets"),
                   "degreeOfAlignment"                  : t("degreeOfAlignment"),
                   "sourceOfData"                       : t("sourceOfData"),
                   "sourceOfDataInfo"                   : t("sourceOfDataInfo"),
                   "hasDisaggregation"                  : t("hasDisaggregation"),
                   "disaggregationType"                 : t("disaggregationType"),
                   "disaggregation"                     : t("disaggregation"),
                   "comments"                           : t("comments"),
                   "year"                               : t("year"),
                   "value"                              : t("value"),
                   "unit"                               : t("unit"),
                   "footnote"                           : t("footnote")
                },
                optional: {}
            },
            "nationalReport7-binary-indicator-data" : {
                default: {
                   "publishedOn"                       : t("publishedOn"),
                   "recordUrl"                          : t("url"),
                   "uniqueId"                           : t("uniqueId"),
                   "government"                         : t("government"),
                   "cbdRegion"                          : t("cbdRegion"),
                   "targetType"                         : t("targetType"),
                   "target"                             : t("target"),
                   "indicator"                          : t("indicator"),
                   "indicatorCode"                      : t("indicatorCode"),
                   "indicatorType"                      : t("indicatorType"),
                   "globalGoals"                        : t("globalGoals"),
                   "globalTargets"                      : t("globalTargets"),
                   "degreeOfAlignment"                  : t("degreeOfAlignment"),
                   "questionNumber"                     : t("questionNumber"),
                   "responseTitle"                      : t("responseTitle"),
                   "comments"                           : t("comments"),
                },
                optional: {}
            }
        }
    }
} 



