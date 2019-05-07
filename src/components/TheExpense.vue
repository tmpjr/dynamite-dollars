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
          <v-select :items="expenseTypes" v-model="expenseType" label="Expense Type"></v-select>
        </v-flex>
        <v-flex xs12>
          <v-text-field v-model="desc" label="Description"></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field v-model="amount" type="number" label="Amount" prefix="$"></v-text-field>
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
                v-model="date"
                label="Date"
                append-icon="fas fa-calendar"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" @input="dateMenu = false"></v-date-picker>
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
import UploadButton from "vuetify-upload-button";

export default {
  components: {
    "upload-btn": UploadButton
  },
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data: () => {
    return {
      amount: null,
      desc: null,
      date: new Date().toISOString().substr(0, 10),
      file: null,
      fileUrl: null,
      dateMenu: false,
      expenseType: "Massage",
      expenseTypes: ["Massage", "Entertainment"]
    };
  },
  mounted() {
    console.log(this.id);
  },
  methods: {
    ...mapMutations({
      setToast: "toast/setToast",
      setToastColor: "toast/setColor",
      alert: "toast/alert",
      success: "toast/success"
    }),
    saveExpense() {
      firebase.db
        .collection("expenses")
        .add({
          description: this.desc,
          amount: this.amount,
          date: this.date
        })
        .then(response => {
          this.success("Successfully saved expense");
        })
        .catch(error => {
          console.log(error);
        });
    },
    onChooseFile(file) {
      console.log("fileChanged");
      console.log(file);
      this.$refs.fileInput.click();
    },
    onFileChosen(event) {
      const files = event.target.files;
      let filename = files[0].filename;
      if (filename.lastIndexOf(".") <= 0) {
        this.alert("File is invalid!");
      }
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.fileUrl = fileReader.result;
      });
      console.log(files);
      this.file = files[0];
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
