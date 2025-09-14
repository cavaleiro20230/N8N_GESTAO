import React, { useState, useEffect } from 'react';
import { MOCK_PROJECTS, MOCK_USERS } from '../constants';
import { Project, ProjectStatus, Task, TaskStatus, TaskPriority, User } from '../types';
import { AttachmentIcon, CheckCircleIcon, CircleIcon, PlusIcon, EditIcon, DeleteIcon } from '../components/Icons';

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

const ProjectModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (project: Project) => void;
    projectToEdit: Project | null;
    users: User[];
}> = ({ isOpen, onClose, onSave, projectToEdit, users }) => {
    const emptyProject: Project = { id: '', name: '', manager: '', startDate: '', endDate: '', status: ProjectStatus.OnTrack, budget: 0, tasks: [] };
    const [formData, setFormData] = useState<Project>(projectToEdit || emptyProject);

    useEffect(() => {
        setFormData(projectToEdit ? { ...projectToEdit } : { ...emptyProject, id: `proj-${Date.now()}` });
    }, [projectToEdit, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'budget' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    
    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-lg shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                    {projectToEdit ? 'Editar Projeto' : 'Nova Proposta de Projeto'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Projeto</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                        </div>
                        <div>
                            <label htmlFor="manager" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gerente</label>
                            <select id="manager" name="manager" value={formData.manager} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                                <option value="" disabled>Selecione um gerente</option>
                                {users.map(user => <option key={user.id} value={user.name}>{user.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                            <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data de Início</label>
                            <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Final</label>
                            <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                        </div>
                        <div className="md:col-span-2">
                           <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Orçamento (BRL)</label>
                           <input type="number" id="budget" name="budget" value={formData.budget} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-8">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 transition duration-300">Cancelar</button>
                        <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const TaskRow: React.FC<{
  task: Task;
  isExpanded: boolean;
  onToggle: () => void;
  projectId: string;
  onToggleSubTask: (projectId: string, taskId: string, subTaskId: string) => void;
}> = ({ task, isExpanded, onToggle, projectId, onToggleSubTask }) => (
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
                        <div className="md:col-span-2">
                            <h5 className="font-semibold text-sm mb-1 text-gray-700 dark:text-gray-300">Descrição</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{task.description || 'Nenhuma descrição fornecida.'}</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h5 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">Sub-tarefas</h5>
                                {task.subTasks.length > 0 ? (
                                    <ul className="space-y-1">{task.subTasks.map(st => (
                                        <li 
                                            key={st.id} 
                                            className="flex items-center text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700/50 p-1 rounded"
                                            onClick={() => onToggleSubTask(projectId, task.id, st.id)}
                                        >
                                            {st.completed ? <CheckCircleIcon /> : <CircleIcon />}
                                            <span className={st.completed ? 'line-through' : ''}>{st.title}</span>
                                        </li>
                                    ))}</ul>
                                ) : <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma sub-tarefa.</p>}
                            </div>
                            <div>
                                <h5 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">Anexos</h5>
                                {task.attachments.length > 0 ? (
                                    <ul className="space-y-1">{task.attachments.map(att => (<li key={att.id}><a href={att.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm flex items-center"><AttachmentIcon /> {att.fileName}</a></li>))}</ul>
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
  onEdit: () => void;
  onDelete: () => void;
  onToggleSubTask: (projectId: string, taskId: string, subTaskId: string) => void;
}> = ({ project, isExpanded, onToggle, expandedTaskId, onToggleTask, onEdit, onDelete, onToggleSubTask }) => (
  <React.Fragment>
    <tr className="border-b border-gray-200 dark:border-gray-700">
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
          <div className="flex items-center justify-center space-x-2">
               <button onClick={onEdit} className="p-1 text-blue-500 hover:text-blue-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-200"><EditIcon className="w-5 h-5"/></button>
               <button onClick={onDelete} className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-200"><DeleteIcon className="w-5 h-5"/></button>
               <button onClick={onToggle} className="text-gray-600 dark:text-gray-300 hover:text-blue-500 font-medium flex items-center text-sm px-2 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-200">
                <span className="mr-1">{isExpanded ? 'Ocultar' : 'Detalhes'}</span>
                <svg className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
             </button>
          </div>
      </td>
    </tr>
    {isExpanded && (
       <tr className="bg-gray-50 dark:bg-gray-900">
           <td colSpan={6} className="p-0">
               {project.tasks.length > 0 ? (
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
                                projectId={project.id}
                                onToggleSubTask={onToggleSubTask}
                              />
                          ))}
                       </tbody>
                   </table>
                 </div>
               ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    Este projeto não possui tarefas.
                </div>
               )}
           </td>
       </tr>
    )}
  </React.Fragment>
);

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const handleToggleProjectRow = (projectId: string) => {
    setExpandedProjectId(prevId => (prevId === projectId ? null : projectId));
    setExpandedTaskId(null);
  };

  const handleToggleTaskRow = (taskId: string) => {
    setExpandedTaskId(prevId => (prevId === taskId ? null : taskId));
  };

  const handleOpenModal = (project: Project | null) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = (projectData: Project) => {
    if (projectToEdit) {
      setProjects(projects.map(p => (p.id === projectData.id ? projectData : p)));
    } else {
      setProjects([projectData, ...projects]);
    }
    setIsModalOpen(false);
    setProjectToEdit(null);
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.')) {
      setProjects(projects.filter(p => p.id !== projectId));
    }
  };

  const handleToggleSubTask = (projectId: string, taskId: string, subTaskId: string) => {
    setProjects(prevProjects =>
      prevProjects.map(p =>
        p.id === projectId
          ? {
              ...p,
              tasks: p.tasks.map(t =>
                t.id === taskId
                  ? {
                      ...t,
                      subTasks: t.subTasks.map(st =>
                        st.id === subTaskId ? { ...st, completed: !st.completed } : st
                      ),
                    }
                  : t
              ),
            }
          : p
      )
    );
  };

  return (
    <div>
      <ProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        projectToEdit={projectToEdit}
        users={MOCK_USERS}
      />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">Gerenciamento de Projetos</h2>
        <button 
            onClick={() => handleOpenModal(null)}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
        >
            <PlusIcon />
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
            {projects.map(project => (
              <ProjectRow
                key={project.id}
                project={project}
                isExpanded={expandedProjectId === project.id}
                onToggle={() => handleToggleProjectRow(project.id)}
                expandedTaskId={expandedTaskId}
                onToggleTask={handleToggleTaskRow}
                onEdit={() => handleOpenModal(project)}
                onDelete={() => handleDeleteProject(project.id)}
                onToggleSubTask={handleToggleSubTask}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Projects;
