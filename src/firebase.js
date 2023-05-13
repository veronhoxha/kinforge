import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDzG0R4MteCQoQMfA175k-cKEF12Mill3I",
    authDomain: "kinforge-6a303.firebaseapp.com",
    projectId: "kinforge-6a303",
    storageBucket: "kinforge-6a303.appspot.com",
    messagingSenderId: "363298141556",
    appId: "1:363298141556:web:8a51382d17a52676a02821",
    measurementId: "G-MN8E0CH770"
};

let auth;
let db;

try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.log('Error:', error)
}

export { auth, db };