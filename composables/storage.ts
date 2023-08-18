import _ from 'lodash';
import { removeEmpty } from '@/utils';

export const useKmStorage = ()=>{
    return {
        cleanDocument
    }
    
}

const cleanDocument = (document:Object)=>{

    return removeEmpty(document);    

}
