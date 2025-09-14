
import React from 'react';
import { SecurityEvent } from '../types';

interface LogViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: SecurityEvent | null;
}

const DetailRow: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2 break-words">{value || 'N/A'}</dd>
    </div>
);

const LogViewerModal: React.FC<LogViewerModalProps> = ({ isOpen, onClose, event }) => {
    if (!isOpen || !event) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl shadow-xl transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 pb-4 border-b dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Detalhes do Evento de Segurança</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl">&times;</button>
                </div>
                <div>
                    <dl>
                        <DetailRow label="ID do Evento" value={event.id} />
                        <DetailRow label="Data/Hora" value={new Date(event.timestamp).toLocaleString('pt-BR')} />
                        <DetailRow label="Usuário" value={event.user} />
                        <DetailRow label="Ação" value={event.action} />
                        <DetailRow label="Detalhes" value={event.details} />
                        <DetailRow label="Nível de Risco" value={event.riskLevel} />
                        {event.authorizationInfo && (
                            <>
                                <DetailRow label="Autorizado Por" value={event.authorizationInfo.authorizedBy} />
                                <DetailRow label="Data da Autorização" value={new Date(event.authorizationInfo.timestamp).toLocaleString('pt-BR')} />
                                <DetailRow label="Justificativa" value={event.authorizationInfo.justification} />
                            </>
                        )}
                    </dl>
                </div>
                <div className="flex justify-end mt-6 pt-4 border-t dark:border-gray-700">
                    <button onClick={onClose} className="py-2 px-5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 transition duration-300">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogViewerModal;
