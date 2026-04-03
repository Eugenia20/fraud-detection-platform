import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const FraudPieChart = ({ data }) => {
  const COLORS = {
    Safe: 'var(--color-success)',
    Fraud: 'var(--color-error)'
  };

  const chartData = [
    { name: 'Safe Transactions', value: data?.safe, color: COLORS?.Safe },
    { name: 'Fraud Detected', value: data?.fraud, color: COLORS?.Fraud }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const total = data?.safe + data?.fraud;
      const percentage = ((payload?.[0]?.value / total) * 100)?.toFixed(1);
      
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-1">{payload?.[0]?.name}</p>
          <p className="text-xs text-muted-foreground">
            Count: <span className="font-semibold text-foreground">{payload?.[0]?.value?.toLocaleString()}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Percentage: <span className="font-semibold text-foreground">{percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-sm">
      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4">Fraud vs Safe Transactions</h3>
      <div className="w-full h-64 md:h-80" aria-label="Fraud vs Safe Transactions Pie Chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100)?.toFixed(0)}%`}
              outerRadius="80%"
              fill="#8884d8"
              dataKey="value"
            >
              {chartData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry?.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FraudPieChart;