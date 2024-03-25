interface Question {

    key         : string;
    section     : string;
    number      : string;
    type        : string;
    title       : string;
    multiple    : Boolean;
    options     : QuestionOption[];
    mandatory   : Boolean;
    questions   : Question[];
    answer      : string; // used for ng-model
}

interface QuestionOption {
    value      : string
    title  : string
}