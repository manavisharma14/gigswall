import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";

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
