import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../contexts/NotificationContext';
import SidebarNavigation from '../../components/navigation/SidebarNavigation';
import ThemeToggle from '../../components/navigation/ThemeToggle';
import LanguageSelector from '../../components/navigation/LanguageSelector';
import ProfileSettings from './components/ProfileSettings';
import SecuritySettings from './components/SecuritySettings';
import NotificationSettings from './components/NotificationSettings';
import NotificationCenter from '../../components/notifications/NotificationCenter';
import Icon from '../../components/AppIcon';


const ProfilePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { unreadCount } = useNotifications();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

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
                {t('profile')}
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
          <div className="max-w-4xl mx-auto space-y-6">
            <ProfileSettings />
            <SecuritySettings />
            <NotificationSettings />
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

export default ProfilePage;