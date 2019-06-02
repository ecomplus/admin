import Vue from 'vue'
import Vuex from 'vuex'
import { storeApi } from '@/lib/apis'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    store_id: 0,
    lang: null,
    auth: {
      my_id: null,
      access_token: null
    }
  },

  mutations: {

  },

  actions: {
    callStoreApi ({ state }, { method, endpoint, data }) {
      return storeApi(
        state.store_id,
        endpoint,
        method,
        data,
        state.auth.my_id,
        state.auth.access_token
      )
    }
  }
})
