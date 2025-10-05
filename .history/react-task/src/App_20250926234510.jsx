// App.jsx - アプリのメインコンポーネント（初心者向けの分かりやすい書き方）
import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// ページコンポーネントをインポート
import Login from './pages/Login';
import Home from './pages/Home';
import Edit from './pages/Edit';
import ClassSelect from './pages/ClassSelect';

// スタイルをインポート
import styles from './styles/App.module.css';

/**
 * アプリのメインコンポーネント
 * どのページを表示するかを管理します
 */
function App() {
  // 状態管理：現在のページを覚えておく
  const [currentPage, setCurrentPage] = useState('login');
  
  // 状態管理：ログインしているユーザー情報を覚えておく
  const [user, setUser] = useState(null);
  
  // 状態管理：ローディング状態を覚えておく
  const [loading, setLoading] = useState(false);
  
  // 状態管理：エラー状態を覚えておく  
  const [error, setError] = useState(null);

  /**
   * ユーザーがログインした時の処理
   * クラス情報が設定済みかどうかをチェックして、適切なページに移動
   */
  useEffect(() => {
    async function checkUserInfo() {
      // ユーザーがログインしていない場合は何もしない
      if (!user) return;

      // 既にhomeかeditページにいる場合は、自動遷移しない
      if (currentPage === 'home' || currentPage === 'edit') {
        console.log('既にメインページにいるため、自動遷移をスキップ');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Firestoreからユーザー情報を取得
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        // ユーザー情報が存在し、クラスIDと教科が設定されているかチェック
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.classId && userData.subject) {
            // 設定済みの場合はホーム画面へ（ログインページからの場合のみ）
            if (currentPage === 'login') {
              setCurrentPage('home');
            }
          } else {
            // 未設定の場合はクラス選択画面へ
            setCurrentPage('class');
          }
        } else {
          // ユーザーデータが存在しない場合はクラス選択画面へ
          setCurrentPage('class');
        }
      } catch (error) {
        console.error('ユーザー情報の取得エラー:', error);
        setError('ユーザー情報の読み込みに失敗しました。再度お試しください。');
        setCurrentPage('class');
      } finally {
        setLoading(false);
      }
    }

    checkUserInfo();
  }, [user]); // userのみを監視（currentPageは条件分岐で制御）

  /**
   * ページを切り替える関数
   * @param {string} pageName - 移動先のページ名
   */
  const navigateToPage = (pageName) => {
    console.log('ページ遷移:', currentPage, '->', pageName);
    setCurrentPage(pageName);
  };

  /**
   * ユーザーがログインした時の処理
   * @param {Object} userData - ログインしたユーザーの情報
   */
  const handleLogin = (userData) => {
    setUser(userData);
  };

  /**
   * クラス選択が完了した時の処理
   * @param {Object} classData - 選択したクラス情報（classId, subject）
   */
  const handleClassSelect = async (classData) => {
    if (user) {
      try {
        // Firestoreにユーザー情報を保存
        await setDoc(doc(db, 'users', user.uid), {
          displayName: user.displayName,
          email: user.email,
          classId: classData.classId,
          subject: classData.subject,
        }, { merge: true });
        
        // ホーム画面に移動
        setCurrentPage('home');
      } catch (error) {
        console.error('ユーザー情報の保存エラー:', error);
        alert('情報の保存に失敗しました。もう一度お試しください。');
      }
    }
  };

  // ローディング中の表示
  if (loading) {
    return (
      <div className={styles.app}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p style={{ color: '#666', marginTop: '20px', fontSize: '16px' }}>
              読み込み中...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 現在のページに応じて表示するコンポーネントを決める
  return (
    <div className={styles.app}>
      <div className={styles.container}>
        
        {/* デバッグ情報 */}
        <div style={{ 
          background: 'lightblue', 
          padding: '5px', 
          marginBottom: '10px',
          fontSize: '12px' 
        }}>
          現在のページ: {currentPage}, ユーザー: {user ? user.displayName : 'なし'}
        </div>
        
        {/* エラー表示 */}
        {error && (
          <div style={{
            background: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            padding: '12px',
            margin: '0 0 16px 0',
            color: '#721c24',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        {/* ログイン画面 */}
        {currentPage === 'login' && (
          <Login onLogin={handleLogin} />
        )}

        {/* クラス選択画面 */}
        {currentPage === 'class' && (
          <ClassSelect onSelect={handleClassSelect} />
        )}

        {/* ホーム画面 */}
        {currentPage === 'home' && (
          <Home user={user} onNavigate={navigateToPage} />
        )}

        {/* 編集画面 */}
        {currentPage === 'edit' && (
          <Edit user={user} onNavigate={navigateToPage} />
        )}
        
      </div>
    </div>
  );
}

export default App;
