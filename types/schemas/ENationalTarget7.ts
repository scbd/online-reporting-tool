
interface ENationalTarget7 {
    header                         : EHeader;
    government                     : ETerm;
    title                          : ELString;
    description                    : ELString;
    sequence                       : number;
    globalGoalAlignment            : ETerm[];
    globalTargetAlignment          : TargetAlignment[];
    degreeOfAlignmentInfo          : ELString;
    implementingConsiderations     : ETerm[];
    implementingConsiderationsInfo : ELString;
    mainPolicyOfMeasureOrActionInfo: ELString;
    headlineIndicators             : ETerm[];
    binaryIndicators               : ETerm[];
    componentIndicators            : ETerm[];
    complementaryIndicators        : ETerm[];
    otherNationalIndicators        : NationalIndicators[];
    nonStateActorCommitmentInfo    : ELString;
    hasNonStateActors              : boolean;
    nonStateActorsInfo             : ELString;
    additionalImplementation       : LTerm;
    additionalImplementationInfo   : ELString;
    additionalInformation          : ELString;
    additionalDocuments            : ELink[];
    notes                          : string;
}

interface LTerm extends ETerm {

}

interface TargetAlignment extends ETerm {
    degreeOfAlignment: ETerm;
}

interface NationalIndicators
{
    identifier  : string;
    value       : ELString;
}