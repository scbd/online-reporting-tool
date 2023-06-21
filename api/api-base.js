import axios from 'axios'


export default class ApiBase
{
  constructor({ $config, $axios }, tokenReader) {
    this.$axios = $axios;
    this.$config = $config;
  }
}

//////////////////////////
// Helpers
////////////////////////

export function tryCastToApiError(error) {

  console.error(error);

  if(error && error.response && error.response.data && error.response.data.code) {
      const apiError = error.response.data
      throw error.response.data;
  }

  throw error
}

export function mapObjectId(id){
  return isObjectId(id)? { $oid: id } : id
}

export function isObjectId(id){
  return /^[a-f0-9]{24}/i.test(id);
}