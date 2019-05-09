<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4 lg2>
        <v-card color="transparent">
          <v-toolbar dark color="primary" flat dense>
            <v-toolbar-title>Dynamite Dollars</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-text-field v-model="email" prepend-icon="fas fa-user" type="email" label="Email"></v-text-field>
            <v-text-field
              v-model="password"
              prepend-icon="fas fa-lock"
              type="password"
              label="Password"
            ></v-text-field>
            <v-btn block color="accent" @click="login()">login</v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { mapActions } from "vuex";
import firebase from "../firebaseConfig.js";

export default {
  data: () => {
    return {
      email: null,
      password: null
    };
  },
  methods: {
    ...mapActions({
      toastError: "toast/error",
      toastSuccess: "toast/success"
    }),
    login() {
      firebase.auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
          if (!user) {
            this.$router.push("/login");
          } else {
            this.$router.push({ path: "expenses" });
          }
        })
        .catch(error => {
          this.toastError(error.message);
        });
    }
  }
};
</script>
