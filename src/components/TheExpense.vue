<template>
  <div>
    <v-card flat color="transparent">
      <v-toolbar dense color="primary" flat>
        <v-btn icon dark @click="goBack()">
          <v-icon dark>fas fa-arrow-left</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn v-show="expenseDoc" icon dark @click="removeExpenseDialog = true;">
          <v-icon dark>fas fa-trash</v-icon>
        </v-btn>
        <v-btn v-show="expenseDoc" icon dark @click="onChooseFile">
          <v-icon dark>fas fa-paperclip</v-icon>
        </v-btn>
        <input
          type="file"
          style="display: none;"
          ref="fileInput"
          accept="image/*"
          @change="onFileChosen"
        />
        <v-btn icon dark :disabled="!valid" @click="saveExpense()">
          <v-icon dark>fas fa-check</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid fill-height>
        <v-layout row wrap>
          <v-flex xs12>
            <v-form ref="form" v-model="valid">
              <v-layout row wrap>
                <v-flex xs12>
                  <v-select :items="expenseTypes" v-model="expense.type" label="Expense Type"></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="expense.description"
                    label="Description"
                    :rules="[v => !!v || 'Description is required!']"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="expense.amount"
                    type="number"
                    label="Amount"
                    prefix="$"
                    :rules="[v => !!v || 'Amount is required!']"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    type="date"
                    v-model="expense.date"
                    label="Date"
                    :rules="[v => !!v || 'Date is required!']"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 v-if="expense.imageUrl">
                  <v-card flat>
                    <v-toolbar dense flat color="transparent">
                      <v-toolbar-title>Image Preview</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-spacer></v-spacer>
                      <v-btn small color="error" flat dark icon @click="deleteImageDialog = true">
                        <v-icon small>fas fa-trash</v-icon>
                      </v-btn>
                      <v-btn small color="primary" flat dark icon @click="downloadImage()">
                        <v-icon small>fas fa-download</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-card-text>
                      <v-img v-if="expense.imageUrl" :src="expense.imageUrl"></v-img>
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    <v-dialog v-model="removeExpenseDialog" max-width="290">
      <v-card>
        <v-card-title class="title">Confirm Remove Expense</v-card-title>
        <v-card-text>Are you sure you want to remove this expense?</v-card-text>
        <v-card-actions>
          <v-btn color="primary" flat @click="removeExpenseDialog = false">cancel</v-btn>
          <v-btn color="primary" flat @click="removeExpense()">yes, remove it</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteImageDialog" max-width="290">
      <v-card>
        <v-card-title class="title">Confirm Remove Image</v-card-title>
        <v-card-text>Are you sure you want to remove this image?</v-card-text>
        <v-card-actions>
          <v-btn color="primary" flat @click="deleteImageDialog = false">cancel</v-btn>
          <v-btn color="primary" flat @click="deleteImage()">yes, remove it</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import firebase from "../firebaseConfig.js";
import moment from "moment";
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
      valid: true,
      deleteImageDialog: false,
      removeExpenseDialog: false,
      expense: {
        id: null,
        amount: null,
        description: null,
        date: moment().format("YYYY-MM-DD"),
        type: "Massage",
        imageUrl: null,
        removed: 0
      },
      file: null,
      expenseTypes: ["Massage", "Entertainment"],
      expenseRef: null,
      expenseDoc: null
    };
  },
  computed: {
    currentUnixTime() {
      return moment().unix();
    },
    dateUnix() {
      return moment(this.date).unix();
    }
  },
  mounted() {
    this.loadExpense();
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
    loadExpense() {
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
    downloadImage() {
      let xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      let self = this;
      xhr.onload = function(event) {
        let blob = xhr.response;
        let a = document.createElement("a");
        a.href = window.URL.createObjectURL(xhr.response);
        a.download = "reciept-" + self.id + ".jpg";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
      };
      xhr.open("GET", this.expense.imageUrl);
      xhr.send();
    },
    deleteImage() {
      this.deleteImageDialog = false;
      this.showLoading("Deleting image...");
      firebase.storage
        .refFromURL(this.expense.imageUrl)
        .delete()
        .then(() => {
          this.expenseRef
            .update({
              imageUrl: null
            })
            .then(() => {
              this.hideLoading();
              this.toastSuccess("Image removed");
              this.loadExpense();
            })
            .catch(error => {
              this.toastError(error.message);
            });
        })
        .catch(error => {
          this.toastError(error.message);
        });
    },
    removeExpense() {
      this.removeExpenseDialog = false;
      this.showLoading("Removing expense...");
      this.expense.removed = 1;
      if (this.id && this.expenseRef) {
        this.expenseRef
          .update(this.expense)
          .then(() => {
            this.toastSuccess("Removed successfully");
            this.hideLoading();
            this.goBack();
          })
          .catch(error => {
            this.toastError(error.message);
            this.hideLoading();
          });
      }
    },
    saveExpense() {
      this.showLoading("Saving expense...");
      this.expense.dateUnix = this.dateUnix;
      if (this.expenseRef && this.expense.id) {
        this.expense.dateUpdated = this.currentUnixTime;
        this.expenseRef
          .update(this.expense)
          .then(() => {
            this.toastSuccess("Updated successfully");
            this.hideLoading();
            this.loadExpense();
          })
          .catch(error => {
            this.toastError(error.message);
            this.hideLoading();
          });
      } else {
        this.expense.dateCreated = this.currentUnixTime;
        this.expense.dateUpdated = this.currentUnixTime;
        firebase.db
          .collection("expenses")
          .add(this.expense)
          .then(docRef => {
            this.expenseDoc = docRef;
            this.toastSuccess(
              "Created successfully. You may now upload a file."
            );
            this.hideLoading();
            this.$router.push({ name: "expenses" });
          })
          .catch(error => {
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
              this.loadExpense();
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
      this.$router.push({ name: "expenses" });
    }
  }
};
</script>
