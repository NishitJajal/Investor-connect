// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3e_U5gU3A0wMdXSOW8SLADp8UE5tvjnM",
  authDomain: "investor-connect-b6f7f.firebaseapp.com",
  projectId: "investor-connect-b6f7f",
  storageBucket: "investor-connect-b6f7f.firebasestorage.app",
  messagingSenderId: "469712438427",
  appId: "1:469712438427:web:5dcdc981f8d9f34081f23e",
  measurementId: "G-WGVHG67K7R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db};