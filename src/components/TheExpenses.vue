<template>
  <v-card flat color="transparent">
    <v-toolbar dark dense flat color="primary">
      <v-toolbar-title>Expenses</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="loadExpenses()">
        <v-icon>fas fa-redo-alt</v-icon>
      </v-btn>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="expenses"
      :pagination.sync="pagination"
      :expand="expand"
      item-key="id"
    >
      <template v-slot:items="props">
        <tr @click="editExpense(props.item)">
          <td class="text-xs-left">{{ props.item.description }}</td>
          <td class="text-xs-right">{{ props.item.date }}</td>
          <td class="text-xs-right">{{ props.item.amount }}</td>
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
      pagination: {
        rowsPerPage: 10,
        sortBy: "date",
        descending: true
      },
      expenses: []
    };
  },
  methods: {
    ...mapMutations("loading", {
      showLoading: "show",
      hideLoading: "hide"
    }),
    editExpense(record) {
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