import React from 'react';
import { SecurityEvent } from '../types';
import { AlertTriangleIcon } from './Icons';

interface SecurityAlertBannerProps {
  event: SecurityEvent;
  alertEmail: string;
  onDismiss: () => void;
}

const SecurityAlertBanner: React.FC<SecurityAlertBannerProps> = ({ event, alertEmail, onDismiss }) => {
  return (
    <div className="absolute top-0 left-0 right-0 bg-red-600 text-white p-4 flex items-center justify-between shadow-lg z-50">
      <div className="flex items-center">
        <AlertTriangleIcon className="w-6 h-6 mr-3" />
        <div>
          <p className="font-bold">Alerta de Segurança de Alto Risco!</p>
          <p className="text-sm">
            Ação suspeita detectada: "{event.action}" por {event.user}. Um e-mail de notificação foi enviado para <strong>{alertEmail}</strong>.
          </p>
        </div>
      </div>
      <button onClick={onDismiss} className="text-white hover:bg-red-700 p-1 rounded-full">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default SecurityAlertBanner;