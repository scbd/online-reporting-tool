import type { ETerm } from "~/types/schemas/base/ETerm";

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

export const sortTermByName = (a:any,b:any)=>a.name.localeCompare(b.name);

export const uniqueBy = (array:any[], predicate:(item:any)=>string)=>{
    const uniqueArray = array?.reduce((acc, curr) => {
        if(!curr) return acc;
        const existing = acc.find((item:any) => predicate(item) === predicate(curr));
        if (!existing) {
            acc.push(curr);
        }
        return acc;
    }, []);
    return uniqueArray;

}