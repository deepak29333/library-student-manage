import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import Login from '@/pages/Login';
import Libraries from '@/pages/super-admin/Libraries';
import LibraryAdmins from '@/pages/super-admin/LibraryAdmins';
import AssignPlan from '@/pages/super-admin/AssignPlan';
import Students from '@/pages/library-admin/Students';
import StudentDetail from '@/pages/library-admin/StudentDetail';
import Profile from '@/pages/student/Profile';
import SubscriptionPage from '@/pages/student/Subscription';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Super Admin */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/super-admin/libraries" element={<Libraries />} />
            <Route path="/super-admin/library-admins" element={<LibraryAdmins />} />
            <Route path="/super-admin/assign-plan" element={<AssignPlan />} />
          </Route>

          {/* Library Admin */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['LIBRARY_ADMIN']}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/library-admin/students" element={<Students />} />
            <Route path="/library-admin/students/:id" element={<StudentDetail />} />
          </Route>

          {/* Student */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/student/profile" element={<Profile />} />
            <Route path="/student/subscription" element={<SubscriptionPage />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-slate-300">404</h1>
                  <p className="text-slate-500 mt-2">Page not found</p>
                  <a href="/login" className="text-primary text-sm mt-4 inline-block hover:underline">
                    Go to login
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
