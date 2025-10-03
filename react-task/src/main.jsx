// main.jsx - アプリのエントリーポイント（初心者向けの分かりやすい書き方）
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// HTMLの中の'root'要素を探して、そこにReactアプリを表示する
const root = ReactDOM.createRoot(document.getElementById('root'));

// Reactアプリを開始する
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

