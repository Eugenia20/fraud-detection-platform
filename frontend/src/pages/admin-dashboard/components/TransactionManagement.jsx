import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../utils/apiClient';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import AdminTransactionDetailModal from './AdminTransactionDetailModal';

const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10 / page' },
  { value: '25', label: '25 / page' },
  { value: '50', label: '50 / page' },
];

const fraudOptions = [
  { value: 'all', label: 'All Transactions' },
  { value: 'true', label: 'Fraud Only' },
  { value: 'false', label: 'Safe Only' },
];

const SORT_FIELDS = {
  amount: 'amount',
  fraud_risk: 'fraud_risk',
  transaction_date: 'transaction_date',
};

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [fraudOnly, setFraudOnly] = useState('all');
  const [minRisk, setMinRisk] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [country, setCountry] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');

  // Sorting
  const [sortField, setSortField] = useState('');
  const [sortDir, setSortDir] = useState('asc');

  // Detail modal
  const [selectedTx, setSelectedTx] = useState(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (fraudOnly !== '' && fraudOnly !== 'all') params.fraud_only = fraudOnly;
      if (minRisk !== '') params.min_risk = parseInt(minRisk, 10);
      if (minAmount !== '') params.min_amount = parseFloat(minAmount);
      if (maxAmount !== '') params.max_amount = parseFloat(maxAmount);
      if (country?.trim()) params.country = country?.trim();
      params.page = page;
      params.page_size = parseInt(pageSize, 10);
      if (sortField) {
        params.sort_by = sortField;
        params.sort_dir = sortDir;
      }

      const response = await apiClient?.get('/admin/transactions', { params });
      setTransactions(response?.data?.data || []);
    } catch (err) {
      setError('Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  }, [fraudOnly, minRisk, minAmount, maxAmount, country, page, pageSize, sortField, sortDir]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Reset to page 1 when filters change
  const handleFilterChange = (setter) => (val) => {
    setter(val);
    setPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(1);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <Icon name="ChevronsUpDown" size={12} color="var(--color-muted-foreground)" />;
    return sortDir === 'asc'
      ? <Icon name="ChevronUp" size={12} color="var(--color-accent)" />
      : <Icon name="ChevronDown" size={12} color="var(--color-accent)" />;
  };

  const fraudCount = transactions?.filter(tx => tx?.is_fraud)?.length ?? 0;
  const safeCount = transactions?.filter(tx => !tx?.is_fraud)?.length ?? 0;

  const handleStatusUpdate = (updatedTx) => {
    setTransactions((prev) =>
      prev?.map((tx) => (tx?.id === updatedTx?.id ? updatedTx : tx))
    );
    setSelectedTx(updatedTx);
  };
  console.log(transactions);
  return (
    <>
      <div className="bg-card border border-border rounded-xl shadow-sm">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Icon name="Activity" size={20} color="var(--color-accent)" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Transaction Management</h2>
                <p className="text-sm text-muted-foreground">Filter, sort, and manage all transactions</p>
              </div>
            </div>
            <Button variant="outline" size="sm" iconName="RefreshCw" onClick={fetchTransactions}>
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 md:p-6 border-b border-border bg-muted/20">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Filters</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Fraud Status</label>
              <Select
                options={fraudOptions}
                value={fraudOnly}
                onChange={handleFilterChange(setFraudOnly)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Min Risk Score (0–100)</label>
              <Input
                type="number"
                placeholder="e.g. 50"
                value={minRisk}
                onChange={(e) => handleFilterChange(setMinRisk)(e?.target?.value)}
                min={0}
                max={100}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Country Code</label>
              <Input
                type="text"
                placeholder="e.g. US, NG, GB"
                value={country}
                onChange={(e) => handleFilterChange(setCountry)(e?.target?.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Min Amount</label>
              <Input
                type="number"
                placeholder="e.g. 100"
                value={minAmount}
                onChange={(e) => handleFilterChange(setMinAmount)(e?.target?.value)}
                min={0}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Max Amount</label>
              <Input
                type="number"
                placeholder="e.g. 10000"
                value={maxAmount}
                onChange={(e) => handleFilterChange(setMaxAmount)(e?.target?.value)}
                min={0}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Page Size</label>
              <Select
                options={PAGE_SIZE_OPTIONS}
                value={pageSize}
                onChange={(val) => { setPageSize(val); setPage(1); }}
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="p-4 md:p-6 border-b border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Loaded</p>
                <Icon name="List" size={16} color="var(--color-primary)" />
              </div>
              <p className="text-2xl font-bold text-foreground">{transactions?.length ?? 0}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Fraud Cases</p>
                <Icon name="AlertTriangle" size={16} color="var(--color-error)" />
              </div>
              <p className="text-2xl font-bold text-error">{fraudCount}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Safe Transactions</p>
                <Icon name="CheckCircle2" size={16} color="var(--color-success)" />
              </div>
              <p className="text-2xl font-bold text-success">{safeCount}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading transactions...</div>
          ) : error ? (
            <div className="p-8 text-center text-destructive">
              {error}
              <Button variant="outline" size="sm" onClick={fetchTransactions}>
                Retry
              </Button>
            </div>
          ) : transactions?.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No transactions found.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">ID</th>
                   <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">User</th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-muted-foreground cursor-pointer select-none"
                    onClick={() => handleSort(SORT_FIELDS?.amount)}
                  >
                    <span className="flex items-center gap-1">Amount <SortIcon field={SORT_FIELDS?.amount} /></span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Currency</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Country</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Type</th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-muted-foreground cursor-pointer select-none"
                    onClick={() => handleSort(SORT_FIELDS?.fraud_risk)}
                  >
                    <span className="flex items-center gap-1">Risk Score <SortIcon field={SORT_FIELDS?.fraud_risk} /></span>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-muted-foreground cursor-pointer select-none"
                    onClick={() => handleSort(SORT_FIELDS?.transaction_date)}
                  >
                    <span className="flex items-center gap-1">Date <SortIcon field={SORT_FIELDS?.transaction_date} /></span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Review</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground min-w-[180px]">Reasons</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Merchant Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Device</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Payment Channel</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions?.map((tx) => (
                  <tr key={tx?.id} className="table-row">
                    <td className="px-4 py-3 text-xs text-muted-foreground data-text">#{tx?.id}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground data-text">{tx?.full_name}</td>

                    <td className="px-4 py-3 text-xs text-foreground font-medium">
                      {tx?.amount?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{tx?.currency || '—'}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{tx?.country || '—'}</td>
                    <td className="px-4 py-3">
                     {tx?.tx_type ? (
                     <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                     tx?.tx_type?.toLowerCase() === 'debit'
                      ? 'bg-error/10 text-error border-error/20'
                        : 'bg-success/10 text-success border-success/20'
                     }`}>
                       {tx?.tx_type?.toLowerCase() === 'debit' ? '↑ Debit' : '↓ Credit'}
                     </span>
                     ) : (
                    <span className="text-muted-foreground/50 text-xs">—</span>
                    )}
                 </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${
                        (tx?.fraud_risk ?? 0) >= 70 ? 'text-error' :
                        (tx?.fraud_risk ?? 0) >= 40 ? 'text-warning' : 'text-success'
                      }`}>
                        {tx?.fraud_risk ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {tx?.created_at ? new Date(tx.created_at)?.toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                        tx?.is_fraud
                          ? 'bg-error/10 text-error border-error/20' :'bg-success/10 text-success border-success/20'
                      }`}>
                        {tx?.is_fraud ? 'Fraud' : 'Safe'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                        tx?.review_status === 'resolved' ?'bg-success/10 text-success border-success/20'
                          : tx?.review_status === 'reviewed' ?'bg-accent/10 text-accent border-accent/20' :'bg-muted/30 text-muted-foreground border-border'
                      }`}>
                        {tx?.review_status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-[220px]">
                      {tx?.fraud_reason ? (
                     <span className="block leading-relaxed">{tx?.fraud_reason}</span>
                     ) : (
                    <span className="text-muted-foreground/50">—</span>
                     )}
                   </td>
                   <td className="px-4 py-3 text-xs text-muted-foreground data-text">{tx?.merchant_category}</td>
                   <td className="px-4 py-3 text-xs text-muted-foreground data-text">{tx?.device_used}</td>
                   <td className="px-4 py-3 text-xs text-muted-foreground data-text">{tx?.payment_channel}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setSelectedTx(tx)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                      >
                        <Icon name="Eye" size={12} color="var(--color-accent)" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && (
          <div className="p-4 md:p-6 border-t border-border flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              Page <span className="font-semibold text-foreground">{page}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                iconName="ChevronLeft"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="ChevronRight"
                onClick={() => setPage((p) => p + 1)}
                disabled={transactions?.length < parseInt(pageSize, 10)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Detail Modal */}
      {selectedTx && (
        <AdminTransactionDetailModal
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </>
  );
};

export default TransactionManagement;