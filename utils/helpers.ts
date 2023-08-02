import _ from 'lodash';

//TODO revisit logic
export const removeEmpty = function(obj){
    if(!obj)
        return;
    let newObj;
    Object.entries(obj).forEach(([k, v]) => {
      if (_.isArray(v) && v.length) {
        newObj[k] = _.compact(v);
      }
      else if (v === Object(v)) {
        const newV = removeEmpty(v)
        if(newV && newV != null){
          newObj = newObj || {};
          newObj[k] = newV;
        }
      } else if (v && v != null) {
        newObj = newObj || {};
        newObj[k] = obj[k];
      }
    });
    return newObj;
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