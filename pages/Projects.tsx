
import React from 'react';
import { MOCK_PROJECTS } from '../constants';
import { Project, ProjectStatus } from '../types';

const getStatusClass = (status: ProjectStatus) => {
  switch (status) {
    case ProjectStatus.OnTrack:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case ProjectStatus.AtRisk:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case ProjectStatus.OffTrack:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case ProjectStatus.Completed:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const ProjectRow: React.FC<{ project: Project }> = ({ project }) => (
  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
    <td className="py-3 px-6 text-left">{project.name}</td>
    <td className="py-3 px-6 text-left">{project.manager}</td>
    <td className="py-3 px-6 text-center">
      <span className={`py-1 px-3 rounded-full text-xs ${getStatusClass(project.status)}`}>
        {project.status}
      </span>
    </td>
    <td className="py-3 px-6 text-center">{new Date(project.endDate).toLocaleDateString('pt-BR')}</td>
    <td className="py-3 px-6 text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(project.budget)}</td>
    <td className="py-3 px-6 text-center">
        <button className="text-blue-500 hover:text-blue-700 font-medium">Detalhes</button>
    </td>
  </tr>
);

const Projects: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">Gerenciamento de Projetos</h2>
        <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Nova Proposta
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Nome do Projeto</th>
              <th className="py-3 px-6 text-left">Gerente</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Prazo Final</th>
              <th className="py-3 px-6 text-right">Orçamento</th>
              <th className="py-3 px-6 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
            {MOCK_PROJECTS.map(project => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Projects;
