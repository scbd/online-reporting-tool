import type { ELstring } from "./ELstring";
export class ETerm{
    title : ELstring;
    identifier:string;

    constructor( title : ELstring, identifier:string){
        this.title      = title;
        this.identifier = identifier;
    }
}