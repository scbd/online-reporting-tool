import type { ELstring } from "./ELstring";
export class ETerm{
    title : ELstring;
    identifier:string;
    name?:string;
    narrowerTerms?: Array<string>;

    constructor( title : ELstring, identifier:string, name?:string, narrowerTerms?: Array<string>){
        this.title      = title;
        this.identifier = identifier;
        this.name       = name;
        this.narrowerTerms = narrowerTerms; 
    }
}