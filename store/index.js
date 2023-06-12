const $state = () => ({
  ortBase:{},
});

const CLEAR                   = 'CLEAR';

/* eslint-disable no-param-reassign */
const $mutations = {

  [CLEAR](state) {
    state.ortBase = null;
  },
};
/* eslint-enable no-param-reassign */

const $getters = {
  
  ortBaseStore({ ortBase }) {
    return ortBase;
  },
};

const $actions = {
  clear({ commit }) {
    commit('countries/CLEAR',     null);
    commit('realmConf/CLEAR',    null);
    commit(CLEAR, null);
  },

  async initialize({ commit }) {
    return {};
  },
};
export {
  $state     as state,
  $mutations as mutations,
  $getters   as getters,
  $actions   as actions,
};