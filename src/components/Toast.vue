<template>
  <v-snackbar v-model="visible" :color="color">
    {{ toast }}
    <v-btn flat color="white" @click.native="show = false">close</v-btn>
  </v-snackbar>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("toast", ["toast", "color", "visible"])
  },
  data: () => {
    return {};
  }
};
</script>
