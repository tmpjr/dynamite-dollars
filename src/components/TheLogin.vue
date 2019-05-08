<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4 lg2>
        <v-card flat color="transparent" class="elevation-12">
          <v-toolbar dark color="primary" flat dense>
            <v-toolbar-title>Dynamite Dollars</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-text-field v-model="email" prepend-icon="fas fa-user" label="Email"></v-text-field>
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
import { mapMutations } from "vuex";
import firebase from "../firebaseConfig.js";

export default {
  data: () => {
    return {
      email: null,
      password: null,
      actionCodeSettings: {
        url: "http://localhost:8080",
        handleCodeInApp: true
      }
    };
  },
  methods: {
    ...mapMutations({
      setToast: "toast/setToast",
      setToastColor: "toast/setColor",
      alert: "toast/alert",
      success: "toast/success"
    }),
    loginWithEmailLink() {
      firebase.auth
        .sendSignInLinkToEmail(this.email, this.actionCodeSettings)
        .then(() => {
          window.localStorage.setItem("emailForSignIn", this.email);
          this.success("An login link has been sent to " + this.email + ".");
        })
        .catch(error => {
          this.alert(error.message);
        });
    },
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
          console.log("error!");
          console.log(error.message);
          this.alert(error.message);
        });
    }
  }
};
</script>
