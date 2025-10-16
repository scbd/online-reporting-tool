import type { EHeader } from "./base/EHeader";
import type { ETerm } from "./base/ETerm";
import type { ELstring } from "./base/ELstring";
import type { ELink } from "./base/ELink";
import type { EReference } from "./base/EReference";
import type { EContactBase } from "./EContactBase";

export interface EStakeholderCredential extends EStakeHolderContact {
	header: EHeader;
	isParty: boolean;
	government: ETerm;
	authorityDocuments: ELink[];
	authorizedEmails: string[];
	additionalInformation: ELstring;
	additionalDocuments: ELink[];
	notes: string;
}


export interface EStakeHolderContact extends EContactBase {    
	jurisdiction: ETerm;
	jurisdictionCountries: ETerm[];
	jurisdictionRegions: ETerm[];
}