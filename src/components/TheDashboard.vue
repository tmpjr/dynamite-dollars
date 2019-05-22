<template>
  <v-card flat color="transparent">
    <v-toolbar dark dense flat color="primary">
      <v-toolbar-title>Expenses Overview</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <expense-pie-chart v-if="loaded" :chart-data="chartData"></expense-pie-chart>
    </v-card-text>
  </v-card>
</template>
<script>
import firebase from "../firebaseConfig.js";
import ExpensePieChart from "./ExpensePieChart.vue";
import { mapMutations } from "vuex";

export default {
  components: {
    "expense-pie-chart": ExpensePieChart
  },
  data: () => {
    return {
      loaded: false,
      chartData: {
        labels: ["Massage", "Entertainment"],
        datasets: [
          {
            label: "Expense Summary 2019",
            backgroundColor: ["#FF4081", "#03A9F4"],
            data: []
          }
        ]
      }
    };
  },
  methods: {
    ...mapMutations("loading", {
      showLoading: "show",
      hideLoading: "hide"
    })
  },
  mounted() {
    this.showLoading("Bear cub conoodling");
    this.loaded = false;
    firebase.db
      .collection("expenses")
      .where("removed", "<", 1)
      .orderBy("removed")
      .orderBy("date", "desc")
      .get()
      .then(q => {
        this.loaded = true;
        this.hideLoading();
        let amount = 0;
        let datasets = [0, 0];
        q.forEach(doc => {
          let data = doc.data();
          data.id = doc.id;
          amount = Number(data.amount);
          if (data.type === "Massage") {
            datasets[0] += amount;
          } else {
            datasets[1] += amount;
          }
        });
        this.chartData.datasets[0].data = datasets;
      });
  }
};
</script>
