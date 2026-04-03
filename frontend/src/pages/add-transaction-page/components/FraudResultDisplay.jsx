import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../../../components/AppIcon';
import { formatCurrency } from '../../../utils/currencyFormatter';

const FraudResultDisplay = ({ result }) => {
  const { t } = useTranslation();
  const isFraud = result?.is_fraud;
  const riskLevel = result?.fraud_risk;

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm mt-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          isFraud ? 'bg-error/10' : 'bg-success/10'
        }`}>
          <Icon 
            name={isFraud ? 'AlertTriangle' : 'CheckCircle2'} 
            size={24} 
            color={isFraud ? 'var(--color-error)' : 'var(--color-success)'} 
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Analysis Result</h2>
          <p className="text-sm text-muted-foreground">Transaction ID: {result?.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{t('amount')}</p>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(result?.amount, result?.currency)}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1">Country</p>
          <p className="text-lg font-medium text-foreground">{result?.country}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1">Fraud Risk Score</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  riskLevel > 70 ? 'bg-error' : riskLevel > 40 ? 'bg-warning' : 'bg-success'
                }`}
                style={{ width: `${riskLevel}%` }}
              />
            </div>
            <span className="text-lg font-semibold text-foreground">{riskLevel?.toFixed(1)}%</span>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1">Classification</p>
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
            isFraud ? 'bg-error/10 text-error border-error/20' : 'bg-success/10 text-success border-success/20'
          }`}>
            <Icon name={isFraud ? 'AlertCircle' : 'CheckCircle2'} size={16} />
            {result?.fraud_label}
          </span>
        </div>
      </div>

      {isFraud && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
            <div>
              <p className="text-sm font-semibold text-error mb-1">High Risk Transaction</p>
              <p className="text-sm text-muted-foreground">
                This transaction has been flagged as potentially fraudulent. Recommended actions: 
                Contact customer for verification, review transaction history, and monitor account activity.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraudResultDisplay;