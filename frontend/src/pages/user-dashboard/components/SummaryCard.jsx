import React from 'react';
import Icon from '../../../components/AppIcon';

const SummaryCard = ({ title, value, subtitle, trend, trendValue, icon, iconColor, bgColor }) => {
  const isPositiveTrend = trend === 'up';
  
  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-250">
      <div className="flex items-start justify-between mb-4">
        <div className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg ${bgColor}`}>
          <Icon name={icon} size={24} color={iconColor} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${isPositiveTrend ? 'bg-success/10' : 'bg-error/10'}`}>
            <Icon 
              name={isPositiveTrend ? 'TrendingUp' : 'TrendingDown'} 
              size={14} 
              color={isPositiveTrend ? 'var(--color-success)' : 'var(--color-error)'} 
            />
            <span className={`text-xs font-medium ${isPositiveTrend ? 'text-success' : 'text-error'}`}>
              {trendValue}
            </span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-xs md:text-sm text-muted-foreground font-medium">{title}</p>
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">{value}</h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;