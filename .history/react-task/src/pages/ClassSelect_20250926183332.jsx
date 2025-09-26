// ClassSelect.jsx - クラス選択画面（初心者向けの分かりやすい書き方）
import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import styles from '../styles/Form.module.css';

/**
 * クラス選択画面のコンポーネント
 * ユーザーの学年・組・学科を選択します
 * 
 * @param {Object} props - プロパティ
 * @param {function} props.onSelect - 選択が完了した時に呼ばれる関数
 */
function ClassSelect({ onSelect }) {
  // 状態管理：選択されたクラス情報を覚えておく
  const [classId, setClassId] = useState('');
  const [subject, setSubject] = useState('');

  /**
   * 選択完了ボタンを押した時の処理
   */
  const handleSubmit = (e) => {
    // ページの再読み込みを防ぐ
    e.preventDefault();
    
    // 両方とも選択されているかチェック
    if (classId && subject) {
      // 親コンポーネント（App.jsx）に選択結果を伝える
      onSelect({ classId, subject });
    } else {
      alert('クラスと学科の両方を選択してください。');
    }
  };

  return (
    <Card title="🏫 クラス情報の設定">
      <form onSubmit={handleSubmit}>
        
        {/* クラス選択 */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '10px', 
            fontWeight: '600',
            fontSize: '16px'
          }}>
            🎯 あなたのクラスは？
          </label>
          
          <select 
            className={styles.formSelect}
            value={classId} 
            onChange={e => setClassId(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="">クラスを選択してください</option>
            <option value="1">1組</option>
            <option value="2">2組</option>
            <option value="3">3組</option>
            <option value="4">4組</option>
            <option value="5">5組</option>
            <option value="6">6組</option>
            <option value="7">7組</option>
            <option value="8">8組</option>
          </select>
        </div>

        {/* 学科選択 */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '10px', 
            fontWeight: '600',
            fontSize: '16px'
          }}>
            📚 あなたの学科は？
          </label>
          
         
        </div>

        {/* 決定ボタン */}
        <Button type="primary">
          ✅ この情報で登録する
        </Button>
        
      </form>
    </Card>
  );
}

export default ClassSelect;
