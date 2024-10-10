import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useDispatch } from 'react-redux';
import { signOut } from '../Redux/features/auth/authSlice';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLinkClick = () => {
    if (isSidebarOpen) {
      toggleSidebar();
    }
  };

  const handleSignOut = async () => {
    try {
      await dispatch(signOut()).unwrap();
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };
  return (
    <div className='flex min-h-screen'>
      <div
        className={`fixed inset-y-0 left-0 bg-[#00536a] w-64 p-5 transition-transform transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0 sm:static`}>
        <div className='text-white text-xl mb-10'>Admin Dashboard</div>
        <nav className='flex flex-col gap-4'>
          <Link
            to='/admin-dashboard'
            onClick={handleLinkClick}
            className='text-white hover:bg- p-2 rounded-md'>
            Dashboard Overview
          </Link>
          <Link
            to='/admin-dashboard/manage-users'
            onClick={handleLinkClick}
            className='text-white hover:bg- p-2 rounded-md'>
            Manage Users
          </Link>
          <Link
            to='/admin-dashboard/manage-projects'
            onClick={handleLinkClick}
            className='text-white hover:bg- p-2 rounded-md'>
            Manage Projects
          </Link>
          <Link
            to='/admin-dashboard/manage-tasks'
            onClick={handleLinkClick}
            className='text-white hover:bg- p-2 rounded-md'>
            Manage Tasks
          </Link>
          <p
            onClick={handleSignOut}
            className='text-white cursor-pointer hover:bg-[#004d5d] p-2 rounded-md'>
            Sign Out
          </p>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className='flex-1 ml-0 p-5'>
        {/* Hamburger menu for small screens */}
        <div className='sm:hidden mb-4 z-20'>
          <button
            onClick={toggleSidebar}
            className='text-gray-700 focus:outline-none'>
            <GiHamburgerMenu size={28} />
          </button>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-md text-black'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
