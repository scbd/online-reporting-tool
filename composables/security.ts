
import { useRealmConfStore }    from '@/stores/realmConf';
import { ROLES }                from '@/constants';

export const useSecurity = ()=>{
    return {
        checkUserAccess
    }
}


async function checkUserAccess(options:any) {
    options = options ||{};
// debugger;
    const auth = useAuth() 
    const authUser = useAuth()?.user?.value;
    const realmConfStore = useRealmConfStore();
    
    await realmConfStore.loadRealmConf();

    if (options.auth === false || options.auth === 'guest') return true;

    const { roles, schema } = options;

    if(!authUser?.government){
        const adminRoles = realmConfStore.getRole(ROLES.ADMINSTRATOR);
        if (adminRoles?.some((r) => auth.hasScope(r))){
        return true;
        }
    }

    // get authorized roles from realm
    let schemaRoles = [];
    if(schema){
        schemaRoles = realmConfStore.schemaRoles(schema)
    }

    if (!roles && !schemaRoles){
        throw new Error(`Role is not configured for ${options.path}.`);
    }

    // verify user has government
    if(schemaRoles && !authUser?.government){
        return false;
    }

    if ((roles?.length||0) === 0 && (schemaRoles?.length||0) === 0){ 
        return true;
    }

    //if there roles specified on the page verify user has role(s)
    if (roles?.some((r) => auth.hasScope(r))){
        return true;
    }

    //if there schema roles verify user has role(s)
    if(schemaRoles?.some((r) => auth.hasScope(r))){
        return true;
    }

    return false;
}
  