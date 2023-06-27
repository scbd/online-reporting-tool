

import { mapStores }            from 'pinia'
import { useRealmConfStore }    from '@/stores/realmConf';
import { ROLES }                from '@/constants';

let realmConfStore;

export default ({ route, $auth, redirect, store, $pinia }) => {
   
  realmConfStore = mapStores(useRealmConfStore).realmConfStore();
  if(!realmConfStore.realmConf?.realm)//realmConf not loaded yet
    return;

  const options = getRouteComponentOptions(route, 'auth', 'roles', 'meta');  
  
  if (!checkUserAccess($auth, options, store)) redirect('/forbidden');
};

function getRouteComponentOptions(route, ...keys) {
  const options = {
    path : route.path||route.fullPath
  };

  route.matched.forEach((m) => {
    keys.forEach((key) => {
      const value = m.components.default.options[key];
      if (options[key] === undefined && value !== undefined) options[key] = value;
    });
  });

  return options;
}

function checkUserAccess(auth, options, store) {
  if (options.auth === false || options.auth === 'guest') return true;

  const { roles } = options;

  if(!auth.user?.government){
    const adminRoles = realmConfStore.getRole(ROLES.ADMINSTRATOR);
    if (adminRoles?.some((r) => auth.hasScope(r))){
      return true;
    }
  }

  // get authorized roles from realm
  let schemaRoles = [];
  if(options?.meta?.schema){
    schemaRoles = realmConfStore.schemaRoles(options.meta.schema)
  }

  if (!roles && !schemaRoles){
    throw new Error(`Role is not configured for ${options.path}.`);
  }
  
  // verify user has government
  if(schemaRoles && !auth.user?.government){
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

export { getRouteComponentOptions, checkUserAccess };
