import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCX8jWRrAxgA1icNttcQpqj237INIQyEuU",
  authDomain: "quub-work.firebaseapp.com",
  projectId: "quub-work",
  storageBucket: "quub-work.firebasestorage.app",
  messagingSenderId: "646495434830",
  appId: "1:646495434830:web:f5eb9e757c6faca6adeb1f",
  measurementId: "G-1ZRVYPFX6Y"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
