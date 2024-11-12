import type { ELstring } from "../schemas/base/ELstring";

export interface ThesaurusTerm {
    termId:           number;
    identifier:       string;
    name:             string;
    title:            ELstring;
    shortTitle:       ELstring;
    description:      string;
    longDescription:  ELstring;
    source:           string;
    broaderTerms:     Array<string>;
    narrowerTerms:    Array<string>;
    relatedTerms:     Array<string>;
    nonPreferedTerms: Array<string>;
}
