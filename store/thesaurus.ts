import _ from 'lodash';

const $state = () => ({
  domains: [],
  domainTerms : {},
  terms       : {}
});

const $getters = {

  getDomain(state) {
    return async(domainName : string) =>{

      let domain = state.domains?.find(e=>e.identifier==domainName)
      if(!domain){
        domain = await this.$api.thesaurs.getDomain(domainName);
        commit(SET_DOMAIN, domain);
      };

      return domain;
    }
  },

  getDomainTerms(state, getters) {
    return async(term : string) =>{

      let terms = state.domains?.find(e=>e.identifier==domainName)
      if(!domain){
        terms = await this.$api.thesaurs.getDomain(domainName);
        commit(SET_DOMAIN_TERMS, terms);
      };

      return terms;
    }
  },

  getTerm(state, getters) {
    return (term) => (getters.getCountryByCode(term) || {}).name || term;
  },
  
};

/* eslint-disable no-param-reassign */
const SET_DOMAIN = 'SET_DOMAIN';
const SET_DOMAIN_TERMS = 'SET_DOMAIN_TERMS';
const CLEAR    = 'CLEAR';

const $mutations = {

  [SET_DOMAIN](state, domain) {
    state.domains.push(domain);
  },

  [SET_DOMAIN_TERMS](state, domain) {
    state.domainTerms[domain.term] = domain;
  },

  [CLEAR](state) {
    state.domains = [];
    state.domainTerms = {};
    state.terms = {}
  },
};
/* eslint-enable no-param-reassign */

const $actions = {

  async initialize({ commit }) {
    // commit(CLEAR);
  }
};

export {
  $state     as state,
  $getters   as getters,
  $actions   as actions,
  $mutations as mutations,
};
