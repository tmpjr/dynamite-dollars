import Vue from 'vue'
import Router from 'vue-router'
import TheExpenses from "../components/TheExpenses.vue";
import TheExpense from "../components/TheExpense.vue";
import TheLogin from "../components/TheLogin.vue";
import firebase from "../firebaseConfig.js";

Vue.use(Router)


let router = new Router({
  routes: [
    {
      path: '/expenses',
      name: 'expenses',
      component: TheExpenses,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/expense/:id?',
      name: 'expense',
      props: true,
      component: TheExpense,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/login",
      name: "login",
      component: TheLogin,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: "/",
      redirect: "expenses"
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    firebase.auth.onAuthStateChanged(user => {
      console.log(user);
      if (!user) {
        next({path: "login"});
      } else {
        console.log("logged in");
        next();
      }
    });
  }

  next();
});

export default router;