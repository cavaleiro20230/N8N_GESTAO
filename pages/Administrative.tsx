import React, { useState } from 'react';
import { MOCK_DOCUMENTS, MOCK_CONTACTS } from '../constants';
import { Document, Contact } from '../types';

const DocumentRow: React.FC<{ doc: Document }> = ({ doc }) => (
  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
    <td className="py-3 px-6 text-left">{doc.name}</td>
    <td className="py-3 px-6 text-left">{doc.type}</td>
    <td className="py-3 px-6 text-center">{doc.uploadDate}</td>
    <td className="py-3 px-6 text-right">{doc.size}</td>
  </tr>
);

const ContactRow: React.FC<{ contact: Contact }> = ({ contact }) => (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="py-3 px-6 text-left">{contact.name}</td>
      <td className="py-3 px-6 text-left">{contact.email}</td>
      <td className="py-3 px-6 text-left">{contact.role}</td>
      <td className="py-3 px-6 text-left">{contact.organization}</td>
    </tr>
);

const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const getDocumentTypeFromFileName = (fileName: string): string => {
    const lowerCaseName = fileName.toLowerCase();
    if (lowerCaseName.includes('contrato')) return 'Contrato';
    if (lowerCaseName.includes('recibo') || lowerCaseName.includes('fatura')) return 'Recibo';
    if (lowerCaseName.includes('proposta')) return 'Proposta';
    if (lowerCaseName.includes('relatorio') || lowerCaseName.includes('report')) return 'Relatório';
    return 'Outro';
};


const Administrative: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newDocuments: Document[] = Array.from(files).map((file, index) => ({
      id: `doc-${Date.now()}-${index}`,
      name: file.name,
      type: getDocumentTypeFromFileName(file.name),
      uploadDate: new Date().toLocaleDateString('pt-BR'),
      size: formatBytes(file.size),
    }));

    setDocuments(prevDocuments => [...newDocuments, ...prevDocuments]);
    
    event.target.value = '';
  };


  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">Gerenciamento Administrativo</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Processamento de Documentos */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Processamento de Documentos</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Carregue documentos (contratos, recibos, etc.) para extração de dados via IA.</p>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <input type="file" className="hidden" id="file-upload" multiple onChange={handleFileUpload} aria-label="Carregar documentos"/>
            <label htmlFor="file-upload" className="cursor-pointer text-blue-500 hover:text-blue-700 font-medium">
              Clique para carregar arquivos
            </label>
            <p className="text-xs text-gray-500 mt-1">PDF, DOCX, PNG, JPG</p>
          </div>
          <div className="mt-4 max-h-64 overflow-y-auto">
            <table className="min-w-full table-auto">
                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal sticky top-0">
                    <tr>
                    <th className="py-3 px-6 text-left">Nome</th>
                    <th className="py-3 px-6 text-left">Tipo</th>
                    <th className="py-3 px-6 text-center">Data</th>
                    <th className="py-3 px-6 text-right">Tamanho</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
                    {documents.map(doc => <DocumentRow key={doc.id} doc={doc} />)}
                </tbody>
            </table>
          </div>
        </div>

        {/* Integração de Contatos */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Integração de Contatos</h3>
           <p className="text-gray-600 dark:text-gray-400 mb-4">Contatos sincronizados automaticamente.</p>
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full table-auto">
                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal sticky top-0">
                    <tr>
                    <th className="py-3 px-6 text-left">Nome</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-left">Função</th>
                    <th className="py-3 px-6 text-left">Organização</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
                    {MOCK_CONTACTS.map(contact => <ContactRow key={contact.id} contact={contact} />)}
                </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Administrative;