import _ from 'lodash';
import { removeEmpty } from '@/utils';

export const useStorage = ()=>{
    return {
        cleanDocument
    }
    
}

const cleanDocument = (document:any)=>{

    document = document || {};

    // const ldocument = simpleObject(document);
    // console.log(ldocument);
    document = sanitizeDocument(document);
    document = removeEmpty(document);

    return document;

}

const simpleObject = (document:any)=>{
    if(!(document.value||document)) return;

    const lDocument = document.value||document;
    _.forEach(lDocument, function(val:any, key:string){

        let fieldValue = val.value;

        if(_.isString(fieldValue) && _.trim(fieldValue||'') == ''){
            fieldValue = undefined;
          }
          else if(_.isArray(fieldValue)){
            fieldValue = simpleObject(fieldValue);            
          }
          else if(_.isPlainObject(fieldValue)){
            fieldValue = simpleObject(fieldValue);
          }
  
          lDocument[key] = fieldValue;        
    });

    return lDocument;

}

const sanitizeDocument = function(document : any){

    if(!document) return;

    document = sanitize(document);
    return document;

    function sanitize(doc:any){
      _.forEach(doc, function(fieldValue, key){
        
        if(_.isString(fieldValue) && _.trim(fieldValue||'') == ''){
          fieldValue = undefined;
        }
        else if(_.isArray(fieldValue)){
          fieldValue = sanitize(fieldValue);
          fieldValue = _.compact(fieldValue);
          
          if(_.isEmpty(fieldValue))
            fieldValue = undefined;
        }
        else if(_.isPlainObject(fieldValue)){
          fieldValue = sanitize(fieldValue);
          fieldValue = _.omit(fieldValue, isNullOrUndefinedOrEmpty);
        }

        doc[key] = fieldValue;

      });
      
      if(_.isArray(doc))
        doc = _.compact(doc)
      else if(_.isPlainObject(doc))
        doc = _.omit(doc, isNullOrUndefinedOrEmpty);
      
      return doc;
    }
    function isNullOrUndefinedOrEmpty(v){
      return v === undefined || v === null || (_.isObject(v) && _.isEmpty(v));
    }
}