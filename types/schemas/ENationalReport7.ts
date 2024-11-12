import type { EHeader } from "./base/EHeader";
import type { ETerm } from "./base/ETerm";
import type { ELstring } from "./base/ELstring";
import type { ELink } from "./base/ELink";
export interface ENationalReport7 {
    header                         : EHeader;
    government                     : ETerm;
    additionalInformation          : ELstring;
    additionalDocuments            : ELink[];
    notes                          : string;
}