import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './types';
import { User } from '../models/User';

Vue.use(Vuex);

// Vuex structure based on https://codeburst.io/vuex-and-typescript-3427ba78cfa8

const store: StoreOptions<RootState> = {
  state: {
        version: '1.0.0', // a simple property
        isLogined: !(!(localStorage.getItem('user') ?? '')),
        user: (JSON.parse(localStorage.getItem('user') ?? '{}') as User) ?? {},
  },
};

export default new Vuex.Store<RootState>(store);
