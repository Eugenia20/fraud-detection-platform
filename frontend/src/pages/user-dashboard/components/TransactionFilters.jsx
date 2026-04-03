import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TransactionFilters = ({ onApplyFilters, onExportCSV }) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
    status: 'all'
  });

  const statusOptions = [
    { value: 'all', label: t('allTransactions') },
    { value: 'safe', label: t('safeOnly') }
  ];

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: '',
      status: 'all'
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg md:text-xl font-semibold text-foreground">{t('filterTransactions')}</h3>
        <Button
          variant="outline"
          size="sm"
          iconName="Download"
          onClick={onExportCSV}
        >
          {t('exportCSV')}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          type="date"
          label={t('fromDate')}
          value={filters?.dateFrom}
          onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
        />
        
        <Input
          type="date"
          label={t('toDate')}
          value={filters?.dateTo}
          onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
        />

        <Select
          label={t('status')}
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
        />

        <Input
          type="number"
          label={t('minAmount')}
          placeholder="0.00"
          value={filters?.minAmount}
          onChange={(e) => handleFilterChange('minAmount', e?.target?.value)}
        />

        <Input
          type="number"
          label={t('maxAmount')}
          placeholder="10000.00"
          value={filters?.maxAmount}
          onChange={(e) => handleFilterChange('maxAmount', e?.target?.value)}
        />

        <div className="flex items-end gap-2">
          <Button
            variant="default"
            fullWidth
            iconName="Filter"
            onClick={handleApply}
          >
            {t('applyFilters')}
          </Button>
          <Button
            variant="outline"
            iconName="RotateCcw"
            onClick={handleReset}
          >
            {t('reset')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;