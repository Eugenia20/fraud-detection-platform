import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../utils/apiClient';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SORT_OPTIONS = [
  { value: 'fraud_cases_desc', label: 'Most Fraud Cases' },
  { value: 'fraud_cases_asc', label: 'Least Fraud Cases' },
  { value: 'risk_desc', label: 'Highest Risk' },
  { value: 'risk_asc', label: 'Lowest Risk' },
];

const RiskyUsersTable = () => {
  const [riskyUsers, setRiskyUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [threshold, setThreshold] = useState('3');
  const [minFraudRisk, setMinFraudRisk] = useState('');
  const [sortOption, setSortOption] = useState('fraud_cases_desc');

  const fetchRiskyUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (threshold !== '') params.threshold = parseInt(threshold, 10);
      const response = await apiClient?.get('/admin/risky-users', { params });
      setRiskyUsers(response?.data || []);
    } catch (err) {
      setError('Failed to load risky users.');
    } finally {
      setLoading(false);
    }
  }, [threshold]);

  useEffect(() => {
    fetchRiskyUsers();
  }, [fetchRiskyUsers]);

  // Client-side filter by min fraud risk (avg_fraud_risk or fraud_risk field)
  const filteredUsers = (riskyUsers || [])?.filter((user) => {
    if (minFraudRisk === '') return true;
    const risk = user?.avg_fraud_risk ?? user?.fraud_risk ?? 0;
    return risk >= parseFloat(minFraudRisk);
  });

  const sortedUsers = [...filteredUsers]?.sort((a, b) => {
    switch (sortOption) {
      case 'fraud_cases_desc': return (b?.fraud_cases ?? 0) - (a?.fraud_cases ?? 0);
      case 'fraud_cases_asc': return (a?.fraud_cases ?? 0) - (b?.fraud_cases ?? 0);
      case 'risk_desc': return (b?.avg_fraud_risk ?? b?.fraud_risk ?? 0) - (a?.avg_fraud_risk ?? a?.fraud_risk ?? 0);
      case 'risk_asc': return (a?.avg_fraud_risk ?? a?.fraud_risk ?? 0) - (b?.avg_fraud_risk ?? b?.fraud_risk ?? 0);
      default: return 0;
    }
  });

  const getRiskLevel = (cases, risk) => {
    if (cases >= 10 || risk >= 80) return { label: 'Critical', color: 'bg-error/10 text-error border-error/20' };
    if (cases >= 6 || risk >= 60) return { label: 'High', color: 'bg-warning/10 text-warning border-warning/20' };
    return { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center">
              <Icon name="ShieldAlert" size={20} color="var(--color-error)" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">High-Risk Users</h2>
              <p className="text-sm text-muted-foreground">Users with multiple fraud transactions or high fraud risk</p>
            </div>
          </div>
          <Button variant="outline" size="sm" iconName="RefreshCw" onClick={fetchRiskyUsers}>
            Refresh
          </Button>
        </div>
      </div>
      {/* Filters */}
      <div className="p-4 md:p-6 border-b border-border bg-muted/20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Min Fraud Cases (Threshold)</label>
            <Input
              type="number"
              placeholder="e.g. 3"
              value={threshold}
              onChange={(e) => setThreshold(e?.target?.value)}
              min={1}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Min Fraud Risk Score (0–100)</label>
            <Input
              type="number"
              placeholder="e.g. 60"
              value={minFraudRisk}
              onChange={(e) => setMinFraudRisk(e?.target?.value)}
              min={0}
              max={100}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Sort By</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e?.target?.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              {SORT_OPTIONS?.map((opt) => (
                <option key={opt?.value} value={opt?.value}>{opt?.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Stats */}
      <div className="px-4 md:px-6 py-3 border-b border-border bg-muted/10">
        <p className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{sortedUsers?.length}</span> high-risk user{sortedUsers?.length !== 1 ? 's' : ''}
          {threshold ? ` with ≥ ${threshold} fraud case${parseInt(threshold, 10) !== 1 ? 's' : ''}` : ''}
          {minFraudRisk ? ` and fraud risk ≥ ${minFraudRisk}` : ''}
        </p>
      </div>
      {/* Table */}
      <div className="overflow-x-auto custom-scrollbar">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading risky users...</div>
        ) : error ? (
          <div className="p-8 text-center text-destructive">{error}</div>
        ) : sortedUsers?.length === 0 ? (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <Icon name="ShieldCheck" size={24} color="var(--color-success)" />
              </div>
              <p className="text-muted-foreground text-sm">No high-risk users detected.</p>
            </div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground">User ID</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground">Email</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground">Company</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground">Fraud Cases</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground">Avg Fraud Risk</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-muted-foreground">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers?.map((user) => {
                const cases = user?.fraud_cases ?? 0;
                const avgRisk = user?.avg_fraud_risk ?? user?.fraud_risk ?? 0;
                const { label, color } = getRiskLevel(cases, avgRisk);
                return (
                  <tr key={user?.user_id} className="table-row">
                    <td className="px-4 md:px-6 py-4">
                      <span className="text-xs md:text-sm font-medium text-foreground data-text">#{user?.user_id}</span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className="text-xs md:text-sm text-muted-foreground">{user?.email || '—'}</span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className="text-xs md:text-sm text-muted-foreground">{user?.company || '—'}</span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className="text-xs md:text-sm font-bold text-error">{cases}</span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className={`text-xs md:text-sm font-semibold ${
                        avgRisk >= 70 ? 'text-error' : avgRisk >= 40 ? 'text-warning' : 'text-success'
                      }`}>
                        {avgRisk > 0 ? avgRisk?.toFixed(1) : '—'}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${color}`}>
                        {label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RiskyUsersTable;
