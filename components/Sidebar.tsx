
import React, { useMemo } from 'react';
import { View, User, Permission } from '../types';
import { DashboardIcon, ProjectsIcon, AdminIcon, FinanceIcon, PermissionsIcon, FemarLogo } from './Icons';
import { MOCK_ROLE_PERMISSIONS } from '../constants';

interface SidebarProps {
  user: User;
  currentView: View;
  setCurrentView: (view: View) => void;
}

interface NavItemProps {
  icon: JSX.Element;
  label: string;
  view: View;
  isActive: boolean;
  onClick: () => void;
}

const VIEW_PERMISSIONS: Record<View, Permission> = {
    [View.DASHBOARD]: 'viewDashboard',
    [View.PROJECTS]: 'viewProjects',
    [View.ADMINISTRATIVE]: 'viewAdministrative',
    [View.FINANCE]: 'viewFinance',
    [View.PERMISSIONS]: 'managePermissions',
};

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {icon}
    <span className="mx-4 font-medium">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ user, currentView, setCurrentView }) => {
  const allNavItems = useMemo(() => [
    { icon: <DashboardIcon />, label: 'Dashboard', view: View.DASHBOARD },
    { icon: <ProjectsIcon />, label: 'Projetos', view: View.PROJECTS },
    { icon: <AdminIcon />, label: 'Administrativo', view: View.ADMINISTRATIVE },
    { icon: <FinanceIcon />, label: 'Financeiro', view: View.FINANCE },
    { icon: <PermissionsIcon />, label: 'Permissões', view: View.PERMISSIONS },
  ], []);

  const visibleNavItems = useMemo(() => {
    const userPermissions = MOCK_ROLE_PERMISSIONS[user.role] || [];
    return allNavItems.filter(item => {
        const requiredPermission = VIEW_PERMISSIONS[item.view];
        return userPermissions.includes(requiredPermission);
    });
  }, [user, allNavItems]);

  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-800">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <FemarLogo />
        <h1 className="text-xl text-white font-bold ml-2">FEMAR Gestão</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <nav>
          {visibleNavItems.map((item) => (
            <NavItem
              key={item.view}
              icon={item.icon}
              label={item.label}
              view={item.view}
              isActive={currentView === item.view}
              onClick={() => setCurrentView(item.view)}
            />
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
