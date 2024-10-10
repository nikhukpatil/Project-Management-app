import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from './Redux/features/auth/authSlice';
import { ProtectedRoute } from './utils/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/HomePage';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Layout from './pages/Layout';
import Projects from './pages/Projects';
import Task from './pages/Task';
import ProjectInfo from './pages/ProjectInfo';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './components/AdminDashboard/ManageUsers';
import Dashboard from './components/AdminDashboard/Dashboard';
import ManageProjects from './components/AdminDashboard/ManageProjects';
import ManageTasks from './components/AdminDashboard/ManageTasks';
import ViewProject from './components/AdminDashboard/ViewProject';

const App = () => {
  const { auth } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await dispatch(getUser()).unwrap();
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [auth, dispatch]);

  if (loading) {
    return (
      <div className='fixed inset-0 overflow-hidden w-full h-full flex justify-center items-center z-50'>
        <div className='w-32 h-32'>Loadung...</div>
      </div>
    );
  }
  return (
    <div className=''>
      <Routes>
        <Route
          path='signup'
          element={
            auth === null ? <Signup /> : <Navigate to='/' replace={true} />
          }
        />
        <Route
          path='signin'
          element={
            auth === null ? <Signin /> : <Navigate to='/' replace={true} />
          }
        />

        <Route
          path='/admin-dashboard'
          element={
            <ProtectedRoute requiredRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }>
          {/* Nested Routes for Admin Dashboard */}
          <Route index element={<Dashboard />} />
          <Route path='manage-users' element={<ManageUsers />} />
          <Route path='manage-projects' element={<ManageProjects />} />
          <Route path='manage-tasks' element={<ManageTasks />} />
          <Route path='view-project/:projectId' element={<ViewProject />} />
        </Route>
        <Route path='/' element={<Layout />}>
          <Route
            index
            element={
              <ProtectedRoute
                requiredRoles={['ProjectManager', 'TeamLead', 'User']}>
                <HomePage />
              </ProtectedRoute>
            }
          />{' '}
          <Route
            path='/projects'
            element={
              <ProtectedRoute requiredRoles={['ProjectManager', 'TeamLead']}>
                <Projects />
              </ProtectedRoute>
            }
          />{' '}
          <Route
            path='/tasks'
            element={
              <ProtectedRoute
                requiredRoles={['ProjectManager', 'TeamLead', 'User']}>
                <Task />
              </ProtectedRoute>
            }
          />{' '}
          <Route
            path='/projects/:id'
            element={
              <ProtectedRoute requiredRoles={['ProjectManager', 'TeamLead']}>
                <ProjectInfo />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;
