import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import SidebarNavigation from '../../components/navigation/SidebarNavigation';
import ThemeToggle from '../../components/navigation/ThemeToggle';
import LanguageSelector from '../../components/navigation/LanguageSelector';
import Icon from '../../components/AppIcon';
import apiClient from '../../utils/apiClient';
import { formatCurrency } from '../../utils/currencyFormatter';
import TransactionDetailModal from './components/TransactionDetailModal';
import NotificationCenter from '../../components/notifications/NotificationCenter';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useNotifications();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [chartRange, setChartRange] = useState('This Month');

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required. Please log in.');
        setTimeout(() => navigate('/login-page'), 2000);
        return;
      }
        const response = await apiClient.get('/transactions', { params: { offset: 0, limit: 100 } });
     if (response?.data && Array.isArray(response?.data?.data)) {
        const transactionTypeMap = JSON.parse(localStorage.getItem('transactionTypeMap') || '{}');
        const transformed = response?.data?.data?.map(txn => {
          const txnId = txn?.id?.toString();
          return {
            id: txnId || 'N/A',
            amount: txn?.amount || 0,
            currency: txn?.currency || 'USD',
            date: txn?.created_at || txn?.date,
            location: txn?.country || 'Unknown',
            country: txn?.country || 'Unknown',
            status: txn?.is_fraud ? 'Fraud' : 'Safe',
            merchant: 'Transaction',
            cardType: 'Card',
            cardLast4: '****',
            transactionType: transactionTypeMap?.[txnId] || 'outgoing',
            is_fraud: txn?.is_fraud || false,
            fraud_risk: txn?.fraud_risk || 0,
            fraud_label: txn?.fraud_label || 'Low Risk',
            riskFactors: {
              location: txn?.fraud_risk > 50 ? 'High Risk' : 'Normal',
              amount: txn?.fraud_risk > 50 ? 'Unusual' : 'Normal',
              time: txn?.fraud_risk > 50 ? 'Suspicious' : 'Normal'
            }
          };
        });
        setTransactions(transformed);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      if (err?.response?.status !== 401) {
        setError(err?.response?.data?.detail || err?.message || 'Failed to load transactions.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  useEffect(() => {
    if (location?.state?.refreshTransactions) {
      fetchTransactions();
      window.history?.replaceState({}, document.title);
    }
  }, [location?.state?.refreshTransactions]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) return;
        const res = await apiClient?.get('/profile');
        if (res?.data) setUserProfile(res?.data);
      } catch (e) { /* silent */ }
    };
    fetchProfile();
  }, []);

  // Computed stats
  const totalTransactions = transactions?.length;
  const fraudDetected = transactions?.filter(t => t?.status === 'Fraud')?.length;
  const safeTransactions = transactions?.filter(t => t?.status === 'Safe')?.length;
  const fraudRate = totalTransactions > 0 ? ((fraudDetected / totalTransactions) * 100)?.toFixed(1) : '0.0';
  const avgRiskScore = totalTransactions > 0
    ? (transactions?.reduce((sum, t) => sum + (t?.fraud_risk || 0), 0) / totalTransactions)?.toFixed(0)
    : '0';

  // Build bar chart data from transactions grouped by country (top 6)
  const countryMap = {};
  transactions?.forEach(t => {
    const c = t?.country || 'Unknown';
    if (!countryMap?.[c]) countryMap[c] = { safe: 0, fraud: 0 };
    if (t?.status === 'Fraud') countryMap[c].fraud++;
    else countryMap[c].safe++;
  });
  const chartData = Object.entries(countryMap)?.sort((a, b) => (b?.[1]?.safe + b?.[1]?.fraud) - (a?.[1]?.safe + a?.[1]?.fraud))?.slice(0, 6)?.map(([country, vals]) => ({ name: country, Safe: vals?.safe, Fraud: vals?.fraud }));

  // Recent 5 transactions for activity feed
  const recentActivity = [...transactions]?.slice(0, 5);

  // Risk distribution for donut-style stat
  const highRisk = transactions?.filter(t => t?.fraud_risk >= 70)?.length;
  const medRisk = transactions?.filter(t => t?.fraud_risk >= 40 && t?.fraud_risk < 70)?.length;
  const lowRisk = transactions?.filter(t => t?.fraud_risk < 40)?.length;

  const getRiskBadge = (score) => {
    if (score >= 70) return { label: 'High', cls: 'bg-error/15 text-error border-error/30' };
    if (score >= 40) return { label: 'Medium', cls: 'bg-warning/15 text-warning border-warning/30' };
    return { label: 'Low', cls: 'bg-success/15 text-success border-success/30' };
  };

  const getStatusBadge = (status) => {
    return status === 'Safe' ?'bg-success/15 text-success border-success/30' :'bg-error/15 text-error border-error/30';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg text-xs">
          <p className="font-semibold text-foreground mb-1">{label}</p>
          {payload?.map((p, i) => (
            <p key={i} style={{ color: p?.color }}>{p?.name}: {p?.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNavigation
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        userRole="user"
      />
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'}`}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-card border-b border-border backdrop-blur-sm">
          <div className="flex items-center justify-between h-16 px-4 md:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <h1 className="text-lg md:text-xl font-semibold text-foreground">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsNotificationCenterOpen(true)}
                className="relative w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
              >
                <Icon name="Bell" size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <LanguageSelector />
              <ThemeToggle />
              <div className="hidden md:flex items-center gap-2 pl-3 border-l border-border">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="User" size={16} color="var(--color-primary)" />
                </div>
                <div className="hidden lg:block">
                  <p className="text-xs font-medium text-foreground leading-tight">
                    {userProfile?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {userProfile?.company || 'Fraud Analyst'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-4">
                <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-muted-foreground text-sm">Loading transactions...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-error/10 border border-error/20 rounded-xl p-6 text-center">
              <Icon name="AlertTriangle" size={40} color="var(--color-error)" className="mx-auto mb-3" />
              <p className="text-error font-semibold mb-1">Error loading data</p>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <button onClick={fetchTransactions} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                Retry
              </button>
            </div>
          ) : (
            <div className="space-y-6">

              {/* ── Top Stats Row ── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Transactions */}
                <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon name="CreditCard" size={20} color="var(--color-primary)" />
                    </div>
                    <span className="text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">Live</span>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground data-text">{totalTransactions}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total Transactions</p>
                </div>

                {/* Fraud Detected */}
                <div className="bg-card border border-border rounded-2xl p-5 hover:border-error/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center">
                      <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
                    </div>
                    <span className="text-xs font-medium text-error bg-error/10 px-2 py-0.5 rounded-full">{fraudRate}%</span>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground data-text">{fraudDetected}</p>
                  <p className="text-xs text-muted-foreground mt-1">Fraud Detected</p>
                </div>

                {/* Safe Transactions */}
                <div className="bg-card border border-border rounded-2xl p-5 hover:border-success/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                      <Icon name="ShieldCheck" size={20} color="var(--color-success)" />
                    </div>
                    <span className="text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">Safe</span>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground data-text">{safeTransactions}</p>
                  <p className="text-xs text-muted-foreground mt-1">Safe Transactions</p>
                </div>

                {/* Avg Risk Score */}
                <div className="bg-card border border-border rounded-2xl p-5 hover:border-warning/30 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                      <Icon name="Activity" size={20} color="var(--color-warning)" />
                    </div>
                    <span className="text-xs font-medium text-warning bg-warning/10 px-2 py-0.5 rounded-full">Score</span>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground data-text">{avgRiskScore}</p>
                  <p className="text-xs text-muted-foreground mt-1">Avg Risk Score</p>
                </div>
              </div>

              {/* ── Middle Row: Chart + Risk Distribution ── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bar Chart */}
                <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-base font-semibold text-foreground">Transaction Overview</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Safe vs Fraud by Country</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {['This Month', 'All Time']?.map(r => (
                        <button
                          key={r}
                          onClick={() => setChartRange(r)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${chartRange === r ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  {chartData?.length > 0 ? (
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barCategoryGap="30%">
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                          <XAxis dataKey="name" stroke="var(--color-muted-foreground)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                          <YAxis stroke="var(--color-muted-foreground)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend iconType="circle" iconSize={8} formatter={v => <span className="text-xs text-foreground">{v}</span>} />
                          <Bar dataKey="Safe" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Fraud" fill="var(--color-error)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-56 flex items-center justify-center text-muted-foreground text-sm">
                      No transaction data available
                    </div>
                  )}
                </div>

                {/* Risk Distribution */}
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h2 className="text-base font-semibold text-foreground mb-1">Risk Distribution</h2>
                  <p className="text-xs text-muted-foreground mb-5">Breakdown by risk level</p>

                  <div className="space-y-4">
                    {[
                      { label: 'High Risk', count: highRisk, color: 'var(--color-error)', bg: 'bg-error' },
                      { label: 'Medium Risk', count: medRisk, color: 'var(--color-warning)', bg: 'bg-warning' },
                      { label: 'Low Risk', count: lowRisk, color: 'var(--color-success)', bg: 'bg-success' },
                    ]?.map(item => {
                      const pct = totalTransactions > 0 ? Math.round((item?.count / totalTransactions) * 100) : 0;
                      return (
                        <div key={item?.label}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm text-foreground font-medium">{item?.label}</span>
                            <span className="text-sm font-bold text-foreground data-text">{item?.count}</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${item?.bg} rounded-full transition-all duration-500`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{pct}% of total</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-4 border-t border-border">
                    <button
                      onClick={() => navigate('/add-transaction-page')}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <Icon name="Plus" size={16} />
                      Submit Transaction
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Bottom Row: Transaction Table + Recent Activity ── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Transactions Table */}
                <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <h2 className="text-base font-semibold text-foreground">Recent Transactions</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{transactions?.length} total</span>
                      <button
                        onClick={fetchTransactions}
                        className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                        title="Refresh"
                      >
                        <Icon name="RefreshCw" size={14} className="text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">ID</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Amount</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Country</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Risk Score</th>
                          <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                          <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions?.slice(0, 8)?.map((txn, i) => {
                          const risk = getRiskBadge(txn?.fraud_risk);
                          return (
                            <tr key={txn?.id} className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                              <td className="px-5 py-3">
                                <span className="text-xs font-medium text-foreground data-text">#{txn?.id}</span>
                              </td>
                              <td className="px-5 py-3">
                              <span className="text-xs font-semibold text-foreground data-text">
                              {formatCurrency(txn?.amount, txn?.currency)}
                               </span>
                              </td>
                              <td className="px-5 py-3">
                                <span className="text-xs text-muted-foreground">{txn?.country}</span>
                              </td>
                              <td className="px-5 py-3">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${risk?.cls}`}>
                                  {txn?.fraud_risk} — {risk?.label}
                                </span>
                              </td>
                              <td className="px-5 py-3">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(txn?.status)}`}>
                                  <Icon name={txn?.status === 'Safe' ? 'CheckCircle2' : 'AlertCircle'} size={11} />
                                  {txn?.status}
                                </span>
                              </td>
                              <td className="px-5 py-3 text-right">
                                <button
                                  onClick={() => setSelectedTransaction(txn)}
                                  className="text-xs text-primary hover:underline font-medium"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {transactions?.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">
                              No transactions found. Submit your first transaction.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {transactions?.length > 8 && (
                    <div className="px-5 py-3 border-t border-border text-center">
                      <button
                        onClick={() => navigate('/add-transaction-page')}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        View all {transactions?.length} transactions →
                      </button>
                    </div>
                  )}
                </div>

                {/* Recent Activity */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-border">
                    <h2 className="text-base font-semibold text-foreground">Recent Activity</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Latest fraud checks</p>
                  </div>
                  <div className="p-4 space-y-3">
                    {recentActivity?.length > 0 ? recentActivity?.map((txn, i) => {
                      const risk = getRiskBadge(txn?.fraud_risk);
                      return (
                        <div
                          key={txn?.id}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => setSelectedTransaction(txn)}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${txn?.status === 'Safe' ? 'bg-success/15' : 'bg-error/15'}`}>
                            <Icon
                              name={txn?.status === 'Safe' ? 'ShieldCheck' : 'ShieldAlert'}
                              size={15}
                              color={txn?.status === 'Safe' ? 'var(--color-success)' : 'var(--color-error)'}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">
                              Transaction #{txn?.id}
                            </p>
                           <p className="text-xs text-muted-foreground mt-0.5">
                           {formatCurrency(txn?.amount, txn?.currency)} · {txn?.country}
                           </p>
                          </div>
                          <span className={`text-xs font-medium px-1.5 py-0.5 rounded border flex-shrink-0 ${risk?.cls}`}>
                            {txn?.fraud_risk}
                          </span>
                        </div>
                      );
                    }) : (
                      <div className="py-8 text-center text-sm text-muted-foreground">
                        No recent activity
                      </div>
                    )}
                  </div>

                  {/* Quick stats footer */}
                  <div className="px-5 py-4 border-t border-border bg-muted/20">
                    <p className="text-xs font-medium text-muted-foreground mb-3">Risk Breakdown</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-sm font-bold text-error data-text">{highRisk}</p>
                        <p className="text-xs text-muted-foreground">High</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-warning data-text">{medRisk}</p>
                        <p className="text-xs text-muted-foreground">Med</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-success data-text">{lowRisk}</p>
                        <p className="text-xs text-muted-foreground">Low</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </main>

        <NotificationCenter
          isOpen={isNotificationCenterOpen}
          onClose={() => setIsNotificationCenterOpen(false)}
        />
      </div>
      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
};

export default UserDashboard;