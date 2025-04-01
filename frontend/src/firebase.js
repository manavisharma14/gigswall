// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBevyTvxA6KiMyA0ugJaHz49BX1kS2M34k",
  authDomain: "peergig-92c12.firebaseapp.com",
  projectId: "peergig-92c12",
  storageBucket: "peergig-92c12.appspot.com",
  messagingSenderId: "881611422163",
  appId: "1:881611422163:web:59859c3027b8aa88599726",
  measurementId: "G-0M8D437JWE"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
