import type { ELstring } from "./ELstring";
export class ETerm{
    title : ELstring;
    identifier:string;
    name?:string;

    constructor( title : ELstring, identifier:string, name?:string){
        this.title      = title;
        this.identifier = identifier;
        this.name       = name;
    }
}