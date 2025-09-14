import { Project, ProjectStatus, TaskStatus, Document, Contact, Invoice, InvoiceStatus, UserRole, RolePermissions, Permission, TaskPriority, User } from './types';

export const ALL_PERMISSIONS: { id: Permission; label: string; area: string }[] = [
    { id: 'viewDashboard', label: 'Visualizar Dashboard', area: 'Geral' },
    { id: 'viewProjects', label: 'Visualizar Projetos', area: 'Projetos' },
    { id: 'createProjects', label: 'Criar Novos Projetos', area: 'Projetos' },
    { id: 'editProjects', label: 'Editar Projetos', area: 'Projetos' },
    { id: 'deleteProjects', label: 'Excluir Projetos', area: 'Projetos' },
    { id: 'viewAdministrative', label: 'Visualizar Administrativo', area: 'Administrativo' },
    { id: 'uploadDocuments', label: 'Carregar Documentos', area: 'Administrativo' },
    { id: 'manageContacts', label: 'Gerenciar Contatos', area: 'Administrativo' },
    { id: 'viewFinance', label: 'Visualizar Financeiro', area: 'Financeiro' },
    { id: 'createInvoices', label: 'Criar Faturas', area: 'Financeiro' },
    { id: 'manageInvoices', label: 'Gerenciar Faturas', area: 'Financeiro' },
    { id: 'generateReports', label: 'Gerar Relatórios', area: 'Financeiro' },
    { id: 'managePermissions', label: 'Gerenciar Permissões', area: 'Sistema' },
];

export const MOCK_ROLE_PERMISSIONS: RolePermissions = {
    [UserRole.NETWORK_ADMIN]: [
        'viewDashboard', 'viewProjects', 'createProjects', 'editProjects', 'deleteProjects',
        'viewAdministrative', 'uploadDocuments', 'manageContacts', 'viewFinance',
        'createInvoices', 'manageInvoices', 'generateReports', 'managePermissions'
    ],
    [UserRole.SUPERINTENDENT]: [
        'viewDashboard', 'viewProjects', 'createProjects', 'editProjects', 'deleteProjects',
        'viewAdministrative', 'uploadDocuments', 'manageContacts', 'viewFinance',
        'createInvoices', 'manageInvoices', 'generateReports'
    ],
    [UserRole.MANAGER]: [
        'viewDashboard', 'viewProjects', 'createProjects', 'editProjects',
        'viewAdministrative', 'uploadDocuments', 'manageContacts', 'viewFinance',
        'createInvoices', 'manageInvoices', 'generateReports'
    ],
    [UserRole.COLLABORATOR]: [
        'viewDashboard', 'viewProjects', 'editProjects', 'viewAdministrative', 'uploadDocuments'
    ],
    [UserRole.AUDITOR]: [
        'viewDashboard', 'viewProjects', 'viewAdministrative', 'viewFinance'
    ],
};

