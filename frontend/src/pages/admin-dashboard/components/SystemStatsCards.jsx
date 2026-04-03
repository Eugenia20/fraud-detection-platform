import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import apiClient from '../../../utils/apiClient';
import SummaryCard from '../../user-dashboard/components/SummaryCard';

const SystemStatsCards = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient?.get('/admin/stats');
        setStats(response?.data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4]?.map(i => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/2 mb-3" />
            <div className="h-8 bg-muted rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <SummaryCard
        title={t('totalUsers')}
        value={stats?.total_users?.toLocaleString() ?? '—'}
        subtitle={t('activeAccounts')}
        trend="up"
        trendValue=""
        icon="Users"
        iconColor="var(--color-primary)"
        bgColor="bg-primary/10"
      />
      <SummaryCard
        title={t('totalTransactions')}
        value={stats?.total_transactions?.toLocaleString() ?? '—'}
        subtitle={t('last30Days')}
        trend="up"
        trendValue=""
        icon="CreditCard"
        iconColor="var(--color-secondary)"
        bgColor="bg-secondary/10"
      />
      <SummaryCard
        title={t('fraudCases')}
        value={stats?.fraud_cases ?? '—'}
        subtitle={t('detectedThisMonth')}
        trend="down"
        trendValue=""
        icon="AlertTriangle"
        iconColor="var(--color-error)"
        bgColor="bg-error/10"
      />
      <SummaryCard
        title={t('fraudPercentage')}
        value={stats?.fraud_rate_percent != null ? `${stats?.fraud_rate_percent}%` : '—'}
        subtitle={t('overallFraudRate')}
        trend="down"
        trendValue=""
        icon="TrendingDown"
        iconColor="var(--color-success)"
        bgColor="bg-success/10"
      />
    </div>
  );
};

export default SystemStatsCards;