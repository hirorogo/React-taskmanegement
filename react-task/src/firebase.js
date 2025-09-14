// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const db = getFirestore(app);
const firebaseConfig = {
  apiKey: "AIzaSyDBMQrw6105Cyq7cJ3n66-ZlLQPeQf7dcQ",
  authDomain: "react-task-78b00.firebaseapp.com",
  projectId: "react-task-78b00",
  storageBucket: "react-task-78b00.firebasestorage.app",
  messagingSenderId: "721160572505",
  appId: "1:721160572505:web:f4ec44950d080e1d83eb48"
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, db };