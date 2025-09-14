import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Login from './assets/Pages/Login';
import Home from './assets/Pages/Home';
import ClassSelect from './assets/Pages/ClassSelect/ClassSelect';
import './index.css';
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

function App() {
  const [page, setPage] = useState('login'); // 今どの画面かを管理する
  const [user, setUser] = useState(null);    // ログインしたユーザー情報を入れる

  // ログイン画面
  if (page === 'login') {
    return (
      <Login onLogin={u => {
        setUser(u);
        setPage('class');
      }} />
    );
  }

  // クラス選択画面
  if (page === 'class') {
    return (
      <ClassSelect onSelect={async ({ classId, subject }) => {
        // Firestoreにいれる
        if (user) {
          await setDoc(doc(db, 'users', user.uid), {
            displayName: user.displayName,
            email: user.email,
            classId: classId,
            subject: subject,
          });
        }
        setPage('home'); // ホーム画面へ移動する
      }} />
    );
  }

  // ホーム画面を表示する
  if (page === 'home') {
    return <Home />;
  }

  return null;
}

// 画面を表示する
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);