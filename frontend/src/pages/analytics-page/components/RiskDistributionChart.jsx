import React from 'react';


const RiskDistributionChart = () => {
  const riskData = [
    { level: 'Low Risk', count: 7234, percentage: 82.6, color: 'var(--color-success)' },
    { level: 'Medium Risk', count: 1023, percentage: 11.7, color: 'var(--color-warning)' },
    { level: 'High Risk', count: 500, percentage: 5.7, color: 'var(--color-error)' }
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-6">Risk Distribution</h3>
      <div className="space-y-4">
        {riskData?.map((risk, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: risk?.color }} />
                <span className="text-sm font-medium text-foreground">{risk?.level}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{risk?.count?.toLocaleString()} transactions</span>
                <span className="text-sm font-semibold text-foreground">{risk?.percentage}%</span>
              </div>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-500"
                style={{ width: `${risk?.percentage}%`, backgroundColor: risk?.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskDistributionChart;