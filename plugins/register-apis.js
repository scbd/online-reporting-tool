import GaiaApi from '~/api/gaia';

export default (context, inject) => {
  const gaiaApi = new GaiaApi(context);

  
  inject('gaiaApi',   gaiaApi);
};
