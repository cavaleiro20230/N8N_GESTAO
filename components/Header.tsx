
import React, { useState, useRef, useEffect } from 'react';
import { NotificationIcon, ChevronDownIcon } from './Icons';
import { View, User } from '../types';

interface HeaderProps {
    user: User;
    currentView: View;
    setCurrentView: (view: View) => void;
    onLogout: () => void;
}

const viewTitles: { [key in View | 'profile']: string } = {
    [View.DASHBOARD]: 'Dashboard',
    [View.PROJECTS]: 'Gerenciamento de Projetos',
    [View.ADMINISTRATIVE]: 'Gerenciamento Administrativo',
    [View.FINANCE]: 'Gerenciamento Financeiro',
    [View.PERMISSIONS]: 'Gerenciamento de Permissões',
    [View.PROFILE]: 'Meu Perfil',
    [View.SECURITY]: 'Central de Segurança',
};

const UserAvatar: React.FC<{ user: User }> = ({ user }) => {
    if (user.avatarUrl) {
        return <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" />;
    }
    return (
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 font-bold">{user.name.charAt(0)}</span>
        </div>
    );
};


const Header: React.FC<HeaderProps> = ({ user, currentView, setCurrentView, onLogout }) => {
  const title = viewTitles[currentView] || 'Bem-vindo(a)';
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between h-20 px-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">{title}</h1>
      <div className="flex items-center">
        <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring">
          <NotificationIcon />
          <span className="absolute top-0 right-0 h-2 w-2 mt-1 mr-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="relative ml-4" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <UserAvatar user={user} />
              <div className="ml-3 text-left">
                <p className="text-sm font-medium text-gray-800 dark:text-white">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
              </div>
              <ChevronDownIcon />
            </button>
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                    <button 
                        onClick={() => {
                            setCurrentView(View.PROFILE);
                            setIsDropdownOpen(false);
                        }}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Meu Perfil
                    </button>
                    <button 
                        onClick={onLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Sair
                    </button>
                </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;