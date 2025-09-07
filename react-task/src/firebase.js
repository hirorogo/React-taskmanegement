// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBMQrw6105Cyq7cJ3n66-ZlLQPeQf7dcQ",
  authDomain: "react-task-78b00.firebaseapp.com",
  projectId: "react-task-78b00",
  storageBucket: "react-task-78b00.firebasestorage.app",
  messagingSenderId: "721160572505",
  appId: "1:721160572505:web:f4ec44950d080e1d83eb48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);