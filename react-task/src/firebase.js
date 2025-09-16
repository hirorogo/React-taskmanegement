// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebaseの設定（この部分は1回だけ書く）
const firebaseConfig = {
  apiKey: "AIzaSyDBMQrw6105Cyq7cJ3n66-ZlLQPeQf7dcQ",
  authDomain: "react-task-78b00.firebaseapp.com",
  projectId: "react-task-78b00",
  storageBucket: "react-task-78b00.appspot.com",
  messagingSenderId: "721160572505",
  appId: "1:721160572505:web:f4ec44950d080e1d83eb48"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);

// 各サービスの初期化
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, db };