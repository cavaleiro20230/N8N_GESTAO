import React, { useState, useRef } from 'react';
import { MOCK_INVOICES } from '../constants';
import { Invoice, InvoiceStatus, User, SecurityRiskLevel } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface FinanceProps {
    user: User;
    logSecurityEvent: (event: { user: string; action: string; details: string; riskLevel: SecurityRiskLevel }) => void;
}

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

const Finance: React.FC<FinanceProps> = ({ user, logSecurityEvent }) => {
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [showReportSuccess, setShowReportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ANOMALY_THRESHOLD = 20000;

  const handleGenerateReport = () => {
    logSecurityEvent({
        user: user.email,
        action: 'Geração de Relatório',
        details: 'Relatório financeiro geral foi gerado e baixado.',
        riskLevel: SecurityRiskLevel.Medium,
    });

    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Relatório Financeiro - FEMAR Gestão', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Gerado por: ${user.name} em: ${new Date().toLocaleString('pt-BR')}`, 14, 30);

    const tableColumn = ["Fatura Nº", "Cliente", "Valor", "Vencimento", "Status"];
    const tableRows: string[][] = [];

    invoices.forEach(invoice => {
        const invoiceData = [
            invoice.invoiceNumber,
            invoice.client,
            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice.amount),
            new Date(invoice.dueDate).toLocaleDateString('pt-BR'),
            invoice.status,
        ];
        tableRows.push(invoiceData);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] }, // Blue color for header
    });
    
    const pageCount = (doc as any).internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10);
    }

    doc.save('relatorio_financeiro_femar.pdf');

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
    const randomAmount = Math.random() * (ANOMALY_THRESHOLD + 5000) + 1000;
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

    const riskLevel = newInvoice.amount > ANOMALY_THRESHOLD ? SecurityRiskLevel.High : SecurityRiskLevel.Low;
    logSecurityEvent({
        user: user.email,
        action: 'Carregamento de Fatura',
        details: `Fatura ${newInvoice.invoiceNumber} para ${newInvoice.client} no valor de R$ ${newInvoice.amount.toFixed(2)}.`,
        riskLevel: riskLevel,
    });


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
            <p>Relatório gerado e baixado com sucesso!</p>
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