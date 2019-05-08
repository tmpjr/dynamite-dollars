<template>
  <v-snackbar v-model="active" :color="color">{{ toast }}</v-snackbar>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  computed: {
    ...mapGetters("toast", ["toast", "color", "visible"]),
    ...mapMutations({ reset: "toast/reset" }),
    active: {
      get: function() {
        return this.visible();
      },
      set: function() {
        this.reset();
      }
    }
  },
  data: () => {
    return {};
  }
};
</script>
