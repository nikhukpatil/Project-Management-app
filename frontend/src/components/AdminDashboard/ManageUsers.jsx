import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL, config } from '../../config/config';
import { toast } from 'react-toastify';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/admin`, config);

        const filteredUsers = response.data.users.filter(
          (user) => user.role !== 'Admin'
        );

        setUsers(filteredUsers);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/admin/updaterole/${userId}`,
        { role: newRole },
        config
      );
      toast.success(response.data.message);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      setError('Failed to change user role');
    }
  };

  if (loading) {
    return <div className='text-center'>Loading...</div>;
  }

  if (error) {
    return <div className='text-red-500 text-center'>{error}</div>;
  }

  return (
    <div className=' p-4'>
      <h2 className='text-2xl font-bold mb-4'>Manage Users</h2>
      <table className='min-w-full bg-white border border-gray-300 rounded-lg'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='py-2 px-4 text-left'>Name</th>
            <th className='py-2 px-4 text-left'>Email</th>
            <th className='py-2 px-4 text-left'>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className='border-b hover:bg-gray-100'>
              <td className='py-2 px-4'>{user.fullName}</td>
              <td className='py-2 px-4'>{user.email}</td>
              <td className='py-2 px-4'>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className='border rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300'>
                  <option value='ProjectManager'>Project Manager</option>
                  <option value='TeamLead'>Team Lead</option>
                  <option value='User'>User</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
