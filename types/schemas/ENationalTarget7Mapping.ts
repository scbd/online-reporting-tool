
interface ENationalTarget7Mapping {
    header                    : EHeader;
    government                : ETerm;
    globalGoalOrTarget        : ETerm;
    elementOfGlobalTargetsInfo: typeof ELString;
    referencePeriod           : TargetReferencePeriod[];
    additionalInformation     : typeof lstring;
    additionalDocuments       : ELink[];
    notes                     : string;
}

interface TargetReferencePeriod {
    headlineIndicator  : EReference;
    hasReferencePeriod : boolean;
    referencePeriodInfo: typeof lstring;
}