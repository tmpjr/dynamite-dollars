import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store/store'
import './registerServiceWorker'
import firebase from "./firebaseConfig.js";

Vue.config.productionTip = false
Vue.prototype.$user = null;
Vue.prototype.$eventBus = new Vue();

new Vue({
  router,
  store,
  created() {
    firebase.auth.onAuthStateChanged(user => {
      if (!user) {
        this.$router.push("/login");
      } 
    });
  },
  render: h => h(App)
}).$mount('#app');
