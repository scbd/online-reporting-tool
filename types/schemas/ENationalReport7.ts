import type { EHeader } from "./base/EHeader";
import type { ETerm } from "./base/ETerm";
import type { ELstring } from "./base/ELstring";
import type { ELink } from "./base/ELink";
import type { EReference } from "./base/EReference";

export interface ENationalReport7 {
    header                         : EHeader;
    government                     : ETerm;
    sectionI                       : any
    sectionII                      : any
    sectionIII                     : SectionIII[]
    sectionIV                      : SectionIV[]
    sectionV                       : any
    sectionOtherInfo               : any
    additionalInformation          : ELstring;
    additionalDocuments            : ELink[];
    notes                          : string;
}

export interface LinkedIndicatorData {
    indicator: EReference;
    data: EReference;
}
export interface SectionIII {
    target: ETerm;
    targetType: string;
    mainActionsSummary: ELstring;
    levelOfProgress: ELstring;
    progressSummary: ELstring;
    keyChallengesSummary: ELstring;
    actionEffectivenessSummary: ELstring;
    indicatorData: {
        headline: Array<LinkedIndicatorData>;
        binary: Array<LinkedIndicatorData>;
        component: Array<LinkedIndicatorData>;
        complementary: Array<LinkedIndicatorData>;
        national: Array<LinkedIndicatorData>;
    };
}  

export interface SectionIV {
    gbfGoal: ETerm;
    summaryOfProgress: ELstring;
    indicatorData: {
        headline: Array<LinkedIndicatorData>;
        binary: Array<LinkedIndicatorData>;
        component: Array<LinkedIndicatorData>;
        complementary: Array<LinkedIndicatorData>;
        national: Array<LinkedIndicatorData>;
    };
}
