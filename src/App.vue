<template>
  <v-app>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-bottom-navigation :value="showNav" app>
      <v-btn to="/expenses" value="expenses">
        <span>Expenses</span>
        <v-icon>fas fa-coins</v-icon>
      </v-btn>
      <v-btn to="/expense" value="expense">
        <span>Add Expense</span>
        <v-icon>fas fa-plus</v-icon>
      </v-btn>
      <v-btn to="/dashboard" value="dashboard">
        <span>Dashboard</span>
        <v-icon>fas fa-tachometer-alt</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <v-snackbar v-model="snackbar" :color="color">{{ message }}</v-snackbar>
    <v-dialog v-model="loadingActive" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          {{ loadingMessage }}
          <v-progress-linear intermediate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>
<script>
import firebase from "./firebaseConfig.js";
import { mapGetters, mapState } from "vuex";

export default {
  name: "App",
  computed: {
    ...mapGetters("toast", ["color", "message"]),
    ...mapState("loading", {
      loadingActive: state => state.active,
      loadingMessage: state => state.message
    }),
    snackbar: {
      get: function() {
        return !this.message ? false : true;
      },
      set: function() {
        this.$store.dispatch("toast/setCurrentStatus", {
          color: "info",
          message: ""
        });
      }
    }
  },
  data: () => {
    return {
      activeBtn: 1,
      nav: false,
      showNav: true,
      loadingDialog: false
    };
  },
  created() {
    firebase.auth.onAuthStateChanged(user => {
      if (!user) {
        this.showNav = false;
        this.hideLoading();
      } else {
        this.showNav = true;
      }
    });
  },
  methods: {
    logout() {
      firebase.auth.signOut().then(() => {
        this.$router.push({ name: "login" });
      });
    }
  }
};
</script>
