<template>
  <v-app>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-navigation-drawer app right v-model="nav" fixed temporary>
      <v-list class="pa-1">
        <v-divider></v-divider>
        <v-list-tile @click="logout()">
          <v-list-tile-action>
            <v-icon>fas fa-sign-out-alt</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Logout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-bottom-nav :value="showNav" fixed>
      <v-btn to="/expenses" value="expenses">
        <span>Expenses</span>
        <v-icon>fas fa-coins</v-icon>
      </v-btn>
      <v-btn to="/expense" value="expense">
        <span>Add Expense</span>
        <v-icon>fas fa-plus</v-icon>
      </v-btn>
      <v-btn value="menu" @click.stop="nav = !nav">
        <span>Menu</span>
        <v-icon>fas fa-bars</v-icon>
      </v-btn>
    </v-bottom-nav>
    <v-snackbar v-model="snackbar" :color="color">{{ message }}</v-snackbar>
  </v-app>
</template>
<script>
import firebase from "./firebaseConfig.js";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "App",
  computed: {
    ...mapGetters("toast", ["active", "color", "message"]),
    snackbar: {
      get: function() {
        return this.active;
      },
      set: function() {
        this.activateSb(true);
      }
    }
  },
  data: () => {
    return {
      activeBtn: 1,
      nav: false,
      showNav: true
    };
  },
  created() {
    firebase.auth.onAuthStateChanged(user => {
      if (!user) {
        console.log("hiding bottom nav");
        this.showNav = false;
      } else {
        this.showNav = true;
      }
    });
  },
  methods: {
    ...mapMutations({
      activateSb: "toast/setActive"
    }),
    logout() {
      firebase.auth.signOut().then(() => {
        this.$router.push({ name: "login" });
      });
    }
  }
};
</script>
