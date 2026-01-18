import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBCVfUpTplRIqiLAcgHrc5VVA7LO6T_Bbc",
  authDomain: "messages1-fb178.firebaseapp.com",
  databaseURL: "https://messages1-fb178-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "messages1-fb178",
  storageBucket: "messages1-fb178.firebasestorage.app",
  messagingSenderId: "714454103672",
  appId: "1:714454103672:web:9aa14f39038c7671b01f8d",
  measurementId: "G-FQN9B0BTME"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
