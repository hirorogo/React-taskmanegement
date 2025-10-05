// Button.jsx - ボタンコンポーネント（初心者向けの分かりやすい書き方）
import React from 'react';
import styles from '../styles/Button.module.css';

/**
 * ボタンコンポーネント
 * いろいろな種類のボタンを表示します
 * 
 * @param {Object} props - プロパティ
 * @param {string} props.type - ボタンの種類 ('primary', 'add', 'save', 'back')
 * @param {function} props.onClick - クリックした時の処理
 * @param {React.ReactNode} props.children - ボタンの中身（文字など）
 * @param {boolean} props.disabled - ボタンが押せない状態かどうか
 */
function Button({ type = 'primary', onClick, children, disabled = false }) {
  // ボタンの種類に応じてスタイルを決める
  let buttonClass = styles.button;
  
  if (type === 'add') {
    buttonClass = styles.addButton;
  } else if (type === 'save') {
    buttonClass = styles.saveButton;
  } else if (type === 'back') {
    buttonClass = styles.backButton;
  }

  return (
    <button 
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
