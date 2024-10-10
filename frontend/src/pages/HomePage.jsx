import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL, config } from '../config/config';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskStats = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/user/getalltask`,
          config
        );

        setTaskStats(response.data.data);
      } catch (error) {
        console.error('Error fetching task stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskStats();
  }, []);

  return (
    <div className='sm:p-12 p-6'>
      <h1 className='sm:text-3xl text-xl mb-6'>
        Welcome to Project Management App
      </h1>
      <p className='mb-4'>Manage your projects and tasks efficiently.</p>

      {loading ? (
        <p>Loading task statistics...</p>
      ) : (
        <div className='mb-6'>
          <h2 className='sm:text-2xl mb-4'>Task Statistics:</h2>
          <ul className='list-disc list-inside'>
            <li>Total Tasks: {taskStats.totalTasks}</li>
            <li>Pending Tasks: {taskStats.pendingTasks}</li>
            <li>In Progress Tasks: {taskStats.inProgressTasks}</li>
            <li>Completed Tasks: {taskStats.completedTasks}</li>
          </ul>
        </div>
      )}

      <h2 className='sm:text-2xl mb-4'>Features:</h2>
      <ul className='list-disc list-inside mb-4'>
        <li>Create and manage projects</li>
        <li>Assign tasks to team members</li>
        <li>Track task progress and status</li>
      </ul>

      <div>
        <Link to='/projects' className='text-blue-400 underline'>
          Go to Projects
        </Link>
      </div>

      <div className='mt-4'>
        <Link to='/tasks' className='text-blue-400 underline'>
          View My Tasks
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
