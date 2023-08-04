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
    return  element.hasOwnProperty('ar') || element.hasOwnProperty('en') ||
            element.hasOwnProperty('fr') || element.hasOwnProperty('es') || 
            element.hasOwnProperty('ru') || element.hasOwnProperty('zh');
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

        return valueA.localeCompare(valueB);

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
    }, 100);
}