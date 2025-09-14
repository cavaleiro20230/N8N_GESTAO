
import React, { useState } from 'react';
import { SecurityEvent, SecurityRiskLevel, User, UserRole } from '../types';
import { SaveIcon, CheckShieldIcon, DownloadIcon, EyeIcon } from '../components/Icons';
import { MOCK_ROLE_PERMISSIONS } from '../constants';
import LogViewerModal from '../components/LogViewerModal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface SecurityProps {
    user: User;
    events: SecurityEvent[];
    alertEmail: string;
    onAlertEmailChange: (newEmail: string) => void;
    onAuthorizeEvent: (eventId: string, justification: string) => void;
}

const getRiskLevelClass = (level: SecurityRiskLevel) => {
    switch (level) {
        case SecurityRiskLevel.High: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        case SecurityRiskLevel.Medium: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case SecurityRiskLevel.Low: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
};

const AuthorizationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (justification: string) => void;
    event: SecurityEvent | null;
}> = ({ isOpen, onClose, onSave, event }) => {
    const [justification, setJustification] = useState('');

    if (!isOpen || !event) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(justification);
        setJustification('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-lg shadow-xl">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Autorizar Evento de Risco</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">A ação "{event.action}" foi marcada como de alto risco. Por favor, forneça uma justificativa para autorizá-la.</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="justification" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Justificativa</label>
                        <textarea
                            id="justification"
                            value={justification}
                            onChange={(e) => setJustification(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Ex: Pagamento aprovado pela diretoria para fornecedor estratégico."
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">Cancelar</button>
                        <button type="submit" className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700">Salvar Autorização</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Security: React.FC<SecurityProps> = ({ user, events, alertEmail, onAlertEmailChange, onAuthorizeEvent }) => {
    const [emailInput, setEmailInput] = useState(alertEmail);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [eventToAuthorize, setEventToAuthorize] = useState<SecurityEvent | null>(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);

    const userPermissions = MOCK_ROLE_PERMISSIONS[user.role] || [];
    const canManageSettings = userPermissions.includes('manageAntiFraudSettings');
    const canAuthorize = [UserRole.NETWORK_ADMIN, UserRole.SUPERINTENDENT, UserRole.MANAGER].includes(user.role);

    const handleEmailSave = (e: React.FormEvent) => {
        e.preventDefault();
        onAlertEmailChange(emailInput);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleOpenAuthModal = (event: SecurityEvent) => {
        setEventToAuthorize(event);
        setIsAuthModalOpen(true);
    };
    
    const handleViewDetails = (event: SecurityEvent) => {
        setSelectedEvent(event);
        setIsViewerOpen(true);
    };

    const handleDownloadPdf = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text('Relatório de Segurança - FEMAR Gestão', 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 30);

        const tableColumn = ["Data/Hora", "Usuário", "Ação", "Risco", "Autorizado"];
        const tableRows: (string|null)[][] = [];

        events.forEach(event => {
            const eventData = [
                new Date(event.timestamp).toLocaleString('pt-BR'),
                event.user,
                event.action,
                event.riskLevel,
                event.authorizationInfo ? `Sim (${event.authorizationInfo.authorizedBy})` : 'Não'
            ];
            tableRows.push(eventData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: 'striped',
            headStyles: { fillColor: [37, 99, 235] }, // Blue color for header
        });
        
        const pageCount = (doc as any).internal.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setTextColor(150);
            doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10);
        }

        doc.save('relatorio_seguranca_femar.pdf');
    };

    return (
        <div>
            <AuthorizationModal 
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                event={eventToAuthorize}
                onSave={(justification) => {
                    if (eventToAuthorize) {
                        onAuthorizeEvent(eventToAuthorize.id, justification);
                    }
                }}
            />
            <LogViewerModal 
                isOpen={isViewerOpen}
                onClose={() => setIsViewerOpen(false)}
                event={selectedEvent}
            />
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-8">Central de Segurança</h2>
            
            {canManageSettings && (
                 <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Configurações de Alerta</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Este é o e-mail que receberá notificações em tempo real sobre atividades de alto risco detectadas pelo sistema antifraude.
                    </p>
                    {showSuccess && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-md" role="alert">
                            <p>E-mail de alerta atualizado com sucesso!</p>
                        </div>
                    )}
                    <form onSubmit={handleEmailSave} className="flex items-center space-x-4">
                        <div className="flex-grow">
                            <label htmlFor="alertEmail" className="sr-only">E-mail para Alertas</label>
                            <input
                                type="email"
                                id="alertEmail"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="seguranca@femar.org.br"
                                required
                            />
                        </div>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center">
                            <SaveIcon />
                            Salvar
                        </button>
                    </form>
                </div>
            )}
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Log de Eventos em Tempo Real</h3>
                    <button onClick={handleDownloadPdf} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300 flex items-center">
                        <DownloadIcon />
                        Baixar PDF
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                            <tr>
                                <th className="py-3 px-6 text-left">Data/Hora</th>
                                <th className="py-3 px-6 text-left">Usuário</th>
                                <th className="py-3 px-6 text-left">Ação</th>
                                <th className="py-3 px-6 text-center">Risco</th>
                                <th className="py-3 px-6 text-center">Ações</th>
                                <th className="py-3 px-6 text-left">Autorização</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
                            {events.map(event => (
                                <tr key={event.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="py-3 px-6 text-left whitespace-nowrap">{new Date(event.timestamp).toLocaleString('pt-BR')}</td>
                                    <td className="py-3 px-6 text-left">{event.user}</td>
                                    <td className="py-3 px-6 text-left">{event.action}</td>
                                    <td className="py-3 px-6 text-center">
                                        <span className={`py-1 px-3 rounded-full text-xs font-semibold ${getRiskLevelClass(event.riskLevel)}`}>
                                            {event.riskLevel}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        <button onClick={() => handleViewDetails(event)} className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                            <EyeIcon />
                                        </button>
                                    </td>
                                    <td className="py-3 px-6 text-left">
                                        {event.riskLevel === SecurityRiskLevel.High && (
                                            event.authorizationInfo ? (
                                                <div className="flex items-center text-green-600 dark:text-green-400 group relative">
                                                    <CheckShieldIcon className="w-6 h-6 mr-2" />
                                                    <span className="font-semibold">Autorizado</span>
                                                    <div className="absolute left-0 bottom-full mb-2 w-64 bg-gray-900 text-white text-xs rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                                                        <p><strong>Por:</strong> {event.authorizationInfo.authorizedBy}</p>
                                                        <p><strong>Em:</strong> {new Date(event.authorizationInfo.timestamp).toLocaleString('pt-BR')}</p>
                                                        <p><strong>Motivo:</strong> {event.authorizationInfo.justification}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => handleOpenAuthModal(event)}
                                                    disabled={!canAuthorize}
                                                    className="bg-yellow-500 text-white text-xs font-bold py-1 px-3 rounded-lg hover:bg-yellow-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                >
                                                    Autorizar
                                                </button>
                                            )
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Security;