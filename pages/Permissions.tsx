import React, { useState, useMemo } from 'react';
import { MOCK_ROLE_PERMISSIONS, ALL_PERMISSIONS, MOCK_USERS } from '../constants';
import { UserRole, Permission, RolePermissions, User } from '../types';
import { PlusIcon, EditIcon, DeleteIcon } from '../components/Icons';

const UserModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: User) => void;
    userToEdit: User | null;
}> = ({ isOpen, onClose, onSave, userToEdit }) => {
    const [name, setName] = useState(userToEdit?.name || '');
    const [email, setEmail] = useState(userToEdit?.email || '');
    const [role, setRole] = useState(userToEdit?.role || UserRole.COLLABORATOR);

    React.useEffect(() => {
        if (userToEdit) {
            setName(userToEdit.name);
            setEmail(userToEdit.email);
            // FIX: Corrected typo `userToedit` to `userToEdit`.
            setRole(userToEdit.role);
        } else {
            setName('');
            setEmail('');
            setRole(UserRole.COLLABORATOR);
        }
    }, [userToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: userToEdit?.id || `user-${Date.now()}`,
            name,
            email,
            role,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                    {userToEdit ? 'Editar Usuário' : 'Adicionar Usuário'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Perfil</label>
                        <select id="role" value={role} onChange={e => setRole(e.target.value as UserRole)} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">Cancelar</button>
                        <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Permissions: React.FC = () => {
  const [permissions, setPermissions] = useState<RolePermissions>(MOCK_ROLE_PERMISSIONS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // User Management Handlers
  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };
  
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    if(window.confirm("Tem certeza que deseja excluir este usuário?")) {
        setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleSaveUser = (user: User) => {
    if (editingUser) {
        setUsers(users.map(u => u.id === user.id ? user : u));
    } else {
        setUsers([...users, user]);
    }
  };
  
  // Permissions Handlers
  const handleCheckboxChange = (role: UserRole, permissionId: Permission) => {
    setPermissions(prev => {
      const currentPermissions = prev[role] || [];
      const newPermissions = currentPermissions.includes(permissionId)
        ? currentPermissions.filter(p => p !== permissionId)
        : [...currentPermissions, permissionId];
      return { ...prev, [role]: newPermissions };
    });
  };
  
  const handleSavePermissions = () => {
      console.log("Saving permissions:", permissions);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
  };

  const groupedPermissions = useMemo(() => {
    return ALL_PERMISSIONS.reduce((acc, permission) => {
      (acc[permission.area] = acc[permission.area] || []).push(permission);
      return acc;
    }, {} as { [key: string]: typeof ALL_PERMISSIONS });
  }, []);

  const roles = Object.values(UserRole);

  return (
    <div>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-8">Administração Central</h2>
        
        {/* User Management Section */}
        <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Gerenciamento de Usuários</h3>
                <button 
                    onClick={handleAddUser}
                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
                >
                    <PlusIcon />
                    Adicionar Usuário
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="py-3 px-6 text-left text-gray-600 dark:text-gray-300 font-semibold uppercase">Nome</th>
                            <th className="py-3 px-6 text-left text-gray-600 dark:text-gray-300 font-semibold uppercase">Email</th>
                            <th className="py-3 px-6 text-left text-gray-600 dark:text-gray-300 font-semibold uppercase">Perfil</th>
                            <th className="py-3 px-6 text-center text-gray-600 dark:text-gray-300 font-semibold uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 dark:text-gray-200">
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="py-3 px-6">{user.name}</td>
                                <td className="py-3 px-6">{user.email}</td>
                                <td className="py-3 px-6">{user.role}</td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center space-x-4">
                                        <button onClick={() => handleEditUser(user)} className="text-blue-500 hover:text-blue-700"><EditIcon /></button>
                                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700"><DeleteIcon /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveUser} userToEdit={editingUser} />
        
        {/* Permissions Matrix Section */}
        <div>
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Gerenciamento de Permissões por Perfil</h3>
                <button 
                    onClick={handleSavePermissions}
                    className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Salvar Permissões
                </button>
            </div>
            {showSuccess && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md" role="alert">
                    <p>Permissões salvas com sucesso!</p>
                </div>
            )}
            <p className="text-gray-600 dark:text-gray-400 mb-6">Defina o que cada perfil de usuário pode acessar e fazer no sistema.</p>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full table-fixed">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="py-4 px-6 text-left text-gray-600 dark:text-gray-300 font-semibold uppercase w-1/3">Permissão</th>
                            {roles.map(role => (
                                <th key={role} className="py-4 px-6 text-center text-gray-600 dark:text-gray-300 font-semibold uppercase">{role}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 dark:text-gray-200">
                        {Object.entries(groupedPermissions).map(([area, areaPermissions]) => (
                            <React.Fragment key={area}>
                                <tr>
                                    <td colSpan={roles.length + 1} className="py-3 px-4 bg-gray-100 dark:bg-gray-700/50">
                                        <h3 className="font-bold text-md text-gray-700 dark:text-gray-200">{area}</h3>
                                    </td>
                                </tr>
                                {areaPermissions.map((permission, index) => (
                                    <tr key={permission.id} className={`border-b border-gray-200 dark:border-gray-700 ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'} hover:bg-blue-50 dark:hover:bg-gray-700`}>
                                        <td className="py-3 px-6 text-left whitespace-nowrap">{permission.label}</td>
                                        {roles.map(role => (
                                            <td key={`${role}-${permission.id}`} className="py-3 px-6 text-center">
                                                <input
                                                    type="checkbox"
                                                    className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-offset-gray-800"
                                                    checked={permissions[role]?.includes(permission.id) || false}
                                                    onChange={() => handleCheckboxChange(role, permission.id)}
                                                    aria-label={`Permissão ${permission.label} para ${role}`}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default Permissions;