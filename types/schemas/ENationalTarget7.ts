import type { EHeader } from "./base/EHeader";
import type { ETerm } from "./base/ETerm";
import type { ELstring } from "./base/ELstring";
import type { ELink } from "./base/ELink";

export interface ENationalTarget7 {
    header                         : EHeader;
    government                     : ETerm;
    title                          : ELstring;
    description                    : ELstring;
    sequence                       : number;
    globalGoalAlignment            : ETerm[];
    globalTargetAlignment          : TargetAlignment[];
    degreeOfAlignmentInfo          : ELstring;
    implementingConsiderations     : ETerm[];
    implementingConsiderationsInfo : ELstring;
    mainPolicyOfMeasureOrActionInfo: ELstring;
    headlineIndicators             : ETerm[];
    binaryIndicators               : ETerm[];
    componentIndicators            : ETerm[];
    complementaryIndicators        : ETerm[];
    otherNationalIndicators        : NationalIndicators[];
    nonStateActorCommitmentInfo    : ELstring;
    hasNonStateActors              : boolean;
    nonStateActorsInfo             : ELstring;
    additionalImplementation       : LTerm;
    additionalImplementationInfo   : ELstring;
    additionalInformation          : ELstring;
    additionalDocuments            : ELink[];
    notes                          : string;
}

export interface LTerm extends ETerm {

}

export interface TargetAlignment extends ETerm {
    degreeOfAlignment: ETerm;
}

export interface NationalIndicators
{
    identifier  : string;
    value       : ELstring;
}