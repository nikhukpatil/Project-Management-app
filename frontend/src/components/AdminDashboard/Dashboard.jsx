import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL, config } from '../../config/config';

const Dashboard = () => {
  const [projectCount, setProjectCount] = useState(0);
  const [taskData, setTaskData] = useState({});
  const [roleCounts, setRoleCounts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch project count
        const projectResponse = await axios.get(
          `${API_URL}/api/admin/getprojectcounts`,
          config
        );
        setProjectCount(projectResponse.data.count || 0);

        // Fetch tasks with status
        const taskResponse = await axios.get(
          `${API_URL}/api/admin/gettaskcounts`,
          config
        );
        const tasks = taskResponse.data.counts || [];
        setTaskData(tasks);

        // Fetch users and count roles excluding Admin
        const userResponse = await axios.get(
          `${API_URL}/api/admin/getusercounts`,
          config
        );
        const users = userResponse.data.counts || [];

        setRoleCounts(users);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='sm:p-12 py-10 px-5'>
      <h1 className='text-2xl mb-4 text-center'>Dashboard</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-blue-500 text-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold'>Total Projects</h2>
          <p className='text-3xl'>{projectCount}</p>
        </div>

        <div className='bg-green-500 text-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold'>Tasks by Status</h2>
          <ul>
            <p>Completed: {taskData.completed || 0}</p>
            <p>In Progress: {taskData.inProgress || 0}</p>
            <p>Pending: {taskData.pending || 0}</p>
          </ul>
        </div>

        <div className='bg-purple-500 text-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold'>Users Count by Role</h2>
          <ul>
            {Object.entries(roleCounts).map(([role, count]) => (
              <li key={role} className='flex justify-between'>
                <span>{role}:</span>
                <span>{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
