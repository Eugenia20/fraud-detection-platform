import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../contexts/NotificationContext';
import SidebarNavigation from '../../components/navigation/SidebarNavigation';
import ThemeToggle from '../../components/navigation/ThemeToggle';
import LanguageSelector from '../../components/navigation/LanguageSelector';
import Icon from '../../components/AppIcon';
import FraudTrendsChart from './components/FraudTrendsChart';
import RiskDistributionChart from './components/RiskDistributionChart';
import NotificationCenter from '../../components/notifications/NotificationCenter';
import FraudPieChart from '../user-dashboard/components/FraudPieChart';
import TransactionLineChart from '../user-dashboard/components/TransactionLineChart';




const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { unreadCount } = useNotifications();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  const mockPieData = { safe: 8234, fraud: 523 };
  const mockTimeSeriesData = [
    { date: 'Feb 5', safe: 145, fraud: 12 },
    { date: 'Feb 6', safe: 158, fraud: 8 },
    { date: 'Feb 7', safe: 142, fraud: 15 },
    { date: 'Feb 8', safe: 167, fraud: 10 },
    { date: 'Feb 9', safe: 153, fraud: 18 },
    { date: 'Feb 10', safe: 171, fraud: 7 },
    { date: 'Feb 11', safe: 149, fraud: 13 }
  ];

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
                {t('analytics')}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsNotificationCenterOpen(true)}
                className="relative w-10 h-10 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
                aria-label="Notifications"
              >
                <Icon name="Bell" size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FraudPieChart data={mockPieData} />
            <FraudTrendsChart />
          </div>
          <TransactionLineChart data={mockTimeSeriesData} />
          <RiskDistributionChart />
        </main>

        <NotificationCenter 
          isOpen={isNotificationCenterOpen}
          onClose={() => setIsNotificationCenterOpen(false)}
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;