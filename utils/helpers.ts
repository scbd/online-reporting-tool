//@ts-nocheck
import _ from 'lodash';
import $ from 'jquery';

export const removeEmpty = (obj)=> {

    return function remove(current) {
      _.forOwn(current, function (value, key) {
        if (_.isUndefined(value) || _.isNull(value) || _.isNaN(value) ||
          (_.isString(value) && _.isEmpty(value)) ||
          (_.isObject(value) && _.isEmpty(remove(value)))) {
  
          delete current[key];
        }
      });

      if (_.isArray(current)) _.pull(current, undefined);
  
      return current;
  
    }(_.cloneDeep(obj));
}


export function asArray(data) {
    return _([ data ])
      .flatten()
      .compact()
      .value();
}
  
export function getTargetNumber(target:String){

  return target
        .replace(/GBF\-TARGET\-/, '')
        .replace(/^0/, '')
  
}

export function isLString(element){
    return Object.keys(element).some(l=>/^[a-z]{2,3}$/.test(l)); 
}

export function sortBy(list:Array, property){
    
    const { locale } = useNuxtApp().$i18n;
    return list.sort((a:any ,b:any )=>{
        let valueA = a[property];
        let valueB = b[property];


        if(isLString(valueA)){
            valueA = lstring(valueA, locale.value)
            valueB = lstring(valueB, locale.value)
        }

        if(_.isEmpty(valueA))
            return 1;
        if(_.isEmpty(valueB))
            return -1;
        
        return valueA?.trim().localeCompare(valueB?.trim());

    })
}

export const sleep = (ms)=> new Promise(resolve=> setTimeout(resolve, ms));

export const scrollToElement = (querySelector, container)=>{
    container = container || 'body,html'
    const qLabel = $(container).find(querySelector);
    const qBody  = $(container);

    var scrollNum = qLabel.offset().top

    if(container!= 'body,html'){
        //its a dialog calculate scrollTop
        var dialogContainer = $(container)
        scrollNum = scrollNum - dialogContainer.offset().top + dialogContainer.scrollTop();
    }
    else
        scrollNum -= 130; //forms 

    qBody.stop().animate({
        scrollTop: scrollNum
    }, 'slow');
}

export const isWorkflowAssignedToMe = function (activity:object) {
    const { user } = useAuth();
    return activity && _.includes(activity.assignedTo || [], user.value.userID || -1);
};

export const isWorkFlowCreatedByMe = function(workflow){
    const { user } = useAuth();   
    return workflow && workflow.createdBy == user.value.userID;
}

export const resolveSchemaViewRoute = function(schema:String, identifier){

    const schemaDetails = useGetRealmSchema(schema);

    if(schemaDetails){
        let url = ''
        if(schema == SCHEMAS.NATIONAL_TARGET_7)
            url = appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_VIEW;
        else if(schema == SCHEMAS.NATIONAL_TARGET_7_MAPPING)
            url = appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_II_VIEW;
        else if(schema == SCHEMAS.NATIONAL_NBSAP)
            url = appRoutes.NATIONAL_REPORTS_NBSAP_MY_COUNTRY_VIEW;
            
        return url.replace(':identifier', identifier);
    }
}

export const  flattenObject = function(obj, parentKey = '') {
    let flattened = {};

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
        const propName = parentKey ? `${parentKey}.${key}` : key;

        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(flattened, flattenObject(obj[key], parentKey ? propName : ''));
        } else {
            flattened[propName] = obj[key];
        }
        }
    }

    return flattened;
}


export function mapObjectId(id){
    return isObjectId(id)? { $oid: id } : id
}

export function isObjectId(id){
    return /^[a-f0-9]{24}/i.test(id);
}