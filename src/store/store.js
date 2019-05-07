import Vue from "vue";
import Vuex from "vuex";

import { toast } from "./modules/toast.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    toast
  }
});
