import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import position from './modules/position'
import product from './modules/product'
import common from './modules/common'
Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  actions,
  getters,
  modules: {
    position,
    product,
    common
  },
  strict: debug
})