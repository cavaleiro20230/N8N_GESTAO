
import React, { useState, useMemo } from 'react';
import { MOCK_ROLE_PERMISSIONS, ALL_PERMISSIONS } from '../constants';
import { UserRole, Permission, RolePermissions } from '../types';

const Permissions: React.FC = () => {
  const [permissions, setPermissions] = useState<RolePermissions>(MOCK_ROLE_PERMISSIONS);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCheckboxChange = (role: UserRole, permissionId: Permission) => {
    setPermissions(prev => {
      const currentPermissions = prev[role] || [];
      const newPermissions = currentPermissions.includes(permissionId)
        ? currentPermissions.filter(p => p !== permissionId)
        : [...currentPermissions, permissionId];
      return { ...prev, [role]: newPermissions };
    });
  };
  
  const handleSave = () => {
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
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">Gerenciamento de Permissões</h2>
            <button 
                onClick={handleSave}
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Salvar Alterações
            </button>
        </div>
        {showSuccess && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md" role="alert">
                <p>Permissões salvas com sucesso!</p>
            </div>
        )}
        <p className="text-gray-600 dark:text-gray-400 mb-8">Defina o que cada perfil de usuário pode acessar e fazer no sistema.</p>
        
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
  );
};

export default Permissions;
