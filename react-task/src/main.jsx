import React from 'react';
import ReactDOM from 'react-dom/client';
import Login from './assets/Pages/Login';

function App() {
  return (
    <>
      <Login />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);