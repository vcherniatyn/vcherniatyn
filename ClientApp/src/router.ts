import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/index';
import { Role } from '@/store/Role';
import { Meta } from './models/Meta';

Vue.use(Router);



export const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'users',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "users" */ './views/Users.vue'),
            meta: new Meta(true, [ Role.Administrator ]),
        },
        // otherwise redirect to home
        { path: '*', redirect: '/', meta: new Meta(false, [])  },
    ],
});

export default router;
