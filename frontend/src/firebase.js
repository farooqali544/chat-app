import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";


// Initialize Firebase
const firebaseConfig = {

  apiKey: "AIzaSyB53QYnQRhTefNUoQJgGMje4VZV2xzdbHg",

  authDomain: "chat-app-47d04.firebaseapp.com",

  projectId: "chat-app-47d04",

  storageBucket: "chat-app-47d04.appspot.com",

  messagingSenderId: "1092018461985",

  appId: "1:1092018461985:web:be65573e1b2582044eb260",

  measurementId: "G-79SQ5G1QJX"

};


// Firebase storage reference
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;
