export enum View {
  DASHBOARD = 'dashboard',
  PROJECTS = 'projects',
  ADMINISTRATIVE = 'administrative',
  FINANCE = 'finance',
  PERMISSIONS = 'permissions',
  PROFILE = 'profile',
  SECURITY = 'security',
}

export enum UserRole {
    NETWORK_ADMIN = 'Administrador de Rede',
    SUPERINTENDENT = 'Superintendente',
    MANAGER = 'Gerente',
    COLLABORATOR = 'Colaborador',
    AUDITOR = 'Auditor',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  forcePasswordChange?: boolean;
}

export type Permission = 
  | 'viewDashboard'
  | 'viewProjects'
  | 'editProjects'
  | 'createProjects'
  | 'deleteProjects'
  | 'viewAdministrative'
  | 'uploadDocuments'
  | 'manageContacts'
  | 'viewFinance'
  | 'createInvoices'
  | 'manageInvoices'
  | 'generateReports'
  | 'managePermissions'
  | 'viewSecurity'
  | 'manageAntiFraudSettings';

export interface RolePermissions {
    [key: string]: Permission[];
}

export enum ProjectStatus {
  OnTrack = 'On Track',
  AtRisk = 'At Risk',
  OffTrack = 'Off Track',
  Completed = 'Completed'
}

export enum TaskStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Done = 'Done'
}

export enum TaskPriority {
  High = 'Alta',
  Medium = 'Média',
  Low = 'Baixa',
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Attachment {
  id: string;
  fileName: string;
  url: string;
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  description: string;
  subTasks: SubTask[];
  attachments: Attachment[];
}

export interface Project {
  id: string;
  name: string;
  manager: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  budget: number;
  tasks: Task[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
}

export enum InvoiceStatus {
    Paid = 'Paid',
    Pending = 'Pending',
    Overdue = 'Overdue'
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    client: string;
    amount: number;
    issueDate: string;
    dueDate: string;
    status: InvoiceStatus;
}

export enum SecurityRiskLevel {
    Low = 'Baixo',
    Medium = 'Médio',
    High = 'Alto',
}

export interface AuthorizationInfo {
    authorizedBy: string;
    timestamp: string;
    justification: string;
}

export interface SecurityEvent {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    details: string;
    riskLevel: SecurityRiskLevel;
    authorizationInfo?: AuthorizationInfo;
}