const $state = () => ({
  realmConf: {},
});

const $getters = {

  getRealm(state) { return state.realmConf; },

  getSchema(state) {
    return (schema)=> {
      return (state.realmConf?.schemas||{})[schema]
    };
  },

  getRole(state) {

    return (roleName, schema, schemaType)=> {
      if(!state.realmConf?.schemas)
        return;

      var patchedRoleName = $getters.patchRoleName(roleName);
      var roles;
      if(schema){
          var schemaDetails = state.realmConf?.schemas[schema];
          roles = schemaDetails[patchedRoleName]; //get specific role [PA, NAU, NFP]
          
          // if roles are not overridden then apply fallback roles National/Reference
          roles = roles || $getters.fallbackRoles(state)(schemaDetails.type, patchedRoleName);
      }
      else if(schemaType)
          roles = $getters.fallbackRoles(state)(schemaType, patchedRoleName);
      else 
          roles = state.realmConf?.roles[patchedRoleName];
      
      if(!roles)
          console.warn(roleName + ' role is not configured for realm ' + state.realmConf?.realm + ', please update realm-configuration');
          
      return roles || [roleName];
    }
  },

  nationalRoles(state) {
    return (schema)=> {
      if(!state.realmConf?.schemas)
        return;

      var nationalFallbackRoles = _(state.realmConf?.roles)
                                  .map(function(roles, key){
                                      if(_.includes(['publishingAuthorities','nationalAuthorizedUser','nationalFocalPoint'], key))
                                          return roles;
                                  }).flatten().compact().uniq().value();
      
      var schemas = state.realmConf?.schemas[schema] ? [state.realmConf?.schemas[schema]] : state.realmConf?.schemas;
      var nationalSchemaRoles    =  _(schemas)
              .map(function(schema, key){
                  if(schema.type == 'national' && key != 'contact')
                      return _.union(schema.publishingAuthorities||[], schema.nationalAuthorizedUser||[])
              }).flatten().compact().uniq().value();

      return _(nationalSchemaRoles).union(nationalFallbackRoles)
              .flatten().compact().uniq().without('User', 'user').value();
    }
  },

  nationalSchemaRoles(state) {
    return (schema)=>{
      if(!state.realmConf?.schemas)
        return;

      console.warn("OBSOLETE: use realm.nationalRoles();");
      
      return $getters.nationalRoles(schema);   
    } 
  },

  schemaRoles(state) {
    return (schema, roleName)=>{
      if(!state.realmConf?.schemas)
        return;

      var schemaDetails = state.realmConf?.schemas[schema];
      var roles = [];
      
      if(roleName){
          roles = schemaDetails[roleName]; //get specific role PA OR NAU oR NFP                    
          roles = roles || $getters.fallbackRoles(schemaDetails.type, roleName);
      }
      else {
          roles = _.union(schemaDetails.publishingAuthorities||$getters.fallbackRoles(state)(schemaDetails.type, 'publishingAuthorities'), 
                          schemaDetails.nationalAuthorizedUser||$getters.fallbackRoles(state)(schemaDetails.type, 'nationalAuthorizedUser'));
          
      }
      
      return _(roles).flatten().compact().uniq().value();
    }
  },

  fallbackRoles(state) {
    return (schemaType, roleName)=>{
      if(!state.realmConf?.schemas)
        return;

      if(schemaType == 'national')
          return state.realmConf?.roles[roleName];
      else if(schemaType == 'reference'){
          if(roleName == 'publishingAuthorities')//For all other type SCBD should be Admin
              return state.realmConf?.roles['scbdPublishingAuthorities'] || state.realmConf?.adminRoles; 
          else
              return ['User'];// Any registered user can submit request
      }
      else
          console.warn(schemaType + ' is invalid schemaType for role' + roleName);
      
      return [roleName];
    }
  },

  patchRoleName(roleName) {
            
    roleName = roleName.replace(/^Abs/i,'');
    roleName = roleName[0].toLowerCase() + roleName.substr(1);

    return roleName;
  }
};

/* eslint-disable no-param-reassign */
const CLEAR          = 'CLEAR';
const SET_REALM_CONF = 'SET_REALM_CONF'
const $mutations = {

  [SET_REALM_CONF](state, realmConf = {}) {
    
    state.realmConf = realmConf
  },

  [CLEAR](state) {
    state.realmConf = {};
  },
};
/* eslint-enable no-param-reassign */

const $actions = {

  async initialize({ commit }) {
    commit(CLEAR);
    
    const realmConf = await this.$api.realmConfiguration.getRealmConfigurationByHost(this.$config.REALM_CONF_HOST);
    commit(SET_REALM_CONF, realmConf[0]);


    return realmConf;
  },
};
export {
  $state     as state,
  $getters   as getters,
  $actions   as actions,
  $mutations as mutations,
};