import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyA6GllNNEQljkDhvDmkSyJJE9TYWWmaNpg",
  authDomain: "expensetracker-7387c.firebaseapp.com",
  projectId: "expensetracker-7387c",
  storageBucket: "expensetracker-7387c.appspot.com",
  messagingSenderId: "1097984480270",
  appId: "1:1097984480270:web:cff64157995f50de13185f",
  measurementId: "G-J5G722516J",
};

const db = firebase.initializeApp(firebaseConfig);
export default db;
