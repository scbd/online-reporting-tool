export default function ({$config, $axios, error: nuxtError }) {

    $axios.setBaseURL($config.API_HOST_URL)

    $axios.onError(error => {
      nuxtError({
        statusCode: error.response.status,
        message: error.message,
      });
      return Promise.resolve(false);
    })

    $axios.onRequest(config=>{
        // console.log(config)
        return config;
    })
  }