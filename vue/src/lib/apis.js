import { URL_STORE_API } from '@/lib/constants'
import axios from 'axios'

const reqOptions = (storeId, url, method = 'GET', data) => {
  // common axios options
  return {
    header: {
      'X-Store-ID': storeId
    },
    url,
    method,
    data,
    // milliseconds request time out
    timeout: method === 'GET' ? 10000 : 30000
  }
}

export const storeApi = (storeId, endpoint, method, data, myId, accessToken) => {
  // setup axios options object
  let options = reqOptions(storeId, URL_STORE_API + endpoint, method, data)
  if (myId) {
    // authenticated request
    options.header['X-My-ID'] = myId
    options.header['X-Access-Token'] = accessToken
  }
  // returns ajax request promise
  return axios(options)
}
