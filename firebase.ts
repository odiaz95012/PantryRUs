// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "food--r--us.firebaseapp.com",
  projectId: "food--r--us",
  storageBucket: "food--r--us.appspot.com",
  messagingSenderId: "947851754801",
  appId: "1:947851754801:web:56a45126145d430f540410",
  measurementId: "G-JMPL1RS51W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};