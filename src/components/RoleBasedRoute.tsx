import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'client')[];
  redirectTo?: string;
}

export default function RoleBasedRoute({ 
  children, 
  allowedRoles, 
  redirectTo = '/' 
}: RoleBasedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Rediriger selon le rôle
    const roleRedirects = {
      admin: '/dashboard',
      client: '/client/dashboard'
    };
    
    return <Navigate to={roleRedirects[user.role]} replace />;
  }

  return <>{children}</>;
}