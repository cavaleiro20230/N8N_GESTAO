export enum View {
  DASHBOARD = 'dashboard',
  PROJECTS = 'projects',
  ADMINISTRATIVE = 'administrative',
  FINANCE = 'finance',
  PERMISSIONS = 'permissions',
}

export enum UserRole {
    NETWORK_ADMIN = 'Administrador de Rede',
    SUPERINTENDENT = 'Superintendente',
    MANAGER = 'Gerente',
    COLLABORATOR = 'Colaborador',
    AUDITOR = 'Auditor',
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
  | 'managePermissions';

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

export interface Task {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: TaskStatus;
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