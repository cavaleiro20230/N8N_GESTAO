
import React, { useState } from 'react';
import { FemarLogo, BackArrowIcon } from '../components/Icons';

interface ForgotPasswordProps {
    onNavigateToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigateToLogin }) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Password reset requested for:', email);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <FemarLogo />
                    <h1 className="text-3xl text-gray-800 dark:text-white font-bold mt-4">Recuperar Senha</h1>
                </div>
                
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
                    {!submitted ? (
                        <>
                            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                                Digite seu e-mail e enviaremos um link para redefinir sua senha.
                            </p>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="seu.email@femar.org.br"
                                        required
                                    />
                                </div>
                                
                                <button
                                type="submit"
                                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
                                >
                                Enviar Link de Recuperação
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Verifique seu Email</h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-4">
                                Se uma conta com o email <strong>{email}</strong> existir, enviamos um link para redefinir sua senha.
                            </p>
                        </div>
                    )}
                    
                    <div className="mt-6 text-center">
                        <button onClick={onNavigateToLogin} className="text-sm text-blue-500 hover:underline flex items-center justify-center w-full">
                            <BackArrowIcon />
                            <span className="ml-2">Voltar para o Login</span>
                        </button>
                    </div>
                </div>
                <p className="text-center text-gray-500 dark:text-gray-400 text-xs mt-6">
                    © {new Date().getFullYear()} Fundação de Estudos do Mar. Todos os direitos reservados.
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
