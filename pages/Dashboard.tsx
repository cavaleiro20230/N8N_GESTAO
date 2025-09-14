
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MOCK_PROJECTS, MOCK_INVOICES } from '../constants';
import { ProjectStatus, InvoiceStatus } from '../types';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: JSX.Element;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
    <div className="bg-blue-500 rounded-full p-3 mr-4 text-white">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const activeProjects = MOCK_PROJECTS.filter(p => p.status !== ProjectStatus.Completed).length;
  const pendingInvoices = MOCK_INVOICES.filter(i => i.status === InvoiceStatus.Pending).length;
  const overdueInvoices = MOCK_INVOICES.filter(i => i.status === InvoiceStatus.Overdue).length;
  
  const totalBudget = MOCK_PROJECTS.reduce((sum, p) => sum + p.budget, 0);

  const chartData = [
    { name: 'On Track', value: MOCK_PROJECTS.filter(p => p.status === ProjectStatus.OnTrack).length, fill: '#34D399' },
    { name: 'At Risk', value: MOCK_PROJECTS.filter(p => p.status === ProjectStatus.AtRisk).length, fill: '#FBBF24' },
    { name: 'Off Track', value: MOCK_PROJECTS.filter(p => p.status === ProjectStatus.OffTrack).length, fill: '#F87171' },
    { name: 'Completed', value: MOCK_PROJECTS.filter(p => p.status === ProjectStatus.Completed).length, fill: '#60A5FA' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="Projetos Ativos" value={activeProjects} description="Projetos em andamento" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>} />
        <StatCard title="Faturas Pendentes" value={pendingInvoices} description={`${overdueInvoices} vencidas`} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1m0-1H9.5a2.5 2.5 0 00-2.5 2.5v11.5a2.5 2.5 0 002.5 2.5h5A2.5 2.5 0 0017 18.5V14.5m-5-9.5v-1a2.5 2.5 0 00-2.5-2.5H8.5a2.5 2.5 0 00-2.5 2.5v7.5"></path></svg>} />
        <StatCard title="Orçamento Total" value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalBudget)} description="Em todos os projetos" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>} />
        <StatCard title="Tarefas Concluídas" value="12" description="Nesta semana" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} />
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Status dos Projetos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} />
            <YAxis tick={{ fill: '#9CA3AF' }} />
            <Tooltip
                contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderColor: '#374151',
                    color: '#E5E7EB'
                }}
                cursor={{fill: 'rgba(107, 114, 128, 0.1)'}}
            />
            <Legend wrapperStyle={{ color: '#E5E7EB' }} />
            <Bar dataKey="value" name="Projetos" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
