
import React, { useState } from 'react';
import { User } from '../types';
import { CameraIcon, SaveIcon } from '../components/Icons';

interface ProfileProps {
    user: User;
    onUpdateUser: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
    const [name, setName] = useState(user.name);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showSuccess, setShowSuccess] = useState<string | null>(null);

    const forceChange = user.forcePasswordChange;

    const handleInfoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateUser({ ...user, name });
        setShowSuccess('Informações salvas com sucesso!');
        setTimeout(() => setShowSuccess(null), 3000);
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('A nova senha e a confirmação não correspondem.');
            return;
        }
        if (newPassword.length < 8) {
            alert('A nova senha deve ter pelo menos 8 caracteres.');
            return;
        }
        console.log('Password change submitted');
        
        onUpdateUser({ ...user, forcePasswordChange: false });

        // Reset fields after submission
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowSuccess('Senha alterada com sucesso! Agora você pode navegar pelo sistema.');
        setTimeout(() => setShowSuccess(null), 3000);
    };

    return (
        <div>
            {forceChange && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8 rounded-md" role="alert">
                    <p className="font-bold">Ação Necessária</p>
                    <p>Por motivos de segurança, você deve alterar sua senha antes de continuar.</p>
                </div>
            )}

            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-8">Meu Perfil</h2>

            {showSuccess && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md" role="alert">
                    <p>{showSuccess}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            <img 
                                src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.email}`} 
                                alt={user.name} 
                                className="w-full h-full rounded-full object-cover ring-4 ring-blue-500"
                            />
                            <button className="absolute bottom-0 right-0 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 transition">
                                <CameraIcon className="w-5 h-5" />
                                <span className="sr-only">Alterar foto</span>
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{user.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                        <p className="mt-2 inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">{user.role}</p>
                    </div>
                </div>

                {/* Edit Forms */}
                <div className="md:col-span-2 space-y-8">
                    {/* Personal Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Informações Pessoais</h3>
                        <form onSubmit={handleInfoSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                    <input type="email" id="email" value={user.email} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-400" disabled />
                                </div>
                            </div>
                            <div className="flex justify-end mt-6">
                                <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center">
                                    <SaveIcon />
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Security */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Segurança</h3>
                         <form onSubmit={handlePasswordSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Senha Atual</label>
                                    <input type="password" id="currentPassword" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="••••••••" required />
                                </div>
                                <div />
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nova Senha</label>
                                    <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="••••••••" required />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmar Nova Senha</label>
                                    <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="••••••••" required />
                                </div>
                            </div>
                            <div className="flex justify-end mt-6">
                                <button type="submit" className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300">Alterar Senha</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;