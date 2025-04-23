'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [birthday, setBirthday] = useState('');
  const [sex, setSex] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validId = id.trim();

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        id: validId, 
        password,
        name, 
        lastname, 
        birthday: birthday ? new Date(birthday) : null, 
        sex,
        title
      }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="คำนำหน้า"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="ชื่อ"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="สกุล"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          type="date"
          placeholder="วันเกิด"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="เพศ"
          value={sex}
          onChange={(e) => setSex(e.target.value)}
        />
        <button className="w-full bg-blue-500 text-white p-2 rounded" type="submit">
          Register
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  );
}