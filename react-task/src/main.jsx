import React from 'react';
import ReactDOM from 'react-dom/client';
import Login from './assets/Pages/Login';

function App() {
  return (
    <>
      <Login />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);