
export const ObjectToArray = function(response:Record<string, Object>):Array<any> {
       
    let obj:Array<any> = [];
    for(const key in response) {
        if(response.hasOwnProperty(key)) {
            if(Array.isArray(response[key]))
                obj = [...obj, ...response[key].map(e=> ({...e, key}))];
            else
                obj.push({...response[key], key});
        }
    }
    
    return obj;
    
}