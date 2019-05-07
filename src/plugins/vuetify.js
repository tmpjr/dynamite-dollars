import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import { Ripple } from "vuetify/lib/directives";

Vue.use(Vuetify, {
  iconfont: 'fa',
  theme: {
    primary: "#03A9F4",
    accent: "#FF4081" 
  },
  directives: {
    Ripple
  }
})
