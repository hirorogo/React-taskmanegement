import  React,{ useState } from 'react';
import ReactDOM from 'react-dom/client';
import Login from './assets/Pages/Login';
import Home from './assets/Pages/Home';
import ClassSelect from './assets/Pages/ClassSelect/ClassSelect';
import './index.css';
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);

  if (page === 'login') {
    return (
      <Login onLogin={u => {
        setUser(u);
        setPage('class');
      }} />
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
          });
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

µ