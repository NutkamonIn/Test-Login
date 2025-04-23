'use client';

import { useEffect, useState } from 'react';

interface User {
  ap_index_view_id: number;
  id: string;
  name?: string;
  permission: string;
}

const AdminPage = () => {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [newRoles, setNewRoles] = useState<{ [key: number]: string }>({});

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

      fetch('/api/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setUsers(Array.isArray(data) ? data : data.users || []))
        .catch(() => setMessage('Error fetching users'));
    } else {
      setMessage('No token provided');
    }
  }, []);

  const handleRoleChange = (userId: number) => {
    const token = localStorage.getItem('token');
    if (!token || !userId) return;

    const newRole = newRoles[userId];  // ใช้ newRole ของผู้ใช้ที่ถูกเลือก

    fetch('/api/users', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ap_index_view_id: userId, permission: newRole }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(users.map(user => user.ap_index_view_id === userId ? { ...user, permission: newRole } : user));
        setMessage(data.message);
      })
      .catch(() => setMessage('Error updating role'));
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <p>{message}</p>

      <h2>User List</h2>
      <table className="min-w-full table-auto border border-gray-300 mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border-b text-left">ID</th>
            <th className="px-4 py-2 border-b text-left">Permission</th>
            <th className="px-4 py-2 border-b text-left">Change Permission</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.map(user => (
            <tr key={user.ap_index_view_id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{user.id}</td>
              <td className="px-4 py-2 border-b">{user.permission}</td>
              <td className="px-4 py-2 border-b">
                <div className="flex items-center space-x-2">
                  <select
                    value={newRoles[user.ap_index_view_id] || user.permission}
                    onChange={(e) => setNewRoles({...newRoles, [user.ap_index_view_id]: e.target.value})}
                    className="border rounded px-2 py-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                  </select>
                  <button
                    onClick={() => handleRoleChange(user.ap_index_view_id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Change
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;