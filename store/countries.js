import _ from 'lodash';

const $state = () => ({
  countries: [],
});

const $getters = {

  list(state) { return state.countries; },

  getCountryByCode({ countries }) {
    return (code) => countries.find((c) => c.code === code.toLowerCase());
  },

  getNameByCode(state, getters) {
    return (code) => (getters.getCountryByCode(code) || {}).name || code;
  },
};

/* eslint-disable no-param-reassign */
const SET_LIST = 'SET_LIST';
const CLEAR    = 'CLEAR';

const $mutations = {

  [SET_LIST](state, countries = []) {
    state.countries = _.sortBy(countries, (c) => c.name.toLowerCase());
  },

  [CLEAR](state) {
    state.countries = [];
  },
};
/* eslint-enable no-param-reassign */

const $actions = {

  async initialize({ commit }) {
    commit(CLEAR);

    const countries = await this.$countriesApi.getCountries();

    commit(SET_LIST, countries);

    return countries;
  }
};

export {
  $state     as state,
  $getters   as getters,
  $actions   as actions,
  $mutations as mutations,
};
