import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import admin from './module/admin'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    app,
    admin
  }
})
