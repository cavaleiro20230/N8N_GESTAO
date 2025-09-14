
import React, { useState } from 'react';
import { FemarLogo } from '../components/Icons';
import { MOCK_USERS } from '../constants';
import { User } from '../types';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Credenciais de teste hardcoded
    const testUser = MOCK_USERS.find(u => u.email === email);
    
    // Simulação simples de verificação de senha
    if (testUser && password === 'password123') {
        onLoginSuccess(testUser);
    } else {
        setError('Email ou senha inválidos. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
            <FemarLogo />
            <h1 className="text-3xl text-gray-800 dark:text-white font-bold mt-4">FEMAR Gestão Integrada</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Bem-vindo(a) de volta!</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
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
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Senha
                </label>
                <a href="#" className="text-sm text-blue-500 hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
            >
              Entrar
            </button>
          </form>
        </div>
        <p className="text-center text-gray-500 dark:text-gray-400 text-xs mt-6">
            © {new Date().getFullYear()} Fundação de Estudos do Mar. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default Login;
