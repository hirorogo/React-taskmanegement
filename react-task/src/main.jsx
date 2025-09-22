import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Login from './assets/Pages/Login';
import Home from './assets/Pages/Home';
import ClassSelect from './assets/Pages/ClassSelect/ClassSelect';
import './index.css';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);

  // ログイン後
  useEffect(() => {
    async function checkUserInfo() {
      if (user) {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (!snap.exists() || !snap.data().classId || !snap.data().subject) {
          setPage('class'); // 未設定
        } else {
          setPage('home'); // 設定済み
        }
      }
    }
    checkUserInfo();
  }, [user]);

  if (page === 'login') {
    return (
      <Login onLogin={u => setUser(u)} />
    );
  }

  if (page === 'class') {
    return (
      <ClassSelect onSelect={async ({ classId, subject }) => {
        if (user) {
          await setDoc(doc(db, 'users', user.uid), {
            displayName: user.displayName,
            email: user.email,
            classId,
            subject,
          }, { merge: true });
        }
        setPage('home');
      }} />
    );
  }

  if (page === 'home') {
    return <Home />;
  }

  return null;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

