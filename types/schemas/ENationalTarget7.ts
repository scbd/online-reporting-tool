
interface ENationalTarget7 {
    header                         : EHeader;
    government                     : ETerm;
    title                          : typeof ELString;
    description                    : typeof ELString;
    sequence                       : number;
    globalGoalAlignment            : ETerm[];
    globalTargetAlignment          : TargetAlignment[];
    degreeOfAlignmentInfo          : typeof ELString;
    implementingConsiderations     : ETerm[];
    implementingConsiderationsInfo : typeof ELString;
    mainPolicyOfMeasureOrActionInfo: typeof ELString;
    headlineIndicators             : ETerm[];
    binaryIndicators               : ETerm[];
    componentIndicators            : ETerm[];
    complementaryIndicators        : ETerm[];
    otherNationalIndicators        : typeof ELString[];
    nonStateActorCommitmentInfo    : typeof ELString;
    hasNonStateActors              : boolean;
    nonStateActorsInfo             : typeof ELString;
    additionalImplementation       : LTerm;
    additionalImplementationInfo   : typeof ELString;
    additionalInformation          : typeof ELString;
    additionalDocuments            : ELink[];
    notes                          : string;
}

interface LTerm extends ETerm {

}

interface TargetAlignment extends ETerm {
    degreeOfAlignment: ETerm;
}