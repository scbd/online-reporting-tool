const $state = () => ({
  auth: {},
});

const $getters = {

  getToken(state) { return state.auth?.token; },

  getUser({ state }) {
    return state.auth?.user
  },
};

/* eslint-disable no-param-reassign */
const SET_TOKEN = 'SET_TOKEN';
const CLEAR    = 'CLEAR';

const $mutations = {

  [SET_TOKEN](state, token = undefined) {
    state.auth.token = token
  },

  [CLEAR](state) {
    state.auth = {};
  },
};
/* eslint-enable no-param-reassign */

const $actions = {

  async initialize({ commit }) {
    commit(CLEAR);

    const token = {};

    commit(SET_TOKEN, token);

    return countries;
  },
  setToken({ commit }, token) {
    commit(SET_TOKEN, token);
  },
};

export {
  $state     as state,
  $getters   as getters,
  $actions   as actions,
  $mutations as mutations,
};