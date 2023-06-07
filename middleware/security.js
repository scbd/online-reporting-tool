
export default ({ route, $auth, redirect, store }) => {
  
  console.log('middleware', store.state.realmConf.realmConf, route)
 
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

  // get authorized roles from realm
  let schemaRoles = [];
  if(options?.meta?.schema)
    schemaRoles = store.getters['realmConf/schemaRoles'](options.meta.schema)

  if (!roles && !schemaRoles) throw new Error(`Role is not configured for ${options.path}.`);
  
  // verify user has government
  if(schemaRoles && !auth.user.government)
    return false;
 
  if (roles.length === 0 && schemaRoles.length === 0) return true;

  //if there roles specified on the page verify user has role(s)
  if (roles.some((r) => auth.hasScope(r))) return true;
  
  //if there schema roles verify user has role(s)
  if(schemaRoles?.some((r) => auth.hasScope(r))) return true;

  return false;
}

export { getRouteComponentOptions, checkUserAccess };
