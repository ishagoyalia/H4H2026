import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBZENYRBfU22kzoaRJxsARhhRBDFgWG7_k",
    authDomain: "friendzone-417c2.firebaseapp.com",
    projectId: "friendzone-417c2",
    storageBucket: "friendzone-417c2.appspot.com",
    messagingSenderId: "31728952873",
    appId: "1:31728952873:web:850ee1f7b358e30739de38",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export the Auth instance for use in your frontend
export const auth = getAuth(app);