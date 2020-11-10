import Vue from 'vue';
import Vuex from 'vuex';
import * as getters from './getters';
import * as actions from './actions';
import mutations from './mutations';
import state from './state';
import createLogger from "vuex/dist/logger";

// 需要注册vuex到vue中
Vue.use(Vuex);

const debug =process.env.NODE_ENV !=="production"
const store = new Vuex.Store({
  getters,
  mutations,
  state,
  actions,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

export default store
