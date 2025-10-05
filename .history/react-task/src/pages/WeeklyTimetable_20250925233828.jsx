// WeeklyTimetable.jsx - 週間時間割コンポーネント（初心者向けの分かりやすい書き方）
import React, { useState } from 'react';
import Card from '../components/Card';
import ScheduleItem from '../components/ScheduleItem';

/**
 * 週間時間割コンポーネント
 * 月曜日〜金曜日の時間割を折りたたみ式で表示します
 * 
 * @param {Object} props - プロパティ  
 * @param {Object} props.timetable - 時間割データ
 */
function WeeklyTimetable({ timetable }) {
  // 状態管理：どの曜日が開いているかを覚えておく
  const [expandedDay, setExpandedDay] = useState(null);

  // 月曜日〜金曜日の情報
  const days = [
    { key: '月', name: '月曜日' },
    { key: '火', name: '火曜日' },
    { key: '水', name: '水曜日' },
    { key: '木', name: '木曜日' },
    { key: '金', name: '金曜日' }
  ];

  // 今日と明日の曜日を計算
  const today = new Date();
  const todayDay = ['日', '月', '火', '水', '木', '金', '土'][today.getDay()];
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDay = ['日', '月', '火', '水', '木', '金', '土'][tomorrow.getDay()];

  /**
   * 曜日をクリックした時の処理
   * @param {string} day - クリックされた曜日
   */
  const toggleDay = (day) => {
    // 既に開いている曜日をクリックしたら閉じる、そうでなければ開く
    if (expandedDay === day) {
      setExpandedDay(null);
    } else {
      setExpandedDay(day);
    }
  };

  return (
    <Card title="週間時間割">
      <div>
        {days.map(dayInfo => {
          const { key: day, name } = dayInfo;
          const isToday = day === todayDay;
          const isTomorrow = day === tomorrowDay;
          const periods = timetable[day]?.periods || [];
          const isExpanded = expandedDay === day;

          // 今日と明日は上部に表示されているので、ここでは表示しない
          if (isToday || isTomorrow) {
            return null;
          }

          return (
            <div key={day} style={{
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '12px',
              overflow: 'hidden',
              background: 'white'
            }}>
              
              {/* 曜日のヘッダー（クリック可能） */}
              <button
                onClick={() => toggleDay(day)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#f8f9fa',
                  border: 'none',
                  color: '#333',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                
                {/* 曜日名 */}
                <span>{name} ({periods.length}限)</span>
                
                {/* 展開アイコン */}
                <span style={{
                  fontSize: '14px',
                  transition: 'transform 0.3s ease',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                }}>
                  ▼
                </span>
                
              </button>

              {/* 時間割の詳細（展開された場合のみ表示） */}
              {isExpanded && (
                <div style={{
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#333'
                }}>
                  {periods.length > 0 ? (
                    <div>
                      {periods.map((subject, index) => (
                        <div key={index} style={{ marginBottom: '8px' }}>
                          <ScheduleItem
                            period={index + 1}
                            subject={subject}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ 
                      textAlign: 'center', 
                      color: '#999', 
                      padding: '20px' 
                    }}>
                      時間割が設定されていません
                    </p>
                  )}
                </div>
              )}
              
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default WeeklyTimetable;
