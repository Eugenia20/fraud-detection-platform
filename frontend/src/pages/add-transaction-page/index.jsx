import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import toast from 'react-hot-toast';
import { useNotifications } from '../../contexts/NotificationContext';
import SidebarNavigation from '../../components/navigation/SidebarNavigation';
import ThemeToggle from '../../components/navigation/ThemeToggle';
import LanguageSelector from '../../components/navigation/LanguageSelector';
import TransactionForm from './components/TransactionForm';
import FraudResultDisplay from './components/FraudResultDisplay';
import Icon from '../../components/AppIcon';
import NotificationCenter from '../../components/notifications/NotificationCenter';
import apiClient from '../../utils/apiClient';


const AddTransactionPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addNotification, triggerEmailNotification, preferences } = useNotifications();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [fraudResult, setFraudResult] = useState(null);
  const [error, setError] = useState(null);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  const handleTransactionSubmit = async (transactionData) => {
    setError(null);
    setFraudResult(null);

    try {
      // Get auth token from sessionStorage or localStorage
      const authToken = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
      
      if (!authToken) {
        setError('Authentication required. Please log in.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      // Prepare request body with only required fields
      const requestBody = {
      amount: parseFloat(transactionData?.amount),
      currency: transactionData?.currency,
      country: transactionData?.country,
      tx_type: transactionData.tx_type,
      merchant_category: transactionData?.merchant_category,
      device_used: transactionData?.device_used,
      payment_channel: transactionData?.payment_channel,
      };

      // Make POST request to backend API
      const response = await apiClient?.post('/transactions', requestBody);

      // Handle successful response
      if (response?.data) {
        const result = {
          ...response?.data,
          transactionType: transactionData?.transactionType,
          date: new Date()?.toISOString(),
          location: transactionData?.country,
          merchant: 'Recent Transaction',
          cardType: 'Visa',
          cardLast4: '****',
          status: response?.data?.is_fraud ? 'Fraud' : 'Safe',
          riskFactors: {
            location: response?.data?.fraud_risk > 50 ? 'High Risk' : 'Normal',
            amount: response?.data?.fraud_risk > 50 ? 'Unusual' : 'Normal',
            time: response?.data?.fraud_risk > 50 ? 'Suspicious' : 'Normal'
          }
        };
        setFraudResult(result);

        // Store transaction type mapping in localStorage for later retrieval
        const transactionTypeMap = JSON.parse(localStorage.getItem('transactionTypeMap') || '{}');
        transactionTypeMap[response?.data?.id?.toString()] = transactionData?.transactionType;
        localStorage.setItem('transactionTypeMap', JSON.stringify(transactionTypeMap));

        // Show success message
        toast?.success('Transaction created successfully!');

        // Navigate to dashboard after 2 seconds to show updated transaction list
        setTimeout(() => {
          navigate('/user-dashboard', { state: { refreshTransactions: true } });
        }, 2000);

        // Check if this is a high-risk fraud transaction
        const isHighRisk = result?.is_fraud === true || 
                          result?.fraud_label?.toLowerCase() === 'high' ||
                          result?.fraud_risk >= 70;

        if (isHighRisk && preferences?.fraudAlerts) {
          // Create notification object
          const notification = {
            title: t('highRiskFraudDetected'),
            message: t('fraudAlertMessage', { 
              id: result?.id,
              amount: result?.amount,
              currency: result?.currency
            }),
            transactionId: result?.id,
            amount: result?.amount,
            currency: result?.currency,
            country: result?.country,
            riskLevel: result?.fraud_risk,
            fraudLabel: result?.fraud_label,
            type: 'fraud_alert'
          };

          // Add to notification center
          addNotification(notification);

          // Show toast notification
          toast?.error(
            <div className="flex items-start gap-3">
              <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
              <div>
                <p className="font-semibold text-sm">{t('highRiskFraudDetected')}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('transactionId')}: {result?.id} | {t('risk')}: {result?.fraud_risk}%
                </p>
              </div>
            </div>,
            {
              duration: 6000,
              style: {
                maxWidth: '500px'
              }
            }
          );

          // Trigger email notification if enabled
          if (preferences?.emailNotifications) {
            await triggerEmailNotification(notification);
          }
        }
      }

    } catch (err) {
      console.error("FULL ERROR:", err.response?.data || err);
      
      // Handle different error types
      if (err?.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
      } else if (err?.response?.status === 422) {
        setError('Invalid transaction data. Please check your inputs.');
      } else if (err?.response?.data?.detail) {
        setError(`Error: ${err?.response?.data?.detail}`);
      } else if (err?.message) {
        setError(`Connection error: ${err?.message}`);
      } else {
        setError('Failed to process transaction. Please try again.');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNavigation 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        userRole="user"
      />
      <div 
        className={`flex-1 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'
        }`}
      >
        <header className="sticky top-0 z-40 bg-card border-b border-border backdrop-blur-sm">
          <div className="flex items-center justify-between h-20 px-4 md:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">
                {t('addTransaction')}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsNotificationCenterOpen(true)}
                className="relative w-10 h-10 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                aria-label="Notifications"
              >
                <Icon name="Bell" size={20} />
              </button>
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8 space-y-6">
          <div className="max-w-4xl mx-auto">
            <TransactionForm onSubmit={handleTransactionSubmit} />
            
            {error && (
              <div className="bg-error/10 border border-error/20 rounded-xl p-4 mt-6 animate-slide-up">
                <div className="flex items-center gap-3">
                  <div className="text-error font-semibold">⚠️ Error</div>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
            )}
            
            {fraudResult && <FraudResultDisplay result={fraudResult} />}
          </div>
        </main>

        <NotificationCenter 
          isOpen={isNotificationCenterOpen}
          onClose={() => setIsNotificationCenterOpen(false)}
        />
      </div>
    </div>
  );
};

export default AddTransactionPage;