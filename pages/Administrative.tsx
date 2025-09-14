import React, { useState } from 'react';
import { MOCK_DOCUMENTS, MOCK_CONTACTS } from '../constants';
import { Document, Contact } from '../types';
import { PlusIcon, EditIcon, DeleteIcon } from '../components/Icons';

const DocumentRow: React.FC<{ doc: Document }> = ({ doc }) => (
  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
    <td className="py-3 px-6 text-left">{doc.name}</td>
    <td className="py-3 px-6 text-left">{doc.type}</td>
    <td className="py-3 px-6 text-center">{doc.uploadDate}</td>
    <td className="py-3 px-6 text-right">{doc.size}</td>
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

const ContactModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (contact: Contact) => void;
    contactToEdit: Contact | null;
}> = ({ isOpen, onClose, onSave, contactToEdit }) => {
    const emptyContact: Contact = { id: '', name: '', email: '', role: '', organization: '' };
    const [formData, setFormData] = useState<Contact>(contactToEdit || emptyContact);

    React.useEffect(() => {
        setFormData(contactToEdit ? { ...contactToEdit } : { ...emptyContact, id: `con-${Date.now()}` });
    }, [contactToEdit, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-lg shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                    {contactToEdit ? 'Editar Contato' : 'Adicionar Contato'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Função</label>
                            <input type="text" id="role" name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ex: Gerente de Contas" required />
                        </div>
                        <div>
                            <label htmlFor="organization" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organização</label>
                            <input type="text" id="organization" name="organization" value={formData.organization} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
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

const Administrative: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

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

  const handleOpenModal = (contact: Contact | null) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleSaveContact = (contactData: Contact) => {
    if (editingContact) {
      setContacts(contacts.map(c => (c.id === contactData.id ? contactData : c)));
    } else {
      setContacts([contactData, ...contacts]);
    }
    setIsModalOpen(false);
    setEditingContact(null);
  };

  const handleDeleteContact = (contactId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      setContacts(contacts.filter(c => c.id !== contactId));
    }
  };

  return (
    <div>
      <ContactModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveContact}
        contactToEdit={editingContact}
      />
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Integração de Contatos</h3>
            <button
              onClick={() => handleOpenModal(null)}
              className="bg-blue-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center text-sm"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Adicionar Contato
            </button>
          </div>
           <p className="text-gray-600 dark:text-gray-400 mb-4">Gerencie os contatos de parceiros e fornecedores.</p>
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full table-auto">
                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal sticky top-0">
                    <tr>
                      <th className="py-3 px-6 text-left">Nome</th>
                      <th className="py-3 px-6 text-left">Email</th>
                      <th className="py-3 px-6 text-left">Organização</th>
                      <th className="py-3 px-6 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
                    {contacts.map(contact => (
                      <tr key={contact.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-3 px-6 text-left">
                          <div className="flex flex-col">
                            <span className="font-medium">{contact.name}</span>
                            <span className="text-xs text-gray-500">{contact.role}</span>
                          </div>
                        </td>
                        <td className="py-3 px-6 text-left">{contact.email}</td>
                        <td className="py-3 px-6 text-left">{contact.organization}</td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex item-center justify-center space-x-2">
                              <button onClick={() => handleOpenModal(contact)} className="p-1 text-blue-500 hover:text-blue-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-200"><EditIcon className="w-5 h-5"/></button>
                              <button onClick={() => handleDeleteContact(contact.id)} className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-200"><DeleteIcon className="w-5 h-5"/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Administrative;