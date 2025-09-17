import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Edit() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'items'), {
        name: title,
        date: serverTimestamp(),
        done: false,
      });
      setTitle('');
      alert('追加しました！');
    } catch (error) {
      alert('保存エラー: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleAdd} className="flex flex-col gap-4 items-center">
      <h1>編集画面</h1>
      <label>
        <span className="textbox-3-label">予定の追加</span>
        <input
          type="text"
          className="textbox-3"
          placeholder="予定のタイトルを入力する"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </label>
      <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
        {loading ? '保存中...' : '追加'}
      </button>
    </form>
  );
}