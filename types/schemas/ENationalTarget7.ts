
interface ENationalTarget7 {
    header                         : EHeader;
    government                     : ETerm;
    title                          : typeof ELstring;
    description                    : typeof ELstring;
    sequence                       : number;
    globalGoalAlignment            : ETerm[];
    globalTargetAlignment          : TargetAlignment[];
    degreeOfAlignmentInfo          : typeof ELstring;
    implementingConsiderations     : ETerm[];
    implementingConsiderationsInfo : typeof ELstring;
    mainPolicyOfMeasureOrActionInfo: typeof ELstring;
    headlineIndicators             : ETerm[];
    binaryIndicators               : ETerm[];
    componentIndicators            : ETerm[];
    complementaryIndicators        : ETerm[];
    otherNationalIndicators        : typeof ELstring[];
    nonStateActorCommitmentInfo    : typeof ELstring;
    hasNonStateActors              : boolean;
    nonStateActorsInfo             : typeof ELstring;
    additionalImplementation       : LTerm;
    additionalImplementationInfo   : typeof ELstring;
    additionalInformation          : typeof ELstring;
    additionalDocuments            : ELink[];
    notes                          : string;
}

interface LTerm extends ETerm {

}

interface TargetAlignment extends ETerm {
    degreeOfAlignment: ETerm;
}