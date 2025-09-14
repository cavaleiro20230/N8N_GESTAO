
import React from 'react';
import { NotificationIcon, UserIcon, ChevronDownIcon } from './Icons';
import { View } from '../types';

interface HeaderProps {
    currentView: View;
}

const viewTitles: { [key in View]: string } = {
    [View.DASHBOARD]: 'Dashboard',
    [View.PROJECTS]: 'Gerenciamento de Projetos',
    [View.ADMINISTRATIVE]: 'Gerenciamento Administrativo',
    [View.FINANCE]: 'Gerenciamento Financeiro',
    [View.PERMISSIONS]: 'Gerenciamento de Permissões',
};

const Header: React.FC<HeaderProps> = ({ currentView }) => {
  const title = viewTitles[currentView] || 'Bem-vindo(a)';
  return (
    <header className="flex items-center justify-between h-20 px-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">{title}</h1>
      <div className="flex items-center">
        <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring">
          <NotificationIcon />
          <span className="absolute top-0 right-0 h-2 w-2 mt-1 mr-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center ml-4">
            <UserIcon />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800 dark:text-white">Admin</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Fundação de Estudos do Mar</p>
          </div>
          <ChevronDownIcon />
        </div>
      </div>
    </header>
  );
};

export default Header;
