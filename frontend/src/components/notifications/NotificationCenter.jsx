import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../contexts/NotificationContext';
import Icon from '../AppIcon';
import { formatCurrency } from '../../utils/currencyFormatter';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications();
  const panelRef = useRef(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef?.current && !panelRef?.current?.contains(event?.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getRiskColor = (riskLevel) => {
    if (riskLevel >= 70) return 'error';
    if (riskLevel >= 40) return 'warning';
    return 'success';
  };

  const getRiskIcon = (riskLevel) => {
    if (riskLevel >= 70) return 'AlertTriangle';
    if (riskLevel >= 40) return 'AlertCircle';
    return 'CheckCircle2';
  };

  return (
    <>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" onClick={onClose} />
      <div
        ref={panelRef}
        className="fixed top-0 right-0 h-full w-full sm:w-96 bg-card border-l border-border shadow-2xl z-50 flex flex-col animate-slide-in-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="Bell" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{t('notificationCenter')}</h2>
              <p className="text-xs text-muted-foreground">
                {unreadCount} {t('unreadAlerts')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Actions */}
        {notifications?.length > 0 && (
          <div className="flex items-center gap-2 p-3 border-b border-border bg-muted/30">
            <button
              onClick={markAllAsRead}
              className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {t('markAllRead')}
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {notifications?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Icon name="Bell" size={32} color="var(--color-muted-foreground)" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">{t('noNotifications')}</p>
              <p className="text-xs text-muted-foreground">{t('fraudAlertsAppearHere')}</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications?.map((notification) => {
                const riskColor = getRiskColor(notification?.riskLevel);
                const riskIcon = getRiskIcon(notification?.riskLevel);
                
                return (
                  <div
                    key={notification?.id}
                    className={`p-4 hover:bg-muted/30 transition-colors cursor-pointer ${
                      !notification?.read ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => markAsRead(notification?.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-${riskColor}/10 flex items-center justify-center flex-shrink-0`}>
                        <Icon name={riskIcon} size={20} color={`var(--color-${riskColor})`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-foreground">
                            {notification?.title}
                          </h3>
                          {!notification?.read && (
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {notification?.message}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Icon name="DollarSign" size={12} />
                            {formatCurrency(notification?.amount, notification?.currency)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="MapPin" size={12} />
                            {notification?.country}
                          </span>
                          <span className={`text-${riskColor} font-medium`}>
                            {notification?.riskLevel}% {t('risk')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                          </span>
                          <button
                            onClick={(e) => {
                              e?.stopPropagation();
                              clearNotification(notification?.id);
                            }}
                            className="text-xs text-muted-foreground hover:text-error transition-colors"
                          >
                            {t('dismiss')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationCenter;