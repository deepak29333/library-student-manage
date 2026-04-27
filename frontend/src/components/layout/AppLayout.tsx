import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
  BookOpen,
  Library,
  Users,
  CreditCard,
  GraduationCap,
  User,
  CalendarDays,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { UserRole } from '@/types';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

const navByRole: Record<UserRole, NavItem[]> = {
  SUPER_ADMIN: [
    { label: 'Libraries', to: '/super-admin/libraries', icon: <Library className="h-4 w-4" /> },
    { label: 'Library Admins', to: '/super-admin/library-admins', icon: <Users className="h-4 w-4" /> },
    { label: 'Assign Plan', to: '/super-admin/assign-plan', icon: <CreditCard className="h-4 w-4" /> },
  ],
  LIBRARY_ADMIN: [
    { label: 'Students', to: '/library-admin/students', icon: <GraduationCap className="h-4 w-4" /> },
  ],
  STUDENT: [
    { label: 'My Profile', to: '/student/profile', icon: <User className="h-4 w-4" /> },
    { label: 'My Subscription', to: '/student/subscription', icon: <CalendarDays className="h-4 w-4" /> },
  ],
};

const roleBadge: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  LIBRARY_ADMIN: 'Library Admin',
  STUDENT: 'Student',
};

const AppLayout: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = role ? navByRole[role] : [];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="bg-primary rounded-lg p-1.5">
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm text-slate-900">LibraryOS</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">
            {role ? roleBadge[role] : ''}
          </p>
        </div>
      </div>

      <Separator />

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Separator />

      <div className="px-4 py-4">
        <div className="mb-3">
          <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-slate-200 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative flex flex-col w-60 h-full bg-white shadow-xl">
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header (mobile) */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-bold text-sm">LibraryOS</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
