// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD0PUnPnA1xvYHghherR-1CQ3xgWA7RhHI",
    authDomain: "pets-f87d0.firebaseapp.com",
    projectId: "pets-f87d0",
    storageBucket: "pets-f87d0.firebasestorage.app",
    messagingSenderId: "834442631579",
    appId: "1:834442631579:web:38b53410d497c09a46293e",
    measurementId: "G-7V38K2XQJH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);