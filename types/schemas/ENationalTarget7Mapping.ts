import type { EHeader } from "./base/EHeader";
import type { ETerm } from "./base/ETerm";
import type { ELstring } from "./base/ELstring";
import type { ELink } from "./base/ELink";
import type { EReference } from "./base/EReference";
export interface ENationalTarget7Mapping {
    header                    : EHeader;
    government                : ETerm;
    globalGoalOrTarget        : ETerm;
    elementOfGlobalTargetsInfo: ELstring;
    referencePeriod           : TargetReferencePeriod[];
    additionalInformation     : ELstring;
    additionalDocuments       : ELink[];
    notes                     : string;
}

export interface TargetReferencePeriod {
    headlineIndicator  : EReference;
    hasReferencePeriod : boolean;
    referencePeriodInfo: ELstring;
}