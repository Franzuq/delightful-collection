import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requireAuth = true 
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // If authentication is required and user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route should be accessed only by non-authenticated users (like login/signup) 
  // and user is already authenticated, redirect to gallery
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/gallery" replace />;
  }

  // If conditions are met, render the children
  return <>{children}</>;
}; 