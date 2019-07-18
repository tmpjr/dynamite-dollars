<template>
  <v-card flat color="transparent">
    <v-toolbar dark dense flat color="primary">
      <v-toolbar-title>Expenses Overview</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-layout row wrap>
        <v-flex xs12>
          <v-text-field v-model="start" type="date" label="Start Date"></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field v-model="end" type="date" label="End Date"></v-text-field>
        </v-flex>
        <v-flex xs12>
          <expense-pie-chart v-if="loaded" :chart-data="chartData"></expense-pie-chart>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>
<script>
import firebase from "../firebaseConfig.js";
import moment from "moment";
import ExpensePieChart from "./ExpensePieChart.vue";
import { mapMutations } from "vuex";

export default {
  components: {
    "expense-pie-chart": ExpensePieChart
  },
  data: () => {
    return {
      start: moment()
        .startOf("year")
        .format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD"),
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
  watch: {
    start(val) {
      console.log(val);
    }
  },
  mounted() {
    this.showLoading("Bear cub conoodling");
    this.loaded = false;
    const start = moment(this.start).unix();
    const end = moment(this.end).unix();
    console.log(start);
    console.log(end);
    firebase.db
      .collection("expenses")
      .where("dateUnix", ">=", start)
      .where("dateUnix", "<=", end)
      .orderBy("dateUnix", "desc")
      .get()
      .then(q => {
        this.loaded = true;
        this.hideLoading();
        let amount = 0;
        let datasets = [0, 0];
        q.forEach(doc => {
          let data = doc.data();
          console.log(data);
          //if (data.removed < 1) {
          data.id = doc.id;
          amount = Number(data.amount);
          if (data.type === "Massage") {
            datasets[0] += amount;
          } else {
            datasets[1] += amount;
          }
          //}
        });
        this.chartData.datasets[0].data = datasets;
      });
  }
};
</script>
