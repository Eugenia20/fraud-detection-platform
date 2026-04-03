import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Icon from '../AppIcon';

const SidebarNavigation = ({ isCollapsed = false, onToggleCollapse, userRole = 'user' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    {
      label: t('dashboard'),
      path: '/user-dashboard',
      icon: 'LayoutDashboard',
      roles: ['user', 'admin']
    },
    {
      label: t('addTransaction'),
      path: '/add-transaction-page',
      icon: 'Plus',
      roles: ['user', 'admin']
    },
    {
      label: t('analytics'),
      path: '/analytics',
      icon: 'BarChart3',
      roles: ['user', 'admin']
    },
    {
      label: t('adminDashboard'),
      path: '/admin-dashboard',
      icon: 'Shield',
      roles: ['admin']
    },
    {
      label: t('profile'),
      path: '/profile',
      icon: 'User',
      roles: ['user', 'admin']
    }
  ];

  const filteredNavItems = navigationItems?.filter(item => 
    item?.roles?.includes(userRole)
  );

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    navigate('/login-page');
    setIsMobileOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileOpen]);

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden flex items-center justify-center w-12 h-12 rounded-lg bg-card border border-border shadow-md hover:bg-muted transition-colors duration-250"
        aria-label="Toggle mobile menu"
      >
        <Icon name={isMobileOpen ? 'X' : 'Menu'} size={24} />
      </button>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <aside
        className={`
          fixed lg:fixed top-0 left-0 h-full bg-card border-r border-border z-100
          transition-all duration-300 ease-smooth
          ${isCollapsed ? 'w-20' : 'w-60'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className={`sidebar-header ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
          <div className="sidebar-logo">
            <Icon name="Shield" size={24} color="var(--color-primary)" />
          </div>
          {!isCollapsed && (
            <span className="sidebar-logo-text">BankProtect</span>
          )}
        </div>

        <nav className="flex flex-col h-[calc(100%-5rem)] p-4 overflow-y-auto custom-scrollbar">
          <div className="flex-1 space-y-2">
            {filteredNavItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`
                  nav-item w-full
                  ${location?.pathname === item?.path ? 'active' : ''}
                  ${isCollapsed ? 'justify-center px-0' : ''}
                `}
                title={isCollapsed ? item?.label : ''}
              >
                <Icon name={item?.icon} size={20} />
                {!isCollapsed && <span>{item?.label}</span>}
              </button>
            ))}
          </div>

          <div className="pt-4 mt-4 border-t border-border space-y-2">
            <button
              onClick={handleLogout}
              className={`
                nav-item w-full text-error hover:bg-error/10
                ${isCollapsed ? 'justify-center px-0' : ''}
              `}
              title={isCollapsed ? t('logout') : ''}
            >
              <Icon name="LogOut" size={20} />
              {!isCollapsed && <span>{t('logout')}</span>}
            </button>
          </div>
        </nav>

        {!isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 items-center justify-center rounded-full bg-card border border-border shadow-md hover:bg-muted transition-colors duration-250"
            aria-label="Collapse sidebar"
          >
            <Icon name="ChevronLeft" size={16} />
          </button>
        )}

        {isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 items-center justify-center rounded-full bg-card border border-border shadow-md hover:bg-muted transition-colors duration-250"
            aria-label="Expand sidebar"
          >
            <Icon name="ChevronRight" size={16} />
          </button>
        )}
      </aside>
    </>
  );
};

export default SidebarNavigation;