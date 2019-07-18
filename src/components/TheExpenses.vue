<template>
  <v-card flat color="transparent">
    <v-toolbar dark dense flat color="primary">
      <v-icon left>fas fa-coins</v-icon>
      <v-toolbar-title>Expenses</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="loadExpenses()">
        <v-icon>fas fa-redo-alt</v-icon>
      </v-btn>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="expenses"
      :sort-by.sync="sortBy"
      :sort-desc.sync="descending"
      :items-per-page="-1"
      :mobile-breakpoint="0"
      virtual-rows
      hide-default-footer
      item-key="id"
    >
      <template v-slot:body="{ items }">
        <tr v-for="item in items" :key="item.name" @click="editExpense(item)">
          <td>{{ item.description }}</td>
          <td class="text-xs-right">{{ item.date }}</td>
          <td class="text-xs-right">{{ item.amount }}</td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import firebase from "../firebaseConfig.js";
import { mapMutations } from "vuex";

export default {
  data: () => {
    return {
      expand: false,
      headers: [
        {
          text: "Description",
          value: "description"
        },
        {
          text: "Date",
          align: "right",
          value: "date"
        },
        {
          text: "Amount",
          align: "right",
          value: "amount"
        }
      ],
      sortBy: "date",
      descending: true,
      rowsPerPage: 10,
      expenses: []
    };
  },
  methods: {
    ...mapMutations("loading", {
      showLoading: "show",
      hideLoading: "hide"
    }),
    editExpense(record) {
      console.log("editExpense");
      this.$router.push({ name: "expense", params: { id: record.id } });
    },
    loadExpenses() {
      this.showLoading("Loading expenses...");
      this.expenses = [];
      firebase.db
        .collection("expenses")
        .where("removed", "<", 1)
        .orderBy("removed")
        .orderBy("date", "desc")
        .get()
        .then(q => {
          q.forEach(doc => {
            let data = doc.data();
            data.id = doc.id;
            this.expenses.push(data);
          });
          this.hideLoading();
        });
    },
    editLink(id) {
      return "/expense/" + id;
    }
  },
  mounted() {
    this.loadExpenses();
  }
};
</script>