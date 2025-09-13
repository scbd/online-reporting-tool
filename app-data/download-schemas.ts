import messages from '~/i18n/dist/app-data/download-schemas.json'

import { useI18n } from 'vue-i18n'
export const downloadSchemas = {
    get schemas(){

        const { t, availableLocales, } = useI18n()
        return {	
            "nationalTarget7" : {
               "publishedOn"                       : t("publishedOn"),
               "recordUrl"                          : t("url"),
               "uniqueId"                           : t("uniqueId"),
               "government"                         : t("government"),
               "title"                              : t("title"),
               "description"                        : t("description"),
               "mainPolicyOfMeasureOrActionInfo"    : t("mainPolicyOfMeasureOrActionInfo"),
               "globalGoalAlignmentIds"                : t("contributionToGoals"),
               "globalTargetAlignmentIds"              : t("targetsAlignment"),
            //    "degreeOfAlignment"                  : t("degreeOfAlignment"),
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
            "nationalTarget7Mapping" : {
                "publishedOn"                        : t("publishedOn"),
                "recordUrl"                          : t("url"),
                "uniqueId"                           : t("uniqueId"),
                "government"                         : t("government"),
                "title"                              : t("title"),
                "elementOfGlobalTargetsInfo"         : t("elementOfGlobalTargetsInfo")                
            },
            "nbsap" : {
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
            }
        }
    }
} 



