import firebase from 'firebase/app'
import 'firebase/firestore';
import 'firebase/messaging';
import "firebase/storage"; 
import "firebase/auth"; 
import config from "./config.js";

firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();
const authProvider = new firebase.auth.GoogleAuthProvider();

export default {
  db,
  storage,
  auth,
  authProvider,
  config
};