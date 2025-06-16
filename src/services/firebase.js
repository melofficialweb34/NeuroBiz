// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBeMOhDDOE5zybyQj45wssCWhmQe9annYs",
  authDomain: "neurobiz-11e6d.firebaseapp.com",
  projectId: "neurobiz-11e6d",
  storageBucket: "neurobiz-11e6d.firebasestorage.app",
  messagingSenderId: "154859622109",
  appId: "1:154859622109:web:e2eb426f1e3e3d8207d534",
  measurementId: "G-2JDJMFVX7F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
