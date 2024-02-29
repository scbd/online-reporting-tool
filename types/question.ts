interface Question {

    key         : string;
    section     : string;
    number      : string;
    type        : string;
    title       : string;
    multiple    : Boolean;
    options     : QuestionOption[];
    mandatory   : Boolean;
}

interface QuestionOption {
    value      : string
    title  : string
}