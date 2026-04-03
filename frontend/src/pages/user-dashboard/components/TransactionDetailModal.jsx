import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { formatCurrency } from '../../../utils/currencyFormatter';

const TransactionDetailModal = ({ transaction, onClose }) => {
  const { t } = useTranslation();
  if (!transaction) return null;

  const getStatusColor = (status) => {
    return status === 'Safe' ?'bg-success/10 text-success border-success/20' :'bg-error/10 text-error border-error/20';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">{t('transactionDetails')}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">{t('basicInformation')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t('transactionId')}</p>
                <p className="text-lg font-medium text-foreground data-text">{transaction?.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t('amount')}</p>
                <p className="text-2xl font-bold text-foreground data-text">
                  {transaction?.transactionType === 'outgoing' && (
                    <span className="text-error mr-1">-</span>
                  )}
                  {transaction?.transactionType === 'incoming' && (
                    <span className="text-success mr-1">+</span>
                  )}
                  {formatCurrency(transaction?.amount, transaction?.currency || 'USD')}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">{t('date')}</p>
                <p className="text-lg font-medium text-foreground">
                  {new Date(transaction.date)?.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t('time')}</p>
                <p className="text-lg font-medium text-foreground">
                  {new Date(transaction.date)?.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t('location')}</p>
                <p className="text-lg font-medium text-foreground">{transaction?.location}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t('merchant')}</p>
                <p className="text-lg font-medium text-foreground">{transaction?.merchant}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t('transactionType')}</p>
                <p className="text-lg font-medium text-foreground capitalize">
                  {transaction?.transactionType === 'incoming' ? t('incomingLabel') : t('outgoingLabel')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">{t('fraudAssessment')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t('status')}</p>
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(transaction?.status)}`}>
                  <Icon 
                    name={transaction?.status === 'Safe' ? 'CheckCircle2' : 'AlertCircle'} 
                    size={20} 
                  />
                  {t(transaction?.status?.toLowerCase())}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t('fraudRisk')}</p>
                <p className="text-lg font-medium text-foreground">{transaction?.fraud_risk}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t('riskLevel')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t('riskFactors')}</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(transaction?.riskFactors || {})?.map(([key, value]) => (
                    <span 
                      key={key}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        value === 'Normal' ? 'bg-success/10 text-success' : 
                        value === 'Unusual'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                      }`}
                    >
                      {key}: {t(value?.toLowerCase())}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">{t('additionalDetails')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t('cardType')}</p>
                <p className="text-lg font-medium text-foreground">{transaction?.cardType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t('cardNumber')}</p>
                <p className="text-lg font-medium text-foreground data-text">•••• {transaction?.cardLast4}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-4 md:p-6 flex flex-col md:flex-row gap-3">
          <Button
            variant="outline"
            fullWidth
            onClick={onClose}
          >
            {t('close')}
          </Button>
          <Button
            variant="default"
            fullWidth
            iconName="FileText"
            onClick={() => {
              alert('Generating detailed report...');
            }}
          >
            Generate Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;