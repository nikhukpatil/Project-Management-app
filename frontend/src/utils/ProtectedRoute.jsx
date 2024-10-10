import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../Redux/features/auth/authSlice';

const useAuth = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await dispatch(getUser()).unwrap();
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  return { user, loading };
};

export const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to='/signin' />;
  }
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to='/' />;
  }

  return children;
};
