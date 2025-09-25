// Edit.jsx - 編集画面（初心者向けの分かりやすい書き方）
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import Card from '../components/Card';
import Button from '../components/Button';
import styles from '../styles/Form.module.css';

/**
 * 編集画面のコンポーネント
 * 時間割・宿題・持ち物を編集できます
 * 
 * @param {Object} props - プロパティ
 * @param {Object} props.user - ログインしているユーザー情報
 * @param {function} props.onNavigate - ページ移動用の関数
 */
function Edit({ user, onNavigate }) {
  // 状態管理：現在のタブ（時間割・宿題・持ち物）を覚えておく
  const [activeTab, setActiveTab] = useState('timetable');
  
  // 状態管理：各データを覚えておく
  const [userInfo, setUserInfo] = useState(null);
  const [timetable, setTimetable] = useState({
    月: { periods: [] },
    火: { periods: [] },
    水: { periods: [] },
    木: { periods: [] },
    金: { periods: [] }
  });
  const [homework, setHomework] = useState({});
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(false);

  // 状態管理：新しく追加するデータを覚えておく
  const [newSubject, setNewSubject] = useState('');
  const [selectedDay, setSelectedDay] = useState('月');
  const [newHomework, setNewHomework] = useState({ title: '', dueDate: '' });
  const [newItem, setNewItem] = useState({ name: '', date: '' });

  /**
   * データを取得する処理
   * ページが表示された時に1回だけ実行される
   */
  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        // ユーザー情報を取得
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        setUserInfo(userData);

        if (userData?.classId) {
          // クラスデータを取得
          const classDoc = await getDoc(doc(db, 'classes', userData.classId));
          const classData = classDoc.data();
          
          if (classData) {
            setTimetable(classData.timetable || timetable);
            setHomework(classData.homework || {});
            setItems(classData.items || {});
          }
        }
      } catch (error) {
        console.error('データ取得エラー:', error);
      }
    }

    fetchData();
  }, [user]);

  // キーボードショートカット機能
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Ctrl（またはCmd）+ 数字キーでタブを切り替え
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            setActiveTab('timetable');
            break;
          case '2':
            event.preventDefault();
            setActiveTab('homework');
            break;
          case '3':
            event.preventDefault();
            setActiveTab('items');
            break;
          case 's':
            event.preventDefault();
            // 現在のタブに応じて保存処理を実行
            if (activeTab === 'timetable') saveTimetable();
            else if (activeTab === 'homework') saveHomework();
            else if (activeTab === 'items') saveItems();
            break;
          case 'h':
            event.preventDefault();
            onNavigate('home');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [activeTab, onNavigate]);

  /**
   * 時間割を保存する処理
   */
  const saveTimetable = async () => {
    if (!userInfo?.classId) return;
    
    setLoading(true);
    try {
      await setDoc(doc(db, 'classes', userInfo.classId), {
        timetable: {
          ...timetable,
          [selectedDay]: {
            periods: timetable[selectedDay].periods,
            updatedBy: user.displayName,
            updatedAt: serverTimestamp()
          }
        }
      }, { merge: true });
      
      alert('時間割を保存しました！');
    } catch (error) {
      alert('保存エラー: ' + error.message);
    }
    setLoading(false);
  };

  /**
   * 科目を追加する処理
   */
  const addSubject = () => {
    if (!newSubject.trim()) {
      alert('科目名を入力してください');
      return;
    }
    
    setTimetable(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        periods: [...prev[selectedDay].periods, newSubject.trim()]
      }
    }));
    setNewSubject('');
  };

  /**
   * 科目を削除する処理
   */
  const removeSubject = (dayKey, index) => {
    setTimetable(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        periods: prev[dayKey].periods.filter((_, i) => i !== index)
      }
    }));
  };

  /**
   * 宿題を追加する処理
   */
  const addHomework = async () => {
    if (!newHomework.title.trim() || !userInfo?.classId) {
      alert('宿題のタイトルを入力してください');
      return;
    }
    
    setLoading(true);
    try {
      const homeworkId = Date.now().toString();
      const newHw = {
        ...homework,
        [homeworkId]: {
          title: newHomework.title,
          dueDate: newHomework.dueDate,
          done: false,
          createdBy: user.displayName,
          createdAt: serverTimestamp()
        }
      };
      
      await setDoc(doc(db, 'classes', userInfo.classId), {
        homework: newHw
      }, { merge: true });
      
      setHomework(newHw);
      setNewHomework({ title: '', dueDate: '' });
      alert('宿題を追加しました！');
    } catch (error) {
      alert('保存エラー: ' + error.message);
    }
    setLoading(false);
  };

  /**
   * 持ち物を追加する処理
   */
  const addItem = async () => {
    if (!newItem.name.trim() || !userInfo?.classId) {
      alert('持ち物の名前を入力してください');
      return;
    }
    
    setLoading(true);
    try {
      const itemId = Date.now().toString();
      const newItems = {
        ...items,
        [itemId]: {
          name: newItem.name,
          date: newItem.date,
          done: false,
          createdBy: user.displayName,
          createdAt: serverTimestamp()
        }
      };
      
      await setDoc(doc(db, 'classes', userInfo.classId), {
        items: newItems
      }, { merge: true });
      
      setItems(newItems);
      setNewItem({ name: '', date: '' });
      alert('持ち物を追加しました！');
    } catch (error) {
      alert('保存エラー: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div>
      {/* ヘッダー */}
      <Card>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <h1 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#333'
          }}>
            編集画面
          </h1>
          
          <Button 
            type="back"
            onClick={() => onNavigate('home')}
          >
            ← 戻る
          </Button>
        </div>
      </Card>

      {/* キーボードショートカットヘルプ */}
      <Card title="キーボードショートカット">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '8px', 
          fontSize: '13px',
          color: '#666'
        }}>
          <div>• <strong>Ctrl+1</strong>: 時間割タブ</div>
          <div>• <strong>Ctrl+2</strong>: 宿題タブ</div>
          <div>• <strong>Ctrl+3</strong>: 持ち物タブ</div>
          <div>• <strong>Ctrl+S</strong>: 保存</div>
          <div>• <strong>Ctrl+H</strong>: ホームへ</div>
        </div>
      </Card>

      {/* タブメニュー */}
      <Card>
        <div style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '16px'
        }}>
          {[
            { key: 'timetable', label: '時間割' },
            { key: 'homework', label: '宿題' },
            { key: 'items', label: '持ち物' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                padding: '10px 16px',
                background: activeTab === tab.key ? '#007bff' : '#f8f9fa',
                border: '1px solid #ddd',
                color: activeTab === tab.key ? 'white' : '#333',
                fontSize: '14px',
                fontWeight: '400',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* タブの中身 */}
        <div>
          
          {/* 時間割編集タブ */}
          {activeTab === 'timetable' && (
            <div>
              {/* 曜日選択 */}
              <div className={styles.formGroup}>
                <select 
                  value={selectedDay} 
                  onChange={e => setSelectedDay(e.target.value)}
                  className={styles.formSelect}
                >
                  {Object.keys(timetable).map(day => (
                    <option key={day} value={day}>{day}曜日</option>
                  ))}
                </select>
              </div>
              
              {/* 科目追加 */}
              <div className={styles.formGroup}>
                <input
                  type="text"
                  placeholder="科目名を入力（例：数学、国語）"
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  className={styles.formInput}
                />
                <Button type="add" onClick={addSubject}>
                  追加
                </Button>
              </div>

              {/* 現在の時間割表示 */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '15px', color: '#333' }}>
                  {selectedDay}曜日の時間割
                </h3>
                {timetable[selectedDay].periods.map((subject, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(102, 126, 234, 0.1)',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    marginBottom: '8px'
                  }}>
                    <span>{index + 1}限: {subject}</span>
                    <button
                      onClick={() => removeSubject(selectedDay, index)}
                      style={{
                        background: 'rgba(255, 107, 107, 0.8)',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      削除
                    </button>
                  </div>
                ))}
              </div>

              {/* 保存ボタン */}
              <Button 
                type="save"
                onClick={saveTimetable}
                disabled={loading}
              >
                {loading ? '保存中...' : '時間割を保存'}
              </Button>
            </div>
          )}

          {/* 宿題編集タブ */}
          {activeTab === 'homework' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="宿題のタイトル（例：数学のプリント）"
                  value={newHomework.title}
                  onChange={e => setNewHomework(prev => ({ ...prev, title: e.target.value }))}
                  className={styles.formInput}
                  style={{ width: '100%', marginBottom: '10px' }}
                />
                <input
                  type="date"
                  value={newHomework.dueDate}
                  onChange={e => setNewHomework(prev => ({ ...prev, dueDate: e.target.value }))}
                  className={styles.formInput}
                  style={{ width: '100%', marginBottom: '10px' }}
                />
                <Button 
                  type="add"
                  onClick={addHomework}
                  disabled={loading}
                  style={{ width: '100%' }}
                >
                  {loading ? '追加中...' : '宿題を追加'}
                </Button>
              </div>

              {/* 宿題一覧 */}
              <div>
                <h3 style={{ marginBottom: '15px', color: '#333' }}>宿題一覧</h3>
                {Object.entries(homework).map(([id, hw]) => (
                  <div key={id} style={{
                    background: 'rgba(250, 112, 154, 0.1)',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    marginBottom: '8px'
                  }}>
                    <div style={{ fontWeight: '600' }}>{hw.title}</div>
                    {hw.dueDate && <div style={{ fontSize: '12px', opacity: '0.8' }}>期限: {hw.dueDate}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 持ち物編集タブ */}
          {activeTab === 'items' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="持ち物の名前（例：体操服、習字道具）"
                  value={newItem.name}
                  onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  className={styles.formInput}
                  style={{ width: '100%', marginBottom: '10px' }}
                />
                <input
                  type="date"
                  value={newItem.date}
                  onChange={e => setNewItem(prev => ({ ...prev, date: e.target.value }))}
                  className={styles.formInput}
                  style={{ width: '100%', marginBottom: '10px' }}
                />
                <Button 
                  type="add"
                  onClick={addItem}
                  disabled={loading}
                  style={{ width: '100%' }}
                >
                  {loading ? '追加中...' : '🎒 持ち物を追加'}
                </Button>
              </div>

              {/* 持ち物一覧 */}
              <div>
                <h3 style={{ marginBottom: '15px', color: '#333' }}>持ち物一覧</h3>
                {Object.entries(items).map(([id, item]) => (
                  <div key={id} style={{
                    background: 'rgba(168, 237, 234, 0.3)',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    marginBottom: '8px'
                  }}>
                    <div style={{ fontWeight: '600' }}>{item.name}</div>
                    {item.date && <div style={{ fontSize: '12px', opacity: '0.8' }}>日付: {item.date}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
          
        </div>
      </Card>
    </div>
  );
}

export default Edit;
