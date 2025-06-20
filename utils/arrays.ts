
export const arrayToObject = function<T>(response:Array<any>):Record<string, T> | undefined {
    if(response && Array.isArray(response)) {
        // If response is not an array or is empty, return undefined
        if(response.length === 0) {
            return undefined;
        }

        const obj:Record<string, T> = {};
        response.forEach(e=>{
            obj[e.identifier] = e;
        });

        return obj;

    }
}