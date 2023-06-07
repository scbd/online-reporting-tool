

export default class {
  constructor({ $config, $axios }, tokenReader) {
    this.$axios = $axios;
    this.$config = $config;
  }

  // ====================
  //
  // ====================
  async queryRealmConf(host) {
    
    const res = await this.$axios.get(`api/v2018/realm-configurations/${host||this.$config.REALM_CONF_HOST||''}`);

    return res.data;
  }
}
