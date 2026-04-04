import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { getCurrencyOptions } from '../../../utils/currencyFormatter';
import Icon from '../../../components/AppIcon';

const TransactionForm = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'EUR',
    country: '',
    transactionType: 'incoming',

    merchant_category: 'online',
    device_used: 'mobile',
    payment_channel: 'card'
  });

  const countryOptions = [
    { value: 'USA', label: t('unitedStates') },
    { value: 'UK', label: t('unitedKingdom') },
    { value: 'FR', label: t('france') },
    { value: 'DE', label: t('germany') },
    { value: 'CN', label: t('china') },
    { value: 'RUS', label: t('russia') },
    { value: 'IN', label: t('india') },
    { value: 'BR', label: t('brazil') },
    { value: 'CA', label: t('canada') },
    { value: 'AU', label: t('australia') }
  ];

  const transactionTypeOptions = [
    { value: 'incoming', label: t('incomingDeposit') },
    { value: 'outgoing', label: t('outgoingWithdrawal') }
  ];

  const merchantOptions = [
  { value: 'utilities', label: 'Utilities' },
  { value: 'online', label: 'Online' },
  { value: 'other', label: 'Other' }
];

const deviceOptions = [
  { value: 'mobile', label: 'Mobile' },
  { value: 'atm', label: 'ATM' },
  { value: 'pos', label: 'POS' }
];

const paymentOptions = [
  { value: 'card', label: 'Card' },
  { value: 'ACH', label: 'ACH' },
  { value: 'wire', label: 'Wire' }
];

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Transaction submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name="CreditCard" size={24} color="var(--color-primary)" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{t('newTransaction')}</h2>
          <p className="text-sm text-muted-foreground">{t('enterTransactionDetails')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label={t('transactionType')}
            options={transactionTypeOptions}
            value={formData?.transactionType}
            onChange={(value) => handleChange('transactionType', value)}
            required
          />

          <Input
            type="number"
            label={t('amount')}
            placeholder="600.00"
            value={formData?.amount}
            onChange={(e) => handleChange('amount', e?.target?.value)}
            required
            step="0.01"
            min="0"
          />

          <Select
            label={t('currency')}
            options={getCurrencyOptions()}
            value={formData?.currency}
            onChange={(value) => handleChange('currency', value)}
            required
          />

          <Select
            label={t('country')}
            options={countryOptions}
            value={formData?.country}
            onChange={(value) => handleChange('country', value)}
            required
            searchable
          />

          <Select

          label="Merchant Category"
          options={merchantOptions}
          value={formData.merchant_category}
          onChange={(value) => handleChange('merchant_category', value)}
          required
          />

         <Select
         label="Device Used"
         options={deviceOptions}
         value={formData.device_used}
         onChange={(value) => handleChange('device_used', value)}
         required
         />

         <Select
         label="Payment Channel"
         options={paymentOptions}
         value={formData.payment_channel}
         onChange={(value) => handleChange('payment_channel', value)}
         required
         />
        </div>


        <Button
          type="submit"
          fullWidth
          loading={loading}
          iconName="Shield"
          className="mt-6"
        >
          {t('analyzeTransaction')}
        </Button>
      </form>
    </div>
  );
};

export default TransactionForm;