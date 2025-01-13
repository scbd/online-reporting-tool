import type { ELstring } from "./ELstring";
export class ETerm{
    title : ELstring;
    identifier:String;

    constructor( title : ELstring, identifier:String){
        this.title      = title;
        this.identifier = identifier;
    }
}