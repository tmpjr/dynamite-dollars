import Vue from "vue";
import Vuex from "vuex";

import { toast } from "./modules/toast.js";
import { loading } from "./modules/loading.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    toast,
    loading
  }
});
