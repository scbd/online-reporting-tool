
interface ENationalTarget7 {
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

interface LTerm extends ETerm {

}

interface TargetAlignment extends ETerm {
    degreeOfAlignment: ETerm;
}

interface NationalIndicators
{
    identifier  : string;
    value       : ELstring;
}