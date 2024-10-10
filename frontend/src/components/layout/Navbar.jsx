import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '../../Redux/features/auth/authSlice';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate(); // Initialize useNavigate
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 640);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const handleResize = () => {
    setIsSmallScreen(window.innerWidth <= 640);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isNavVisible && window.innerWidth <= 640) {
        setIsNavVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isNavVisible]);

  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };

  const closeNav = () => {
    setIsNavVisible(false);
    window.scrollTo(0, 0);
  };

  const smoothScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const isSamePage = (path) => {
    return location.pathname === path;
  };

  const canAccessProjects = ['Admin', 'ProjectManager', 'TeamLead'].includes(
    user?.role
  );

  // Check if the user is an admin
  useEffect(() => {
    if (user?.role === 'Admin' && location.pathname !== '/admin-dashboard') {
      navigate('/admin-dashboard');
    }
  }, [user, location.pathname, navigate]);

  const handleSignOut = async () => {
    try {
      await dispatch(signOut()).unwrap();
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <div
      className={`text-white ${
        isSmallScreen
          ? ' top-0 z-10 w-full bg-[#00536a] bg-opacity-80'
          : 'w-full top-0  bg-[#00536a] bg-opacity-80 z-10 flex justify-between items-center px-10'
      }`}>
      <div className='flex justify-between items-center sm:w-auto'>
        <Link
          to='/'
          onClick={isSamePage('/') ? smoothScrollToTop : closeNav}
          className='p-3'>
          <div className=' h-7 w-fit sm:h-[35px] sm:pl-0 pl-5'>
            <p className=' sm:text-xl text-xs'>Project Management</p>
          </div>
        </Link>
        {isSmallScreen && (
          <div className='px-3'>
            <GiHamburgerMenu
              onClick={toggleNav}
              size={22}
              color='#00276a'
              aria-label='Open Menu'
            />
          </div>
        )}
      </div>

      <ul
        className={`${
          isSmallScreen
            ? isNavVisible
              ? 'flex flex-col gap-y-10 absolute bg-[#00536a] w-full bg-opacity-80 px-6 py-5 -mt-[1px]'
              : 'hidden'
            : 'flex md:text-base uppercase lg:gap-24 md:gap-14 sm:gap-8'
        }`}>
        <Link
          className={`${
            isSamePage('/') ? 'text-[#00276a] font-bold' : 'hover:text-white '
          } ${isSmallScreen ? 'mb-4' : ''}`}
          to='/'
          onClick={() => {
            if (isSamePage('/')) {
              smoothScrollToTop();
            }
            closeNav();
          }}>
          Home
        </Link>

        {canAccessProjects && (
          <Link
            className={`${
              isSamePage('/projects')
                ? 'text-[#00276a] font-bold'
                : 'hover:text-white '
            } ${isSmallScreen ? 'mb-4' : ''}`}
            to='/projects'
            onClick={() => {
              if (isSamePage('/projects')) {
                smoothScrollToTop();
              }
              closeNav();
            }}>
            My Projects
          </Link>
        )}

        <Link
          className={`${
            isSamePage('/tasks')
              ? 'text-[#00276a] font-bold'
              : 'hover:text-red '
          } ${isSmallScreen ? 'mb-4' : ''}`}
          to='/tasks'
          onClick={() => {
            if (isSamePage('/tasks')) {
              smoothScrollToTop();
            }
            closeNav();
          }}>
          My Tasks
        </Link>

        <button onClick={handleSignOut} className='text-[#00276a] font-bold '>
          SignOut
        </button>
      </ul>
    </div>
  );
};

export default Navbar;
