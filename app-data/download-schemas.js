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
               "additionalImplementation"           : t("additionalMeanOfImplementation"),
               "additionalImplementationCustomValue": t("pleaseExplain"),
               "additionalImplementationInfo"       : t("additionalExplanation"),
               "additionalInformation"              : t("relevantInformation"),
            }
        }
    }
} 



