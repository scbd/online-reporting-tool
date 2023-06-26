import _ from 'lodash';

export const removeEmpty = function(obj){
    if(!obj)
        return;
    const newObj = {};
    Object.entries(obj).forEach(([k, v]) => {
      if (v === Object(v)) {
        newObj[k] = removeEmpty(v);
      } else if (v && v != null) {
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
  