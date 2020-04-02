"use strict";

import Vue from 'vue';
import axios from "axios";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
    function (config) {
        // const user = JSON.parse(localStorage.getItem('user') ?? '');

        // if (user && user.token) {
        //     config.headers.Authorization = 'Bearer ' + user.token ;
        // } else {
        //     delete config.headers.Authorization;
        // }
    // Do something before request is sent
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
    function (response) {
        // if (response.data && response.data.statusCode) {
        //     if (response.data.statusCode === 200) {
        //         if (response.data.message) {
        //             Vue.notify({
        //                 type: 'info',
        //                 duration: 7000,
        //                 group: 'main',
        //                 title: 'Request success',
        //                 text: response.data.message
        //             });
        //         }
        //         return response;
        //     }
        //     else {
        //         Vue.notify({
        //             type: 'warn',
        //             duration: 7000,
        //             group: 'main',
        //             title: 'Request info',
        //             text: response.data.message
        //         });
        //         return null;
        //     }
        // }
        
        return response;
  },
  function(error) {
      // Vue.notify({
      //     type: 'error',
      //     duration: 7000,
      //     group: 'main',
      //     title: 'Request failed',
      //     text: error
      // });
      // //error.message.toUpperCase().includes('STATUS CODE 401')
      // if (error.response.status === 401) {
      //     localStorage.removeItem('user');
      //     if (window.location.pathname !== '/login') {
      //         location.reload(true);
      //     }
      // }
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;