export const MOCK_USERS: User[] = [
    { id: 'user-1', name: 'Admin User', email: 'admin@femar.org.br', role: UserRole.NETWORK_ADMIN, avatarUrl: `https://i.pravatar.cc/150?u=admin@femar.org.br`, forcePasswordChange: false },
    { id: 'user-2', name: 'Ana Silva', email: 'ana.silva@femar.org.br', role: UserRole.MANAGER, avatarUrl: `https://i.pravatar.cc/150?u=ana.silva@femar.org.br`, forcePasswordChange: true },
    { id: 'user-3', name: 'Carlos Pereira', email: 'carlos.pereira@femar.org.br', role: UserRole.COLLABORATOR, avatarUrl: `https://i.pravatar.cc/150?u=carlos.pereira@femar.org.br`, forcePasswordChange: true },
    { id: 'user-4', name: 'João Mendes', email: 'joao.mendes@femar.org.br', role: UserRole.SUPERINTENDENT, avatarUrl: `https://i.pravatar.cc/150?u=joao.mendes@femar.org.br`, forcePasswordChange: false },
    { id: 'user-5', name: 'Sandra Gomes', email: 'sandra.gomes@femar.org.br', role: UserRole.AUDITOR, avatarUrl: `https://i.pravatar.cc/150?u=sandra.gomes@femar.org.br`, forcePasswordChange: false },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    name: 'Sistema de Monitoramento Marinho',
    manager: 'Ana Silva',
    startDate: '2023-01-15',
    endDate: '2024-06-30',
    status: ProjectStatus.OnTrack,
    budget: 150000,
    tasks: [
      { id: 't-1', title: 'Desenvolvimento do Frontend', assignee: 'Carlos Pereira', dueDate: '2024-03-30', status: TaskStatus.Done, priority: TaskPriority.High, description: 'Criar a interface do usuário com React e Tailwind CSS, incluindo todos os componentes de dashboard e gerenciamento.', subTasks: [], attachments: [] },
      { id: 't-2', title: 'Configuração do Banco de Dados', assignee: 'Beatriz Costa', dueDate: '2024-02-28', status: TaskStatus.Done, priority: TaskPriority.High, description: 'Estruturar o banco de dados SQL para armazenar informações de projetos, usuários e finanças.', subTasks: [], attachments: [] },
      { id: 't-3', title: 'Integração com n8n', assignee: 'Carlos Pereira', dueDate: '2024-04-15', status: TaskStatus.InProgress, priority: TaskPriority.Medium, description: 'Conectar os webhooks do React com os workflows do n8n para processar dados de projetos e finanças. Garantir que a comunicação seja segura e eficiente.', subTasks: [{ id: 'st-1', title: 'Criar webhook de propostas', completed: true }, { id: 'st-2', title: 'Testar fluxo de ponta a ponta', completed: false }, { id: 'st-3', title: 'Implementar tratamento de erros', completed: false }], attachments: [{ id: 'att-1', fileName: 'diagrama_fluxo.pdf', url: '#' }, { id: 'att-2', fileName: 'api_docs.docx', url: '#' }] },
      { id: 't-4', title: 'Treinamento de Agente IA', assignee: 'Dario Almeida', dueDate: '2024-05-10', status: TaskStatus.ToDo, priority: TaskPriority.Low, description: 'Alimentar o modelo de IA com documentos de exemplo para treinar a extração de dados de contratos e faturas.', subTasks: [], attachments: [{ id: 'att-3', fileName: 'dataset_treinamento.zip', url: '#' }] },
    ],
  },
  {
    id: 'proj-002',
    name: 'Análise de Viabilidade de Projetos Costeiros',
    manager: 'João Mendes',
    startDate: '2023-03-01',
    endDate: '2024-09-20',
    status: ProjectStatus.AtRisk,
    budget: 85000,
    tasks: [
      { id: 't-5', title: 'Coleta de dados primários', assignee: 'Elisa Ferreira', dueDate: '2024-05-01', status: TaskStatus.InProgress, priority: TaskPriority.High, description: 'Realizar pesquisas de campo e coletar amostras para análise.', subTasks: [{ id: 'st-4', title: 'Definir áreas de coleta', completed: true }, { id: 'st-5', title: 'Agendar expedições', completed: true }, { id: 'st-6', title: 'Analisar amostras em laboratório', completed: false }], attachments: [] },
      { id: 't-6', title: 'Análise de propostas via IA', assignee: 'Dario Almeida', dueDate: '2024-04-25', status: TaskStatus.ToDo, priority: TaskPriority.Medium, description: 'Utilizar o agente de IA para analisar e sumarizar propostas de projetos parceiros.', subTasks: [], attachments: [] },
    ],
  },
  {
    id: 'proj-003',
    name: 'Digitalização de Arquivo Histórico',
    manager: 'Fernanda Lima',
    startDate: '2022-10-10',
    endDate: '2023-12-22',
    status: ProjectStatus.Completed,
    budget: 50000,
    tasks: [],
  },
];

export const MOCK_DOCUMENTS: Document[] = [
    { id: 'doc-1', name: 'Contrato_Parceria_A.pdf', type: 'Contrato', uploadDate: '2024-03-10', size: '1.2 MB' },
    { id: 'doc-2', name: 'Recibo_Serviços_IA.pdf', type: 'Recibo', uploadDate: '2024-03-15', size: '340 KB' },
    { id: 'doc-3', name: 'Proposta_Monitoramento.docx', type: 'Proposta', uploadDate: '2024-02-28', size: '850 KB' },
];

export const MOCK_CONTACTS: Contact[] = [
    { id: 'con-1', name: 'Instituto Oceanográfico', email: 'contato@io.usp.br', role: 'Parceiro', organization: 'USP' },
    { id: 'con-2', name: 'Mariana Santos', email: 'mariana.s@marinha.mil.br', role: 'Gestora', organization: 'Marinha do Brasil' },
    { id: 'con-3', name: 'Tech Solutions Ltda', email: 'comercial@techsolutions.com', role: 'Fornecedor', organization: 'Tech Solutions' },
];

export const MOCK_INVOICES: Invoice[] = [
    { id: 'inv-1', invoiceNumber: '2024-058', client: 'Tech Solutions Ltda', amount: 12500.00, issueDate: '2024-03-01', dueDate: '2024-03-31', status: InvoiceStatus.Paid },
    { id: 'inv-2', invoiceNumber: '2024-059', client: 'Consultoria Ambiental Marítima', amount: 7800.50, issueDate: '2024-03-15', dueDate: '2024-04-14', status: InvoiceStatus.Pending },
    { id: 'inv-3', invoiceNumber: '2024-050', client: 'Fornecedora Atlântico', amount: 3400.00, issueDate: '2024-02-20', dueDate: '2024-03-21', status: InvoiceStatus.Overdue },
    { id: 'inv-4', invoiceNumber: '2024-061', client: 'Universidade Federal do Rio', amount: 22000.00, issueDate: '2024-03-25', dueDate: '2024-04-24', status: InvoiceStatus.Pending },
];