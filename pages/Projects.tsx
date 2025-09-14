import React, { useState } from 'react';
import { MOCK_PROJECTS } from '../constants';
import { Project, ProjectStatus, Task, TaskStatus, TaskPriority } from '../types';
import { AttachmentIcon, CheckCircleIcon, CircleIcon } from '../components/Icons';

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

const getPriorityClass = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.High:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case TaskPriority.Medium:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case TaskPriority.Low:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
};

const getTaskStatusClass = (status: TaskStatus) => {
    switch (status) {
        case TaskStatus.Done:
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case TaskStatus.InProgress:
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case TaskStatus.ToDo:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
};

const TaskRow: React.FC<{
  task: Task;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ task, isExpanded, onToggle }) => (
    <React.Fragment>
        <tr className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/60 cursor-pointer" onClick={onToggle}>
            <td className="py-2 px-6 text-left pl-12">{task.title}</td>
            <td className="py-2 px-6 text-left">{task.assignee}</td>
            <td className="py-2 px-6 text-center">
                <span className={`py-1 px-3 rounded-full text-xs font-medium ${getPriorityClass(task.priority)}`}>
                    {task.priority}
                </span>
            </td>
            <td className="py-2 px-6 text-center">
                <span className={`py-1 px-3 rounded-full text-xs font-medium ${getTaskStatusClass(task.status)}`}>
                    {task.status}
                </span>
            </td>
            <td className="py-2 px-6 text-center">{new Date(task.dueDate).toLocaleDateString('pt-BR')}</td>
            <td className="py-2 px-6 text-center">
                <button className="text-blue-500 hover:text-blue-700 text-xs flex items-center justify-center w-full">
                    <svg className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
            </td>
        </tr>
        {isExpanded && (
            <tr className="bg-gray-100 dark:bg-gray-800">
                <td colSpan={6} className="p-4 pl-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Description */}
                        <div className="md:col-span-2">
                            <h5 className="font-semibold text-sm mb-1 text-gray-700 dark:text-gray-300">Descrição</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{task.description || 'Nenhuma descrição fornecida.'}</p>
                        </div>
                        <div className="space-y-4">
                            {/* Sub-tasks */}
                            <div>
                                <h5 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">Sub-tarefas</h5>
                                {task.subTasks.length > 0 ? (
                                    <ul className="space-y-1">
                                        {task.subTasks.map(st => (
                                            <li key={st.id} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                {st.completed ? <CheckCircleIcon /> : <CircleIcon />}
                                                <span className={st.completed ? 'line-through' : ''}>{st.title}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma sub-tarefa.</p>}
                            </div>
                            {/* Attachments */}
                            <div>
                                <h5 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">Anexos</h5>
                                {task.attachments.length > 0 ? (
                                    <ul className="space-y-1">
                                        {task.attachments.map(att => (
                                            <li key={att.id}>
                                                <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm flex items-center">
                                                    <AttachmentIcon /> {att.fileName}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum anexo.</p>}
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        )}
    </React.Fragment>
)

const ProjectRow: React.FC<{
  project: Project;
  isExpanded: boolean;
  onToggle: () => void;
  expandedTaskId: string | null;
  onToggleTask: (taskId: string) => void;
}> = ({ project, isExpanded, onToggle, expandedTaskId, onToggleTask }) => (
  <React.Fragment>
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" onClick={onToggle}>
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
          <button className="text-blue-500 hover:text-blue-700 font-medium flex items-center justify-center w-full">
            <span>{isExpanded ? 'Ocultar' : 'Detalhes'}</span>
            <svg className={`w-4 h-4 ml-2 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
      </td>
    </tr>
    {isExpanded && project.tasks.length > 0 && (
       <tr className="bg-gray-50 dark:bg-gray-900">
           <td colSpan={6} className="p-0">
               <div className="p-4">
                 <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-4">Tarefas do Projeto</h4>
                 <table className="min-w-full">
                     <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs uppercase">
                         <tr>
                             <th className="py-2 px-6 text-left pl-12">Título</th>
                             <th className="py-2 px-6 text-left">Responsável</th>
                             <th className="py-2 px-6 text-center">Prioridade</th>
                             <th className="py-2 px-6 text-center">Status</th>
                             <th className="py-2 px-6 text-center">Prazo</th>
                             <th className="py-2 px-6 text-center">Detalhes</th>
                         </tr>
                     </thead>
                     <tbody>
                         {project.tasks.map(task => (
                            <TaskRow 
                                key={task.id} 
                                task={task} 
                                isExpanded={expandedTaskId === task.id}
                                onToggle={() => onToggleTask(task.id)}
                            />
                        ))}
                     </tbody>
                 </table>
               </div>
           </td>
       </tr>
    )}
    {isExpanded && project.tasks.length === 0 && (
        <tr className="bg-gray-50 dark:bg-gray-900">
            <td colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-400">
                Este projeto não possui tarefas.
            </td>
        </tr>
    )}
  </React.Fragment>
);

const Projects: React.FC = () => {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const handleToggleProjectRow = (projectId: string) => {
    setExpandedProjectId(prevId => (prevId === projectId ? null : projectId));
    setExpandedTaskId(null); // Collapse tasks when project is collapsed
  };

  const handleToggleTaskRow = (taskId: string) => {
    setExpandedTaskId(prevId => (prevId === taskId ? null : taskId));
  };


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
              <ProjectRow
                key={project.id}
                project={project}
                isExpanded={expandedProjectId === project.id}
                onToggle={() => handleToggleProjectRow(project.id)}
                expandedTaskId={expandedTaskId}
                onToggleTask={handleToggleTaskRow}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Projects;