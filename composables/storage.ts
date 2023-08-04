import _ from 'lodash';
import { removeEmpty } from '@/utils';

export const useStorage = ()=>{
    return {
        cleanDocument
    }
    
}

const cleanDocument = (document:any)=>{

    return removeEmpty(document);    

}
