import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const roleHome: Record<UserRole, string> = {
  SUPER_ADMIN: '/super-admin/libraries',
  LIBRARY_ADMIN: '/library-admin/students',
  STUDENT: '/student/profile',
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && !allowedRoles.includes(role)) {
    return <Navigate to={roleHome[role]} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
