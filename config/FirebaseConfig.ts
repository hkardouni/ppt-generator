// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8jhgtiUwPD4ogrEPAkQDeX6XdFqEbgsI",
  authDomain: "ppt-generator-9fb7c.firebaseapp.com",
  projectId: "ppt-generator-9fb7c",
  storageBucket: "ppt-generator-9fb7c.firebasestorage.app",
  messagingSenderId: "785971865075",
  appId: "1:785971865075:web:66fb7da59f147f7bf71e86",
  measurementId: "G-NK77YBDE9M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebaseDb = getFirestore(app);