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
  