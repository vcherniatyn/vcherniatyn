<template>
  <v-app>

    <v-content>
        <v-container fluid>
        <v-slide-y-transition mode="out-in">
            <v-row>
                <v-col>
                    <v-data-table :headers="headers"
                                  :items="users"
                                  class="elevation-1">
                        <template v-slot:item.action="{ item }">
                            <v-dialog v-model="removeDialog" persistent max-width="350">
                                <template v-slot:activator="{ on }">
                                    <v-icon large v-on="on"
                                            @click="removedUser = item;">
                                        mdi-delete
                                    </v-icon>
                                </template>
                                <v-card>
                                    <v-card-title class="headline">Remove -{{removedUser.name}}- user?</v-card-title>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="green darken-1" text @click="removeDialog = false">Cancel</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </template>
                    </v-data-table>

                </v-col>
            </v-row>
        </v-slide-y-transition>
    </v-container>
    </v-content>

  </v-app>
</template>


<script lang="ts">
    import Vue from 'vue';
    import { User } from './models/User';

    export default Vue.extend({
        data() {
            return {
                users: [    new User(1, 'test1', '', '', new Date(), [], false),
                             new User(22, 'test2', '', '', new Date(), [], false),
                             new User(3, 'test3', '', '', new Date(), [], false)],

                
                removeDialog: false,
                removedUser: {} as User,

                headers: [
                    { text: 'Actions', value: 'action', sortable: false },
                ],
            };
        },
    });
</script>
