import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';

export default function Edit() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  // データ取得
  useEffect(() => {
    async function fetchItems() {
      const snapshot = await getDocs(collection(db, 'items'));
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchItems();
  }, [loading]); // 追加・削除後に再取得

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
    <div className="flex flex-col gap-4 items-center">
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
      <ul className="mt-8 w-full max-w-md">
        {items.map(item => (
          <li key={item.id} className="border-b py-2">{item.name}</li>
        ))}
      </ul>
    </div>
  );
}


