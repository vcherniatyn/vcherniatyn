import Vue from 'vue'
import Router from 'vue-router';
import { AxiosStatic } from 'axios';

declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'vue/types/vue' {
    interface Vue {
        $axios: AxiosStatic,
        $router: Router
    }
}