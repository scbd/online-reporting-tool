
import { useRealmConfStore }    from '@/stores/realmConf';
import { intersection }         from 'lodash';

export const useSecurity = ()=>{
    return {
        checkUserAccess,
        isInRoles,
        role : {
            isUserInRole             : isUserInRole,
            isUserInRoles            : isUserInRoles,
            is                       : is,
            isAdministrator          : isAdministrator,
            isPublishingAuthority    : isPublishingAuthority,
            isNationalAuthorizedUser : isNationalAuthorizedUser,
            isNationalFocalPoint     : isNationalFocalPoint,
            isUser                   : isUser,
            isNationalSchemaUser     : isNationalSchemaUser,
            isNationalUser           : isNationalUser,
            isSchemaUser             : isSchemaUser,
        }
    }
}

const quickObjs = {
    get user(){
        const $auth = useAuth();
        return $auth?.user?.value
    },
    get realmConfStore(){
        const lRealmConfStore  = useRealmConfStore();
        return lRealmConfStore;
    }
}

function isUserInRole(role:string) {				
    return isUserInRoles([role]);
};

function isUserInRoles(roles) {

    if (!quickObjs.user)
        return false;

    return intersection(quickObjs.user.roles, roles).length > 0;
};

function is(role, schema, schemaType) {
    return isUserInRoles(quickObjs.realmConfStore.getRole(role, schema, schemaType));
}

function isAdministrator() {
    return isUserInRoles(quickObjs.realmConfStore.getRole(ROLES.ADMINISTRATOR));
}

function isPublishingAuthority(schema, schemaType) {
    return isUserInRoles(quickObjs.realmConfStore.getRole('publishingAuthorities', schema, schemaType));
}

function isNationalAuthorizedUser(schema, schemaType) {
    return isUserInRoles(quickObjs.realmConfStore.getRole('nationalAuthorizedUser', schema, schemaType));
}

function isNationalFocalPoint() {
    return isUserInRoles(quickObjs.realmConfStore.getRole('nationalFocalPoint', undefined, 'national'));
}

function isUser() {
    return isUserInRoles(['User']);
}

// verifies if the user has roles at schema level, fallback to govt level otherwise
function isNationalSchemaUser(schema) {				
    return isPublishingAuthority(schema, 'national') || isNationalAuthorizedUser(schema, 'national') || isNationalFocalPoint();
}

// verifies if the user is in any roles object or roles overwritten at schema 
function isNationalUser(skipSchemaRoles) {
    var hasNationalRole = isPublishingAuthority(undefined, 'national') || isNationalAuthorizedUser(undefined, 'national') || isNationalFocalPoint();
    
    if(!skipSchemaRoles && !hasNationalRole){//check if the user has roles at schema level 
        // var schemaNationalRoles = quickObjs.realmConfStore.nationalRoles();
        // hasNationalRole = isUserInRoles(schemaNationalRoles)
    }
    
    return hasNationalRole;
}

function isSchemaUser(schema, schemaType){
    return 	isPublishingAuthority(schema, schemaType) || 
            isNationalAuthorizedUser(schema, schemaType) || 
            (isNationalFocalPoint() && quickObjs.realmConfStore.realmConf.schemas[schema]?.type=='national');
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
        const adminRoles = realmConfStore.getRole(ROLES.ADMINISTRATOR);
        if (adminRoles?.some((r) => auth?.hasScope(r))){
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
    if (roles?.some((r) => auth?.hasScope(r))){
        return true;
    }

    //if there schema roles verify user has role(s)
    if(schemaRoles?.some((r) => auth?.hasScope(r))){
        return true;
    }

    return false;
}

function isInRoles(roles:Array<string>){
    const $auth = useAuth();
    return roles?.some((r) =>$auth?.hasScope(r));
}
  