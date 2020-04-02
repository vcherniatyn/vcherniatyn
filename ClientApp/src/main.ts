import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Vue from 'vue';
import './plugins/notification';
import './plugins/axios';
import vuetify from './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from '@/store/index';
import './registerServiceWorker';
import dateTimeFilter from '@/filters/datetime.filter';
import dateFilter from '@/filters/date.filter';

Vue.config.productionTip = false;
Vue.filter('datetime', dateTimeFilter);
Vue.filter('date', dateFilter);

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
