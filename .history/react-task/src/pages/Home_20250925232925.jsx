// Home.jsx - ホーム画面（初心者向けの分かりやすい書き方）
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Card from '../components/Card';
import Button from '../components/Button';
import ScheduleItem from '../components/ScheduleItem';
import WeeklyTimetable from './WeeklyTimetable';

/**
 * ホーム画面のコンポーネント
 * 今日・明日の時間割、宿題、持ち物を表示します
 * 
 * @param {Object} props - プロパティ
 * @param {Object} props.user - ログインしているユーザー情報
 * @param {function} props.onNavigate - ページ移動用の関数
 */
function Home({ user, onNavigate }) {
  // 状態管理：各データを覚えておく
  const [userInfo, setUserInfo] = useState(null);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [tomorrowSchedule, setTomorrowSchedule] = useState([]);
  const [homework, setHomework] = useState([]);
  const [items, setItems] = useState([]);
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState(new Set());

  /**
   * データを取得する処理
   * ページが表示された時に1回だけ実行される
   */
  useEffect(() => {
    async function fetchData() {
      // ユーザーがログインしていない場合は何もしない
      if (!user) return;

      try {
        // 1. ユーザー情報を取得
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        setUserInfo(userData);

        // 2. クラス情報がある場合、時間割などを取得
        if (userData?.classId) {
          // 今日と明日の曜日を計算
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          const todayDay = ['日', '月', '火', '水', '木', '金', '土'][today.getDay()];
          const tomorrowDay = ['日', '月', '火', '水', '木', '金', '土'][tomorrow.getDay()];

          // クラスのデータを取得
          const classDoc = await getDoc(doc(db, 'classes', userData.classId));
          const classData = classDoc.data();
          
          // 時間割データがある場合
          if (classData?.timetable) {
            setTimetable(classData.timetable);
            setTodaySchedule(classData.timetable[todayDay]?.periods || []);
            setTomorrowSchedule(classData.timetable[tomorrowDay]?.periods || []);
          }

          // 宿題データがある場合（完了していないもののみ）
          if (classData?.homework) {
            const unfinishedHomework = Object.values(classData.homework).filter(hw => !hw.done);
            setHomework(unfinishedHomework);
          }

          // 持ち物データがある場合（完了していないもののみ）
          if (classData?.items) {
            const unfinishedItems = Object.values(classData.items).filter(item => !item.done);
            setItems(unfinishedItems);
          }
        }
      } catch (error) {
        console.error('データ取得エラー:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]); // userが変わった時だけ実行

  /**
   * タスクの完了状態をトグルする関数
   * @param {string} taskId - タスクのID
   */
  const toggleTask = (taskId) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  // 今日と明日の日付を文字列で作成
  const today = new Date();
  const todayStr = `${today.getMonth() + 1}月${today.getDate()}日(${['日', '月', '火', '水', '木', '金', '土'][today.getDay()]})`;
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = `${tomorrow.getMonth() + 1}月${tomorrow.getDate()}日(${['日', '月', '火', '水', '木', '金', '土'][tomorrow.getDay()]})`;

  return (
    <div>
      {/* ヘッダー */}
      <Card title="ホーム">
        {userInfo && (
          <p style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>
            {userInfo.subject}{userInfo.classId}組 - {user.displayName}
          </p>
        )}
      </Card>

      {/* 今日の時間割 */}
      <Card title={`今日の時間割 (${todayStr})`}>
        {todaySchedule.length > 0 ? (
          <div>
            {todaySchedule.map((subject, index) => (
              <ScheduleItem
                key={index}
                period={index + 1}
                subject={subject}
              />
            ))}
          </div>
        ) : (
          <p style={{ color: '#666', textAlign: 'center' }}>
            時間割が設定されていません
          </p>
        )}
      </Card>

      {/* 明日の時間割 */}
      <Card title={`明日の時間割 (${tomorrowStr})`}>
        {tomorrowSchedule.length > 0 ? (
          <div>
            {tomorrowSchedule.map((subject, index) => (
              <ScheduleItem
                key={index}
                period={index + 1}
                subject={subject}
              />
            ))}
          </div>
        ) : (
          <p style={{ color: '#666', textAlign: 'center' }}>
            時間割が設定されていません
          </p>
        )}
      </Card>

      {/* 進捗表示（宿題・持ち物がある場合のみ表示） */}
      {(homework.length > 0 || items.length > 0) && (
        <Card title="今日の進捗">
          {(() => {
            const totalTasks = homework.length + items.length;
            const completedHomework = homework.filter((_, index) => 
              completedTasks.has(`homework-${index}`)
            ).length;
            const completedItems = items.filter((_, index) => 
              completedTasks.has(`item-${index}`)
            ).length;
            const totalCompleted = completedHomework + completedItems;
            const progressPercentage = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;
            
            return (
              <div style={{ textAlign: 'center' }}>
                {/* 進捗バー */}
                <div style={{
                  width: '100%',
                  height: '20px',
                  background: '#e9ecef',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: `${progressPercentage}%`,
                    height: '100%',
                    background: '#28a745',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                
                {/* 進捗テキスト */}
                <p style={{ 
                  fontSize: '16px', 
                  fontWeight: '500', 
                  color: '#333',
                  margin: 0 
                }}>
                  {totalCompleted} / {totalTasks} 完了 ({progressPercentage}%)
                </p>
                
                {progressPercentage === 100 && (
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#28a745', 
                    fontWeight: '500',
                    marginTop: '8px',
                    margin: 0
                  }}>
                    すべてのタスクが完了しました！
                  </p>
                )}
              </div>
            );
          })()}
        </Card>
      )}

      {/* 宿題（ある場合のみ表示） */}
      {homework.length > 0 && (
        <Card title="宿題">
          <div>
            {homework.map((hw, index) => {
              const taskId = `homework-${index}`;
              const isCompleted = completedTasks.has(taskId);
              
              return (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px',
                  cursor: 'pointer'
                }} onClick={() => toggleTask(taskId)}>
                  
                  {/* チェックボックス */}
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                    marginRight: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isCompleted ? '#007bff' : 'white'
                  }}>
                    {isCompleted && (
                      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '12px' }}>
                        ✓
                      </span>
                    )}
                  </div>
                  
                  <span style={{ 
                    fontWeight: '400', 
                    fontSize: '14px',
                    textDecoration: isCompleted ? 'line-through' : 'none',
                    opacity: isCompleted ? 0.6 : 1,
                    color: '#333'
                  }}>
                    {hw.title}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* 持ち物（ある場合のみ表示） */}
      {items.length > 0 && (
        <Card title="持ち物">
          <div>
            {items.map((item, index) => {
              const taskId = `item-${index}`;
              const isCompleted = completedTasks.has(taskId);
              
              return (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px',
                  cursor: 'pointer'
                }} onClick={() => toggleTask(taskId)}>
                  
                  {/* チェックボックス */}
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                    marginRight: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isCompleted ? '#007bff' : 'white'
                  }}>
                    {isCompleted && (
                      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '12px' }}>
                        ✓
                      </span>
                    )}
                  </div>
                  
                  <span style={{ 
                    fontWeight: '400', 
                    fontSize: '14px',
                    textDecoration: isCompleted ? 'line-through' : 'none',
                    opacity: isCompleted ? 0.6 : 1,
                    color: '#333'
                  }}>
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* 週間時間割 */}
      <WeeklyTimetable timetable={timetable} />

      {/* 編集ボタン */}
      <Button onClick={() => onNavigate('edit')}>
        ✨ 編集画面へ
      </Button>
    </div>
  );
}

export default Home;
