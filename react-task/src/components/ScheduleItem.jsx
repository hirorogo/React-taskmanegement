// ScheduleItem.jsx - 時間割の1つの授業を表示するコンポーネント
import React from 'react';

/**
 * 時間割のアイテムコンポーネント
 * 「1限: 数学」のような形で表示します
 * 
 * @param {Object} props - プロパティ
 * @param {number} props.period - 何限目か（1, 2, 3...）
 * @param {string} props.subject - 科目名（数学、国語など）
 */
function ScheduleItem({ period, subject }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px'
    }}>
      {/* 時限を表示する丸いアイコン */}
      <span style={{
        width: '35px',
        height: '35px',
        background: 'rgba(255, 255, 255, 0.9)',
        color: '#333',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        fontSize: '14px',
        marginRight: '15px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
      }}>
        {period}
      </span>
      
      {/* 科目名を表示 */}
      <span style={{
        fontWeight: '500',
        fontSize: '16px'
      }}>
        {subject}
      </span>
    </div>
  );
}

export default ScheduleItem;
