import type { ETerm } from "./base/ETerm";
import type { ELstring } from "./base/ELstring";
import type { ELink } from "./base/ELink";

export interface EContactBase {
    // prefix: ELstring|undefined;
    firstName: string;
    // middleName: string|undefined;
    lastName: string;
    // gender: ETerm|undefined;
    designation: ELstring;
    organization: ELstring;
    organizationAcronym: ELstring;
    department: ELstring;
    organizationType: ETerm;
    address: ELstring;
    city: ELstring;
    state: ELstring;
    postalCode: ELstring;
    country: ETerm;
    phones: string[];
    // faxes: string[];
    emails: string[];
    websites: ELink[];
}