import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../../contexts/NotificationContext';
import axios from 'axios';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { preferences, updatePreferences } = useNotifications();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleToggle = (field) => {
    updatePreferences({ [field]: !preferences?.[field] });
    if (error) setError(null);
    if (successMessage) setSuccessMessage('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage('');

    try {
      // Get auth token
      const authToken = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
      
      if (!authToken) {
        setError('Authentication required. Please log in.');
        return;
      }

      // Get API base URL
      const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

      // Save notification preferences using PUT /profile
      await axios?.put(
        `${apiBaseUrl}/profile`,
        {
          email_notifications: preferences?.emailNotifications,
          fraud_alerts: preferences?.fraudAlerts,
          weekly_reports: preferences?.weeklyReports,
          system_updates: preferences?.systemUpdates
        },
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      setSuccessMessage(t('notificationSettingsSaved') || 'Notification preferences saved successfully!');
    } catch (err) {
      console.error('Failed to save notification preferences:', err);
      
      if (err?.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
      } else if (err?.response?.data?.detail) {
        setError(`Error: ${err?.response?.data?.detail}`);
      } else {
        setError('Failed to save preferences. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
          <Icon name="Bell" size={24} color="var(--color-warning)" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{t('notificationPreferences')}</h2>
          <p className="text-sm text-muted-foreground">{t('chooseNotifications')}</p>
        </div>
      </div>

      {successMessage && (
        <div className="mb-4 flex items-start gap-3 p-4 rounded-lg bg-success/10 border border-success/20">
          <Icon name="CheckCircle" size={20} className="text-success flex-shrink-0 mt-0.5" />
          <p className="text-sm text-success">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-start gap-3 p-4 rounded-lg bg-error/10 border border-error/20">
          <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0 mt-0.5" />
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="text-sm font-medium text-foreground">{t('emailNotifications')}</p>
            <p className="text-xs text-muted-foreground">{t('receiveEmailUpdates')}</p>
          </div>
          <input
            type="checkbox"
            checked={preferences?.emailNotifications}
            onChange={() => handleToggle('emailNotifications')}
            disabled={isSaving}
            className="h-5 w-5 rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="text-sm font-medium text-foreground">{t('fraudAlerts')}</p>
            <p className="text-xs text-muted-foreground">{t('notifySuspiciousActivity')}</p>
          </div>
          <input
            type="checkbox"
            checked={preferences?.fraudAlerts}
            onChange={() => handleToggle('fraudAlerts')}
            disabled={isSaving}
            className="h-5 w-5 rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="text-sm font-medium text-foreground">{t('weeklyReports')}</p>
            <p className="text-xs text-muted-foreground">{t('receiveWeeklySummary')}</p>
          </div>
          <input
            type="checkbox"
            checked={preferences?.weeklyReports}
            onChange={() => handleToggle('weeklyReports')}
            disabled={isSaving}
            className="h-5 w-5 rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="text-sm font-medium text-foreground">{t('systemUpdates')}</p>
            <p className="text-xs text-muted-foreground">{t('importantSystemAnnouncements')}</p>
          </div>
          <input
            type="checkbox"
            checked={preferences?.systemUpdates}
            onChange={() => handleToggle('systemUpdates')}
            disabled={isSaving}
            className="h-5 w-5 rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-6">
        <Button 
          onClick={handleSave} 
          iconName="Save"
          loading={isSaving}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : t('savePreferences')}
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings;