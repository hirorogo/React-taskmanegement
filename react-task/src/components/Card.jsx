// Card.jsx - カードコンポーネント（初心者向けの分かりやすい書き方）
import React from 'react';
import styles from '../styles/Card.module.css';

/**
 * カードコンポーネント
 * 画面の各セクションをカードで表示します
 * 
 * @param {Object} props - プロパティ
 * @param {React.ReactNode} props.children - カードの中身
 * @param {string} props.title - カードのタイトル
 */
function Card({ children, title }) {

  return (
    <div className={styles.card}>
      {/* タイトルがある場合は表示 */}
      {title && (
        <h2 className={styles.header}>
          {title}
        </h2>
      )}
      {/* カードの中身を表示 */}
      {children}
    </div>
  );
}

export default Card;
