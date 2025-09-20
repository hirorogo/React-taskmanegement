import React from 'react'

export default function Home() {
  return (
    <>
      <h1>ホーム画面</h1>
      <button className='px-4 py-2 ' onClick={onEdit}>編集画面へ</button>
    </>
  )
}