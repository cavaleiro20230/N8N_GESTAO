import React, { useState, useRef } from 'react';
import { MOCK_INVOICES } from '../constants';
import { Invoice, InvoiceStatus } from '../types';

const getStatusClass = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.Paid:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case InvoiceStatus.Pending:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case InvoiceStatus.Overdue:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

const InvoiceRow: React.FC<{ invoice: Invoice }> = ({ invoice }) => (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="py-3 px-6 text-left">{invoice.invoiceNumber}</td>
      <td className="py-3 px-6 text-left">{invoice.client}</td>
      <td className="py-3 px-6 text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice.amount)}</td>
      <td className="py-3 px-6 text-center">{new Date(invoice.dueDate).toLocaleDateString('pt-BR')}</td>
      <td className="py-3 px-6 text-center">
        <span className={`py-1 px-3 rounded-full text-xs ${getStatusClass(invoice.status)}`}>
          {invoice.status}
        </span>
      </td>
    </tr>
  );

const Finance: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [showReportSuccess, setShowReportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateReport = () => {
    console.log("Gerando relatório financeiro...");
    setShowReportSuccess(true);
    setTimeout(() => {
      setShowReportSuccess(false);
    }, 3000);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleInvoiceUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simula extração de dados via IA a partir do nome do arquivo
    const clientName = file.name.split('.')[0].replace(/_/g, ' ').replace(/fatura/i, '').trim() || 'Cliente Desconhecido';
    const randomAmount = Math.random() * 5000 + 1000;
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(issueDate.getDate() + 30);

    const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: `2024-${Math.floor(Math.random() * 900) + 100}`,
        client: clientName,
        amount: randomAmount,
        issueDate: issueDate.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        status: InvoiceStatus.Pending,
    };

    setInvoices(prevInvoices => [newInvoice, ...prevInvoices]);
    
    if (event.target) {
        event.target.value = '';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">Gerenciamento Financeiro</h2>
        <div className="space-x-2">
            <button 
                onClick={handleGenerateReport}
                className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
            >
                Gerar Relatório
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleInvoiceUpload}
                className="hidden" 
                accept=".pdf,.xml,.jpg,.png"
            />
             <button 
                onClick={handleUploadClick}
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
                Carregar Fatura
            </button>
        </div>
      </div>
      
      {showReportSuccess && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md" role="alert">
            <p>Relatório gerado com sucesso!</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <h3 className="text-xl font-semibold p-6 text-gray-800 dark:text-white">Automação de Faturas</h3>
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Fatura Nº</th>
              <th className="py-3 px-6 text-left">Cliente</th>
              <th className="py-3 px-6 text-right">Valor</th>
              <th className="py-3 px-6 text-center">Vencimento</th>
              <th className="py-3 px-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
            {invoices.map(invoice => (
              <InvoiceRow key={invoice.id} invoice={invoice} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Finance;