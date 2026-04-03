import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import apiClient from '../../../utils/apiClient';

const AdminTransactionDetailModal = ({ transaction, onClose, onStatusUpdate }) => {
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  if (!transaction) return null;

  const handleMarkReviewed = async () => {
    try {
      setUpdating(true);
      setUpdateError(null);
      setUpdateSuccess(null);
      await apiClient?.patch(`/admin/transactions/${transaction?.id}/review`, { status: 'reviewed' });
      setUpdateSuccess('Transaction marked as reviewed.');
      onStatusUpdate?.({ ...transaction, review_status: 'reviewed' });
    } catch (err) {
      setUpdateError(err?.response?.data?.detail || 'Failed to update transaction.');
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkResolved = async () => {
    try {
      setUpdating(true);
      setUpdateError(null);
      setUpdateSuccess(null);
      await apiClient?.patch(`/admin/transactions/${transaction?.id}/review`, { status: 'resolved' });
      setUpdateSuccess('Transaction marked as resolved.');
      onStatusUpdate?.({ ...transaction, review_status: 'resolved' });
    } catch (err) {
      setUpdateError(err?.response?.data?.detail || 'Failed to update transaction.');
    } finally {
      setUpdating(false);
    }
  };

  const riskColor =
    (transaction?.fraud_risk ?? 0) >= 70
      ? 'text-error'
      : (transaction?.fraud_risk ?? 0) >= 40
      ? 'text-warning' :'text-success';

  const fields = [
    { label: 'Transaction ID', value: `#${transaction?.id}` },
    { label: 'User ID', value: transaction?.user_id ? `#${transaction?.user_id}` : '—' },
    { label: 'Amount', value: transaction?.amount != null ? transaction?.amount?.toLocaleString() : '—' },
    { label: 'Currency', value: transaction?.currency || '—' },
    { label: 'Country', value: transaction?.country || '—' },
    { label: 'Merchant', value: transaction?.merchant || '—' },
    { label: 'Category', value: transaction?.category || '—' },
    { label: 'Transaction Date', value: transaction?.transaction_date ? new Date(transaction.transaction_date)?.toLocaleString() : '—' },
    { label: 'Fraud Label', value: transaction?.fraud_label || '—' },
    { label: 'Review Status', value: transaction?.review_status || 'Pending Review' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
              <Icon name="FileText" size={18} color="var(--color-accent)" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Transaction Details</h3>
              <p className="text-xs text-muted-foreground">Full transaction information</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Icon name="X" size={16} color="var(--color-muted-foreground)" />
          </button>
        </div>

        {/* Fraud Status Banner */}
        <div className={`mx-5 mt-4 px-4 py-3 rounded-lg flex items-center gap-3 ${
          transaction?.is_fraud
            ? 'bg-error/10 border border-error/20' :'bg-success/10 border border-success/20'
        }`}>
          <Icon
            name={transaction?.is_fraud ? 'AlertTriangle' : 'CheckCircle2'}
            size={18}
            color={transaction?.is_fraud ? 'var(--color-error)' : 'var(--color-success)'}
          />
          <div>
            <p className={`text-sm font-semibold ${transaction?.is_fraud ? 'text-error' : 'text-success'}`}>
              {transaction?.is_fraud ? 'Flagged as Fraud' : 'Safe Transaction'}
            </p>
            <p className={`text-xs ${riskColor}`}>
              Fraud Risk Score: <span className="font-bold">{transaction?.fraud_risk ?? '—'}</span>
            </p>
          </div>
        </div>

        {/* Fields */}
        <div className="p-5 grid grid-cols-2 gap-3">
          {fields?.map(({ label, value }) => (
            <div key={label} className="bg-muted/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className="text-sm font-medium text-foreground break-all">{value}</p>
            </div>
          ))}

          {/* Detection Reasons — full width, only shown when present */}
          {transaction?.reasons && (
            <div className="col-span-2 bg-warning/10 border border-warning/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="AlertCircle" size={14} color="var(--color-warning)" />
                <p className="text-xs font-semibold text-warning">Detection Reasons</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {transaction?.reasons?.split(',')?.map((reason, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/20 text-warning border border-warning/30"
                  >
                    {reason?.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Feedback */}
        {updateError && (
          <div className="mx-5 mb-3 px-4 py-2 bg-error/10 border border-error/20 rounded-lg">
            <p className="text-xs text-error">{updateError}</p>
          </div>
        )}
        {updateSuccess && (
          <div className="mx-5 mb-3 px-4 py-2 bg-success/10 border border-success/20 rounded-lg">
            <p className="text-xs text-success">{updateSuccess}</p>
          </div>
        )}

        {/* Actions */}
        <div className="p-5 pt-0 flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            iconName="Eye"
            onClick={handleMarkReviewed}
            disabled={updating}
          >
            Mark Reviewed
          </Button>
          <Button
            variant="primary"
            size="sm"
            iconName="CheckCircle2"
            onClick={handleMarkResolved}
            disabled={updating}
          >
            Mark Resolved
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactionDetailModal;
