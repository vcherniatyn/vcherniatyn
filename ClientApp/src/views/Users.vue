<template>
    <v-container fluid>
        <v-slide-y-transition mode="out-in">
            <v-row>
                <v-col>
                    <v-data-table :headers="headers"
                                  :items="users"
                                  :loading="loading"
                                  :search="search"
                                  :options="options"
                                  :footer-props="{ showFirstLastPage: true, itemsPerPageOptions: [25, 50, 100, 200, 500] }"
                                  class="elevation-1">

                        <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
                        <template v-slot:top>
                            <v-toolbar flat color="white">
                                <v-toolbar-title>Users</v-toolbar-title>
                                <v-divider class="mx-4"
                                           inset
                                           vertical></v-divider>
                                <v-text-field v-model="search"
                                              append-icon="mdi-magnify"
                                              label="Search"
                                              single-line
                                              hide-details></v-text-field>

                                <v-spacer></v-spacer>

                                <v-dialog v-model="dialog" max-width="500px">
                                    <template v-slot:activator="{ on }">
                                        <v-btn color="primary"
                                               dark
                                               class="mb-2"
                                               v-on="on"
                                               :disabled="!isAddUserEnabled()">New User</v-btn>
                                    </template>
                                    <v-card ref="form">
                                        <v-card-title>
                                            <span class="headline">{{ formTitle }}</span>
                                        </v-card-title>

                                        <v-card-text>
                                            <v-container>
                                                <v-row>
                                                    <v-col cols="12" sm="6" md="4">
                                                        <v-text-field ref="name"
                                                                      v-model="editedItem.name"
                                                                      label="Username"
                                                                      required
                                                                      :readonly="editedIndex > 0"
                                                                      :rules="rules.userName"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="4">
                                                        <v-text-field ref="email"
                                                                      v-model="editedItem.email"
                                                                      label="Email"
                                                                      required
                                                                      :rules="rules.email"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="4">
                                                        <v-text-field ref="password"
                                                                      v-model="editedItem.password"
                                                                      label="Password"
                                                                      type="password"
                                                                      :rules="[passwordCheck]"></v-text-field>
                                                    </v-col>
                                                    <v-col cols="12" sm="12" md="12">
                                                        <v-combobox ref="roles"
                                                                    v-model="editedItem.roles"
                                                                    :items="roles"
                                                                    :rules="rules.roles"
                                                                    multiple
                                                                    dense></v-combobox>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-card-text>
                                        <v-alert :value="showDialogError" type="error" v-text="errorDialogMessage">
                                        </v-alert>
                                        <v-divider class="mt-12"></v-divider>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="blue darken-1"
                                                   text
                                                   @click="close">Cancel</v-btn>
                                            <v-btn color="blue darken-1"
                                                   text
                                                   @click="save">Save</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-toolbar>
                        </template>
                        <template v-slot:item.lastLoginDate="{ item }">
                            {{item.lastLoginDate | datetime}}
                        </template>
                        <template v-slot:item.isActive="{ item }">
                            <v-btn small
                                   :color="getColor(item.isActive)"
                                   @click="changeIsActiveState(item)"
                                   :loading="item.isActiveLoading">{{ item.isActive }}</v-btn>
                        </template>
                        <template v-slot:item.action="{ item }">
                            <v-icon large
                                    class="mr-2"
                                    @click="editUser(item)">
                                mdi-pencil
                            </v-icon>
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
                                        <v-btn color="green darken-1" text @click="closeRemove">Cancel</v-btn>
                                        <v-btn color="green darken-1" text @click="removeUser(removedUser);">Remove</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </template>
                        <template v-slot:no-data>
                            <v-btn color="primary" @click="fetchUsers">Reload</v-btn>
                        </template>

                    </v-data-table>

                </v-col>
            </v-row>
        </v-slide-y-transition>
    </v-container>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { User } from '../models/User';
    import { Response } from '../models/Response';
    import Validator from 'vee-validate';

    export default Vue.extend({
        data() {
            return {
                options: {
                      page: 1,
                      itemsPerPage: 50,
                },
                loading: true,
                showDialogError: false,
                errorDialogMessage: '',

                users: [] as User[],
                roles: [] as string[],

                search: '',
                removeDialog: false,
                dialog: false,
                editedIndex: -1 as number,
                editedItem: new User(0, '', '', '', new Date(), [], false),
                defaultItem: new User(0, '', '', '', new Date(), [], false),
                removedUser: {} as User,

                formHasErrors: false,
                rules: {
                    userName: [
                        (value: string) => !!value || 'Required.',
                        (value: string) => value?.length >= 6 && value?.length < 16 || 'Min 6 characters and max 15 symbols',
                    ],
                    email: [
                        (value: string) => !!value || 'E-mail is required',
                        (value: string) => /.+@.+\..+/.test(value) || 'E-mail must be valid',
                    ],
                    roles: [
                        (value: string[]) => !!value || 'Min 1 role required',
                        (value: string[]) => value?.length > 0 || 'Min 1 role required',
                    ],
                },

                headers: [
                    { text: 'Id', value: 'id' },
                    { text: 'UserName', value: 'name' },
                    { text: 'Email', value: 'email' },
                    { text: 'Roles', value: 'roles' },
                    { text: 'LastLoginDate', value: 'lastLoginDate' },
                    { text: 'IsActive', value: 'isActive', sortable: false },
                    { text: 'Actions', value: 'action', sortable: false },
                ],
            };
        },
        computed: {
            formTitle(): string {
                return this.editedIndex === -1 ? 'New User' : ('Edit ' + this.editedItem.name);
            },
            form(): any {
                return {
                    name: this.editedItem.name,
                    email: this.editedItem.email,
                    password: this.editedItem.password,
                    roles: this.editedItem.roles,
                };
            },
        },
        watch: {
            dialog(val) {
                val || this.close();
            },
        },

        methods: {
            getColor(isActive: boolean) {
                return isActive === true ? 'green' : 'yellow';
            },
            passwordCheck() {
                if ((!this.editedItem.password || this.editedItem.password.length < 8) &&
                    this.editedItem.id === 0) {
                    return 'Required, min 8 characters';
                }
                if (this.editedItem.id !== 0 && this.editedItem.password != null) {
                    return 'Required, min 8 characters';
                }
                return true;
            },
            isAddUserEnabled() {
                if (this.users) {
                    const newUser = this.users.filter((user) => user.id === 0);
                    return newUser == null || newUser.length === 0;
                } else {
                    return false;
                }
            },
            async fetchUsers() {
                try {
                    this.users.push( new User(1, 'test1', '', '', new Date(), [], false),
                                     new User(22, 'test2', '', '', new Date(), [], false),
                                     new User(3, 'test3', '', '', new Date(), [], false))
                } catch (e) {
                    this.users = [];
                }
                this.loading = false;
            },
            async fetchRoles() {
                try {
                    this.roles.push('administrator', 'user');
                } catch (e) {
                    this.roles = [];
                }
            },
            async saveUser(user: User) {
                try {
                    user.saveLoading = true;
                    //await this.$axios.post('api/user/save', user);
                } catch (e) {
                    throw e;
                }
                user.saveLoading = false;
            },
            async removeUser(user: User) {
                try {
                    if (user.id !== 0) {
                        user.removeLoading = true;
                        //await this.$axios.get(`api/user/remove/id=${user.id}`);
                    }
                    this.users.splice(this.users.indexOf(user), 1);
                } catch (e) { }
                user.removeLoading = false;
                this.closeRemove();
            },
            async changeIsActiveState(user: User) {
                try {

                    user.isActiveLoading = true;
                    if (user.id !== 0) {
                        //await this.$axios.get(`api/user/ChangeActiveState/id=${user.id}&state=${!user.isActive}`);
                    }
                    user.isActive = !user.isActive;
                } catch (e) { }
                user.isActiveLoading = false;
            },

            editUser(user: User) {
                this.editedIndex = this.users.indexOf(user);
                this.editedItem = Object.assign({}, user);
                this.dialog = true;
            },

            close() {
                this.showDialogError = false;
                this.errorDialogMessage = '';
                this.dialog = false;
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editedIndex = -1;
                }, 300);
            },

            closeRemove() {
                this.removeDialog = false;
            },

            async save() {
                this.showDialogError = false;
                this.errorDialogMessage = '';
                this.formHasErrors = false;

                Object.keys(this.form).forEach((f) => {
                    if (!this.form[f]) {
                        if (f === 'password' && this.editedItem.id > 0) {
                            // password can be empty for already existing users
                        }
                        else {
                            this.formHasErrors = true;
                        }
                    }
                });
                if (this.users.filter((x) => x.name === this.editedItem.name && x.id !== this.editedItem.id).length > 0) {
                    this.formHasErrors = true;
                    this.showDialogError = true;
                    this.errorDialogMessage = `User with specified name '${this.editedItem.name}' already exists. Use another name.`;
                }
                if (this.editedItem.name.length < 6 || this.editedItem.name.length > 15) {
                    this.formHasErrors = true;
                    this.showDialogError = true;
                    this.errorDialogMessage = `Specified name length should be beetwen 6 abd 16 symbols.`;
                }
                if (/.+@.+\..+/.test(this.editedItem.email)) {
                    this.formHasErrors = true;
                    this.showDialogError = true;
                    this.errorDialogMessage = `Specified email is invalid`;
                }
                if (this.formHasErrors) {
                    return;
                }

                if (this.editedIndex > -1) {
                    Object.assign(this.users[this.editedIndex], this.editedItem);
                } else {
                    this.users.push(this.editedItem);
                }
                try {
                    await this.saveUser(this.editedItem);
                    await this.fetchUsers();
                    this.close();
                }
                catch (e) {
                    return;
                }
            },
        },
        async created() {
            await this.fetchRoles();
            await this.fetchUsers();
        },
    });
</script>
