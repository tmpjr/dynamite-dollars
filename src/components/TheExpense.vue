<template>
  <v-card flat>
    <v-toolbar dense color="primary" flat>
      <v-btn icon dark @click="goBack()">
        <v-icon dark>fas fa-arrow-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon dark @click="onChooseFile">
        <v-icon dark>fas fa-paperclip</v-icon>
      </v-btn>
      <input
        type="file"
        style="display: none;"
        ref="fileInput"
        accept="image/*"
        @change="onFileChosen"
      >
      <v-btn icon dark @click="saveExpense()">
        <v-icon dark>fas fa-check</v-icon>
      </v-btn>
    </v-toolbar>
    <v-container fluid fill-height>
      <v-layout row wrap>
        <v-flex xs12>
          <v-select :items="expenseTypes" v-model="expense.type" label="Expense Type"></v-select>
        </v-flex>
        <v-flex xs12>
          <v-text-field v-model="expense.description" label="Description"></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field v-model="expense.amount" type="number" label="Amount" prefix="$"></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="expense.date"
                label="Date"
                append-icon="fas fa-calendar"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="expense.date" @input="dateMenu = false"></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs12>
          <div class="text-xs-center"></div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>
<script>
import firebase from "../firebaseConfig.js";
import { mapMutations } from "vuex";

export default {
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data: () => {
    return {
      expense: {
        amount: null,
        description: null,
        date: new Date().toISOString().substr(0, 10),
        type: "Massage",
        file: null
      },
      file: null,
      dateMenu: false,
      expenseTypes: ["Massage", "Entertainment"],
      expenseRef: null,
      expenseDoc: null
    };
  },
  mounted() {
    this.expenseDoc = null;
    this.expenseRef = null;
    if (this.id) {
      const ref = firebase.db.collection("expenses").doc(this.id);
      this.expenseRef = ref;
      ref.get().then(doc => {
        if (doc.exists) {
          this.expenseDoc = doc;
          this.expense = doc.data();
        }
      });
    }
  },
  methods: {
    ...mapMutations({
      success: "toast/success",
      error: "toast/error"
    }),
    saveExpense() {
      console.log("saveExpense");
      if (this.id && this.expenseRef) {
        this.expenseRef
          .update(this.expense)
          .then(() => {
            console.log("UPDATED");
            this.success("Updated successfully");
          })
          .catch(error => {
            //this.alert(error.message);
          });
      } else {
        firebase.db
          .collection("expenses")
          .add(this.expense)
          .then(docRef => {
            console.log(response);
            console.log("CREATED");
            this.success("Created successfully");
            return docRef;
          })
          .catch(error => {
            //this.alert(error.message);
          });
      }

      if (this.file) {
      }

      /*
      firebase.storage
        .ref("expenses/" + this.file.name)
        .put(this.file)
        .then(response => {
          return response.ref.getDownloadURL();
        })
        .then(fileURL => {
          this.expense.img = fileURL;
          console.log("fileurl: " + fileURL);
          if (this.id && this.expenseDoc) {
            this.expenseDoc
              .update(this.expense)
              .then(() => {
                this.success("Updated successfully");
              })
              .catch(error => {
                this.alert(error.message);
              });
          } else {
            firebase.db
              .collection("expenses")
              .add(this.expense)
              .then(() => {
                this.success("Created successfully");
              })
              .catch(error => {
                this.alert(error.message);
              });
          }
        });
        */
    },
    onChooseFile(file) {
      this.$refs.fileInput.click();
    },
    onFileChosen(event) {
      const files = event.target.files;
      this.file = files[0];
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
