import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FraudTrendsChart = () => {
  const { t } = useTranslation();
  const data = [
    { month: 'Jan', incomingFraud: 18, outgoingFraud: 27, resolved: 42 },
    { month: 'Feb', incomingFraud: 21, outgoingFraud: 31, resolved: 48 },
    { month: 'Mar', incomingFraud: 15, outgoingFraud: 23, resolved: 36 },
    { month: 'Apr', incomingFraud: 25, outgoingFraud: 36, resolved: 55 },
    { month: 'May', incomingFraud: 19, outgoingFraud: 28, resolved: 44 },
    { month: 'Jun', incomingFraud: 22, outgoingFraud: 33, resolved: 51 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-xs text-muted-foreground">
              {entry?.name}: <span className="font-semibold text-foreground">{entry?.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">{t('fraudTrends')}</h3>
      </div>
      <div className="w-full h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
            <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36}
              formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
            />
            <Bar dataKey="incomingFraud" fill="var(--color-primary)" name={t('incomingFraud')} />
            <Bar dataKey="outgoingFraud" fill="var(--color-error)" name={t('outgoingFraud')} />
            <Bar dataKey="resolved" fill="var(--color-success)" name={t('resolved')} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FraudTrendsChart;