// Login.jsx - ログイン画面（初心者向けの分かりやすい書き方）
import React, { useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase";
import Card from "../components/Card";
import Button from "../components/Button";
import styles from "../styles/App.module.css";

/**
 * ログイン画面のコンポーネント
 * Googleアカウントでログインできます
 * 
 * @param {Object} props - プロパティ
 * @param {function} props.onLogin - ログインが成功した時に呼ばれる関数
 */
function Login({ onLogin }) {
  // 状態管理：現在ログインしているユーザー情報を覚えておく
  const [user, setUser] = useState(null);

  /**
   * Googleログインボタンを押した時の処理
   */
  const handleLogin = async () => {
    try {
      // Googleのログイン画面を表示
      const result = await signInWithPopup(auth, provider);
      
      // ログイン成功時の処理
      setUser(result.user);
      
      // 親コンポーネント（App.jsx）にログイン成功を伝える
      if (onLogin) {
        onLogin(result.user);
      }
    } catch (error) {
      console.error("ログインエラー:", error);
      alert("ログインに失敗しました。もう一度お試しください。");
    }
  };

  /**
   * ログアウトボタンを押した時の処理
   */
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  return (
    <div className={styles.container} style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      gap: '30px'
    }}>
      {/* ユーザーがログイン済みの場合 */}
      {user ? (
        <Card title="🎉 ようこそ！">
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}>
              {user.displayName} さん
            </p>
            
            {/* プロフィール画像 */}
            <img
              src={user.photoURL}
              alt="プロフィール"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                border: '4px solid rgba(255, 255, 255, 0.3)',
                margin: '20px auto',
                display: 'block',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
              }}
            />
            
            <p style={{ color: '#666', marginBottom: '25px', fontSize: '14px' }}>
              {user.email}
            </p>
            
            <Button 
              onClick={handleLogout}
              style={{ 
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
              }}
            >
              👋 ログアウト
            </Button>
          </div>
        </Card>
      ) : (
        /* ユーザーがログインしていない場合 */
        <Card title="">
          <p style={{ marginBottom: '30px', color: '#666', fontSize: '16px' }}>
            時間割・宿題・持ち物を簡単管理！
          </p>
          
          <Button onClick={handleLogin}>
            🚀 Googleでログイン
          </Button>
        </Card>
      )}
    </div>
  );
}

export default Login;
