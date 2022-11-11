import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import runtime from './modules/runtime'
import base from './modules/base'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    runtime,
    base
  },
  getters
})

export default store
