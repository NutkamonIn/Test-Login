'use client';

import { useEffect, useState } from 'react';

interface User {
  id: number;
  email: string;
  role: string;
}

const AdminPage = () => {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState<User[]>([]);  // แก้ไขประเภทให้เป็น User[]
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [newRole, setNewRole] = useState<string>('user');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/protected', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setMessage(data.message))
        .catch(() => setMessage('Access Denied: Unauthorized'));

      // ดึงข้อมูลผู้ใช้ทั้งหมด (จาก API)
      fetch('/api/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setUsers(data))  // setUsers(data) จะเป็นอาเรย์ของ User
        .catch(() => setMessage('Error fetching users'));
    } else {
      setMessage('No token provided');
    }
  }, []);

  const handleRoleChange = (userId: number) => {
    const token = localStorage.getItem('token');
    if (!token || !selectedUserId) return;

    // ส่งข้อมูลไปที่ API เพื่ออัปเดต role ของผู้ใช้
    fetch('/api/updateRole', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, newRole }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));  
        setMessage(data.message);
      })
      .catch(() => setMessage('Error updating role'));
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <p>{message}</p>

      <h2>User List</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
                <button onClick={() => handleRoleChange(user.id)}>Change Role</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;