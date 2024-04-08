
interface ENationalTarget7Mapping {
    header                    : EHeader;
    government                : ETerm;
    globalGoalOrTarget        : ETerm;
    elementOfGlobalTargetsInfo: ELstring;
    referencePeriod           : TargetReferencePeriod[];
    additionalInformation     : ELstring;
    additionalDocuments       : ELink[];
    notes                     : string;
}

interface TargetReferencePeriod {
    headlineIndicator  : EReference;
    hasReferencePeriod : boolean;
    referencePeriodInfo: ELstring;
}