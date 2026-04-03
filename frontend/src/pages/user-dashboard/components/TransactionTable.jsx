import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { formatCurrency } from '../../../utils/currencyFormatter';

const TransactionTable = ({ transactions, onViewDetails, onFlagTransaction }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const itemsPerPage = 10;

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredTransactions = transactions?.filter(transaction => 
    transaction?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    transaction?.location?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    transaction?.amount?.toString()?.includes(searchTerm)
  );

  const sortedTransactions = [...filteredTransactions]?.sort((a, b) => {
    if (sortConfig?.key === 'amount') {
      return sortConfig?.direction === 'asc' 
        ? a?.amount - b?.amount 
        : b?.amount - a?.amount;
    }
    if (sortConfig?.key === 'date') {
      return sortConfig?.direction === 'asc'
        ? new Date(a.created_at) - new Date(b.created_at)
        : new Date(b.created_at) - new Date(a.created_at);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedTransactions?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = sortedTransactions?.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status) => {
    return status === 'Safe' ?'bg-success/10 text-success border-success/20' :'bg-error/10 text-error border-error/20';
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm">
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">{t('recentTransactions')}</h2>
          <div className="w-full md:w-64">
            <Input
              type="search"
              placeholder={t('searchTransactions')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 md:px-6 py-3 text-left">
                <button 
                  onClick={() => handleSort('id')}
                  className="flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('transactionId')}
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 md:px-6 py-3 text-left">
                <button 
                  onClick={() => handleSort('amount')}
                  className="flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('amount')}
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 md:px-6 py-3 text-left">
                <button 
                  onClick={() => handleSort('date')}
                  className="flex items-center gap-2 text-xs md:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('date')}
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-muted-foreground">
                {t('location')}
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-muted-foreground">
                Type
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-muted-foreground">
                {t('status')}
              </th>
              <th className="px-4 md:px-6 py-3 text-right text-xs md:text-sm font-medium text-muted-foreground">
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions?.map((transaction) => (
              <tr key={transaction?.id} className="table-row">
                <td className="px-4 md:px-6 py-4">
                  <span className="text-xs md:text-sm font-medium text-foreground data-text">
                    {transaction?.id}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4">
                  <span className="text-xs md:text-sm font-semibold text-foreground data-text whitespace-nowrap">
                    {transaction?.transactionType === 'outgoing' && (
                      <span className="text-error mr-1">-</span>
                    )}
                    {transaction?.transactionType === 'incoming' && (
                      <span className="text-success mr-1">+</span>
                    )}
                    {formatCurrency(transaction?.amount, transaction?.currency || 'USD')}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4">
                  <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(transaction.created_at)?.toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4">
                  <span className="text-xs md:text-sm text-muted-foreground">
                    {transaction?.location}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4">
                  {transaction?.tx_type ? (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      transaction?.tx_type === 'debit' ?'bg-error/10 text-error border-error/20' :'bg-success/10 text-success border-success/20'
                    }`}>
                      {transaction?.tx_type === 'debit' ? '↑ Debit' : '↓ Credit'}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/50 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 md:px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2 md:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction?.status)}`}>
                    <Icon 
                      name={transaction?.status === 'Safe' ? 'CheckCircle2' : 'AlertCircle'} 
                      size={14} 
                    />
                    {t(transaction?.status?.toLowerCase())}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => onViewDetails(transaction)}
                      className="text-xs"
                    >
                      {t('view')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Flag"
                      onClick={() => onFlagTransaction(transaction?.id)}
                      className="text-xs"
                    >
                      {t('flag')}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 md:p-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs md:text-sm text-muted-foreground">
          {t('showing')} {startIndex + 1} {t('to')} {Math.min(startIndex + itemsPerPage, sortedTransactions?.length)} {t('of')} {sortedTransactions?.length} {t('transactions')}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronLeft"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            {t('previous')}
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="min-w-[2rem]"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronRight"
            iconPosition="right"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          >
            {t('next')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;