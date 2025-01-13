//@ts-nocheck
import { defineStore } from 'pinia'
import _ from 'lodash';

export const useRealmConfStore = defineStore('realmConf', {
  state: () => {
    return {
      realmConf: {},
    }
  },
  getters:{
    getRealm(state) { 
      return state.realmConf; 
    },
    getSchema(state) {
      return (schema:string)=> {
        return (state.realmConf?.schemas||{})[schema]
      };
    },
    getRole(state) {

      return (roleName:string, schema:string = '', schemaType:string='')=> {
        if(!state.realmConf?.schemas)
          return;
          
        var roles;
        if(schema){
            var schemaDetails = state.realmConf?.schemas[schema];
            roles = schemaDetails[roleName]; //get specific role [PA, NAU, NFP]
            
            // if roles are not overridden then apply fallback roles National/Reference
            roles = roles || this.fallbackRoles(schemaDetails.type, roleName);
        }
        else if(schemaType)
            roles = this.fallbackRoles(schemaType, roleName);
        else 
            roles = state.realmConf?.roles[roleName];
        
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
                                        if(['publishingAuthorities','nationalAuthorizedUser','nationalFocalPoint'].includes(key))
                                            return roles;
                                    }).flatten().compact().uniq().value();
        
        var schemas = state.realmConf?.schemas[schema] ? [state.realmConf?.schemas[schema]] : state.realmConf?.schemas;
        var nationalSchemaRoles    =  _(schemas)
                .map(function(schema, key){
                    if(schema.type == 'national' && key != 'contact')
                        return [...(schema.publishingAuthorities||[]), ...(schema.nationalAuthorizedUser||[])]
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
        
        return this.nationalRoles(schema);   
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
            roles = roles || this.fallbackRoles(schemaDetails.type, roleName);
        }
        else {
            roles = [ ...(schemaDetails.publishingAuthorities||this.fallbackRoles(schemaDetails.type, 'publishingAuthorities')), 
                      ...(schemaDetails.nationalAuthorizedUser||this.fallbackRoles(schemaDetails.type, 'nationalAuthorizedUser'))];
            
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
    patchRoleName(state) {
      return (roleName)=>{
        roleName = roleName.replace(/^Abs/i,'');
        roleName = roleName[0].toLowerCase() + roleName.substr(1);

        return roleName;  
      }
    }
  },
  actions:{
    async loadRealmConf(retry = 0){
        const realHost = useRuntimeConfig().public.REALM_CONF_HOST;
        if(!this.realmConf?.realm){
            const { $api } = useNuxtApp();
            const a = useNuxtApp();
                        
            if(!$api){
                if(retry > 3)
                    return;
                await sleep(500);
                return this.loadRealmConf(retry+1);
            }
            else{
                const realmConf = await $api.realmConfiguration.getRealmConfigurationByHost(realHost);
                this.realmConf = realmConf[0];
            }
        };
    },
  }
})