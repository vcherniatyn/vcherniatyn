<template>
  <v-app>

    <v-navigation-drawer persistent :mini-variant="miniVariant" :clipped="clipped" v-model="drawer" enable-resize-watcher fixed app
                         v-if="isLogined">
      <v-list>
          <v-list-item value="true" v-for="(item, i) in items" :key="i" :to="item.link">
              <v-list-item-action>
                  <v-icon v-html="item.icon"></v-icon>
              </v-list-item-action>
              <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
          </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar v-if="isLogined" app :clipped-left="clipped" color="info" dark>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-btn class="d-none d-lg-flex" icon @click.stop="miniVariant = !miniVariant">
            <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
        </v-btn>
        <v-btn class="d-none d-lg-flex" icon @click.stop="clipped = !clipped">
            <v-icon>web</v-icon>
        </v-btn>
        <v-toolbar-title v-text="title"></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-chip class="ma-2"
                color="info"
                text-color="white"
                pill>
            <v-icon left>mdi-account-outline</v-icon>
            {{userName}}
        </v-chip>
        <v-divider class="mx-4"
                   inset
                   vertical></v-divider>
        <v-btn color="indigo lighten-5"
               outlined
               text
               @click="logOut">LogOut</v-btn>
    </v-app-bar>

    <v-content>
        <router-view />
        <notifications group="main" position="bottom right" />
    </v-content>

    <v-footer app>
        <span>&nbsp;XXX&nbsp;&copy;&nbsp;{{ new Date().getFullYear() }}</span>
    </v-footer>

  </v-app>
</template>

<script lang="ts">
    import Vue from 'vue';
    import store from '@/store/index';
    import { MenuItem } from './models/MenuItem';
    import { Role } from '@/store/Role';

    export default Vue.extend({
        data() {
            return {
                clipped: true,
                drawer: true,
                miniVariant: false,
                right: true,
                title: 'XXX site',
                userName: store.state.user.name,
                isLogined: store.state.isLogined,

                items: [
                    new MenuItem('Users', 'perm_identity', '/', store.state.isLogined, []),
                ] as MenuItem[],
            };
        },
        methods: {
            logOut() {
                //new UserService().logout();
            },
        },
    });
</script>
