import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import profile from './modules/profile';
import feedback from './modules/feedback';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    auth,
    profile,
    feedback
  }
});

export default store;
