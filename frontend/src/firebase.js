// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_x3DfSHAzTAjorIY8QZngWVcT7LP_lFo",
  authDomain: "peergig-17769.firebaseapp.com",
  projectId: "peergig-17769",
  storageBucket: "peergig-17769.firebasestorage.app",
  messagingSenderId: "1055378674674",
  appId: "1:1055378674674:web:1ea894d98607f651d5d16b",
  measurementId: "G-W8V4W2BD4B"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
export {auth,provider};
