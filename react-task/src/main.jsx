import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Login from './assets/Pages/Login';
import Home from './assets/Pages/Home';
import ClassSelect from './assets/Pages/ClassSelect';
import './index.css';


function App() {
  const [page, setPage] = useState('login');

  if (page === 'login') return <Login onLogin={() => setPage('class')} />;
  if (page === 'class') return <ClassSelect onSelect={() => setPage('home')} />;
  if (page === 'home') return <Home />;
  return null;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);