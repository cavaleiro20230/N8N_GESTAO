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
import Security from './pages/Security';
import SecurityAlertBanner from './components/SecurityAlertBanner';
import { View, User, SecurityEvent, SecurityRiskLevel } from './types';
import { MOCK_SECURITY_EVENTS } from './constants';

const App: React.FC = () => {
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [authPage, setAuthPage] = useState<'login' | 'forgotPassword'>('login');
  
  // Security State
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(MOCK_SECURITY_EVENTS);
  const [highRiskAlert, setHighRiskAlert] = useState<SecurityEvent | null>(null);
  const [alertEmail, setAlertEmail] = useState('seguranca@femar.org.br');

  const logSecurityEvent = (event: Omit<SecurityEvent, 'id' | 'timestamp'>) => {
    const newEvent: SecurityEvent = {
      ...event,
      id: `evt-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setSecurityEvents(prev => [newEvent, ...prev]);
    if (newEvent.riskLevel === SecurityRiskLevel.High && !newEvent.authorizationInfo) {
      setHighRiskAlert(newEvent);
    }
  };

  const handleAuthorizeEvent = (eventId: string, justification: string) => {
    if (!authenticatedUser) return;
    
    setSecurityEvents(prevEvents => 
      prevEvents.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            authorizationInfo: {
              authorizedBy: authenticatedUser.email,
              timestamp: new Date().toISOString(),
              justification: justification,
            }
          };
        }
        return event;
      })
    );

    if (highRiskAlert?.id === eventId) {
      setHighRiskAlert(null);
    }
  };

  const handleLoginSuccess = (user: User) => {
    setAuthenticatedUser(user);
    logSecurityEvent({
        user: user.email,
        action: 'Login bem-sucedido',
        details: 'Autenticação via e-mail e senha.',
        riskLevel: SecurityRiskLevel.Low,
    });
    if (user.forcePasswordChange) {
      setCurrentView(View.PROFILE);
    } else {
      setCurrentView(View.DASHBOARD);
    }
  };

  const handleLogout = () => {
    setAuthenticatedUser(null);
    setAuthPage('login'); 
  };

  const handleUpdateUser = (updatedUser: User) => {
    setAuthenticatedUser(updatedUser);
  };
  
  const handleAlertEmailChange = (newEmail: string) => {
    setAlertEmail(newEmail);
  };

  const renderView = useCallback(() => {
    if (!authenticatedUser) return null;

    const props = { user: authenticatedUser, logSecurityEvent };

    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard />;
      case View.PROJECTS:
        return <Projects />;
      case View.ADMINISTRATIVE:
        return <Administrative />;
      case View.FINANCE:
        return <Finance {...props} />;
      case View.PERMISSIONS:
        return <Permissions {...props} />;
      case View.PROFILE:
        return <Profile user={authenticatedUser} onUpdateUser={handleUpdateUser} />;
      case View.SECURITY:
        return <Security 
                  user={authenticatedUser}
                  events={securityEvents} 
                  alertEmail={alertEmail} 
                  onAlertEmailChange={handleAlertEmailChange}
                  onAuthorizeEvent={handleAuthorizeEvent}
                />;
      default:
        return <Dashboard />;
    }
  }, [currentView, authenticatedUser, securityEvents, alertEmail]);

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
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6 relative">
          {highRiskAlert && (
            <SecurityAlertBanner 
              event={highRiskAlert} 
              alertEmail={alertEmail}
              onDismiss={() => setHighRiskAlert(null)} 
            />
          )}
          <div className={highRiskAlert ? 'pt-16' : ''}>
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;