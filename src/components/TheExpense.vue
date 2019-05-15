<template>
  <v-card flat>
    <v-toolbar dense color="primary" flat>
      <v-btn icon dark @click="goBack()">
        <v-icon dark>fas fa-arrow-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn v-show="expenseDoc" icon dark @click="onChooseFile">
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
          <v-text-field type="date" v-model="expense.date" label="Date"></v-text-field>
        </v-flex>
        <v-flex xs12 v-if="expense.imageUrl">
          <v-card flat>
            <v-toolbar dark dense flat color="accent">
              <v-toolbar-title>Image Preview</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-img v-if="expense.imageUrl" :src="expense.imageUrl"></v-img>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" dark icon>
                <v-icon>fas fa-trash</v-icon>
              </v-btn>
              <v-btn color="primary" dark icon>
                <v-icon>fas fa-download</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>
<script>
import firebase from "../firebaseConfig.js";
import { mapActions, mapMutations } from "vuex";

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
        imageUrl: null
      },
      file: null,
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
          console.log(this.expense.imageUrl);
        }
      });
    }
  },
  methods: {
    ...mapActions({
      toastError: "toast/error",
      toastSuccess: "toast/success"
    }),
    ...mapMutations("loading", {
      showLoading: "show",
      hideLoading: "hide"
    }),
    saveExpense() {
      console.log("saveExpense");
      this.showLoading("Saving expense...");
      if (this.id && this.expenseRef) {
        this.expenseRef
          .update(this.expense)
          .then(() => {
            console.log("UPDATED");
            this.toastSuccess("Updated successfully");
            this.hideLoading();
          })
          .catch(error => {
            this.toastError(error.message);
            this.hideLoading();
          });
      } else {
        firebase.db
          .collection("expenses")
          .add(this.expense)
          .then(docRef => {
            console.log(docRef);
            console.log("CREATED");
            this.expenseDoc = docRef;
            this.toastSuccess(
              "Created successfully. You may now upload a file."
            );
            this.hideLoading();
            //return docRef;
          })
          .catch(error => {
            //this.alert(error.message);
            console.log(error);
            this.toastError(error.message);
            this.hideLoading();
          });
      }
    },
    onChooseFile(file) {
      this.$refs.fileInput.click();
    },
    onFileChosen(event) {
      const files = event.target.files;
      const file = files[0];
      this.showLoading("Uploading image...");
      firebase.storage
        .ref("expenses/" + file.name)
        .put(file)
        .then(response => {
          const imageUrl = response.ref.getDownloadURL();
          return imageUrl;
        })
        .then(imageUrl => {
          this.expenseRef
            .update({
              imageUrl: imageUrl
            })
            .then(() => {
              this.hideLoading();
              this.toastSuccess("Image uploaded successfully");
            })
            .catch(error => {
              this.hideLoading();
              this.toastError(error.message);
            });
        })
        .catch(error => {
          this.hideLoading();
          this.toastError(error.message);
        });
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
