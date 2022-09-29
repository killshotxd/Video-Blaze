// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAaMtjZV-SAwbk7HZ13hl5W66Pgm_2VUYU",
  authDomain: "fir-auth-b1867.firebaseapp.com",
  databaseURL: "https://fir-auth-b1867-default-rtdb.firebaseio.com",
  projectId: "fir-auth-b1867",
  storageBucket: "fir-auth-b1867.appspot.com",
  messagingSenderId: "762749686456",
  appId: "1:762749686456:web:4acc5fc073b9e145ecda4d",
  measurementId: "G-MX7HJWKR4V",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
