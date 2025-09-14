
import React, { useState, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Administrative from './pages/Administrative';
import Finance from './pages/Finance';
import Permissions from './pages/Permissions';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import { View, User } from './types';

const App: React.FC = () => {
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [authPage, setAuthPage] = useState<'login' | 'forgotPassword'>('login');

  const handleLoginSuccess = (user: User) => {
    setAuthenticatedUser(user);
    if (user.forcePasswordChange) {
      setCurrentView(View.PROFILE);
    } else {
      setCurrentView(View.DASHBOARD);
    }
  };

  const handleLogout = () => {
    setAuthenticatedUser(null);
    setAuthPage('login'); // Reseta para a tela de login ao sair
  };

  const handleUpdateUser = (updatedUser: User) => {
    setAuthenticatedUser(updatedUser);
  };

  const renderView = useCallback(() => {
    if (!authenticatedUser) return null;

    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard />;
      case View.PROJECTS:
        return <Projects />;
      case View.ADMINISTRATIVE:
        return <Administrative />;
      case View.FINANCE:
        return <Finance />;
      case View.PERMISSIONS:
        return <Permissions />;
      case View.PROFILE:
        return <Profile user={authenticatedUser} onUpdateUser={handleUpdateUser} />;
      default:
        return <Dashboard />;
    }
  }, [currentView, authenticatedUser]);

  if (!authenticatedUser) {
    if (authPage === 'login') {
        return <Login onLoginSuccess={handleLoginSuccess} onNavigateToForgotPassword={() => setAuthPage('forgotPassword')} />;
    }
    if (authPage === 'forgotPassword') {
        return <ForgotPassword onNavigateToLogin={() => setAuthPage('login')} />;
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar 
        user={authenticatedUser}
        currentView={currentView} 
        setCurrentView={setCurrentView} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={authenticatedUser}
          currentView={currentView}
          setCurrentView={setCurrentView}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;