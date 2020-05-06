import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
// global components

import Feedback from '@/components/Feedback';
Vue.component('feedback', Feedback);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  computed: {
    token() {
      return this.$store.getters.token;
    }
  },
  watch: {
    token(value) {
      if (value !== null) {
        this.$store.dispatch('loadUser')
      }
    }
  },
  created() {
    if (localStorage.token) {
      this.$store.dispatch('loadUser');
    }
  }
}).$mount('#app');
