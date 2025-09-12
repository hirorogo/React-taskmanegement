import React, { useState } from 'react';

export default function ClassSelect({ onSelect }) {
  const [classId, setClassId] = useState('');
  const [subject, setSubject] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (classId && subject) {
      onSelect({ classId, subject });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
      <label htmlFor="class-select">あなたのクラスは？</label>
      <select id="class-select" value={classId} onChange={e => setClassId(e.target.value)}>
        <option value="">選択してください</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
      </select>
      <label htmlFor="subject-select">あなたの学科は？</label>
      <select id="subject-select" value={subject} onChange={e => setSubject(e.target.value)}>
        <option value="">選択してください</option>
        <option value="S">S 理工科</option>
        <option value="M">M 機械加工科</option>
        <option value="R">R 機械制御科</option>
        <option value="E">E 電気科</option>
        <option value="N">N 電子情報科</option>
        <option value="A">A 建設科</option>
        <option value="D">D デザイン工学科</option>
      </select>
      <button type="submit" >決定</button>
    </form>
  );
}