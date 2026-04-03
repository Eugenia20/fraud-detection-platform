import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Button from '../../../components/ui/Button';

const TransactionLineChart = ({ data }) => {
  const [timeRange, setTimeRange] = useState('7d');

  const filterDataByRange = (range) => {
    const now = new Date();
    const ranges = {
      '7d': 7,
      '30d': 30,
      '90d': 90
    };
    
    const daysToShow = ranges?.[range] || 7;
    return data?.slice(-daysToShow);
  };

  const filteredData = filterDataByRange(timeRange);

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
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h3 className="text-lg md:text-xl font-semibold text-foreground">Transactions Over Time</h3>
        <div className="flex items-center gap-2">
          <Button
            variant={timeRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </Button>
          <Button
            variant={timeRange === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </Button>
          <Button
            variant={timeRange === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('90d')}
          >
            90 Days
          </Button>
        </div>
      </div>
      <div className="w-full h-64 md:h-80" aria-label="Transactions Over Time Line Chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="line"
              formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
            />
            <Line 
              type="monotone" 
              dataKey="safe" 
              stroke="var(--color-success)" 
              strokeWidth={2}
              name="Safe Transactions"
              dot={{ fill: 'var(--color-success)', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="fraud" 
              stroke="var(--color-error)" 
              strokeWidth={2}
              name="Fraud Detected"
              dot={{ fill: 'var(--color-error)', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransactionLineChart;