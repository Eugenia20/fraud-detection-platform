import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const SecuritySettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
    if (successMessage) setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    // Validate passwords match
    if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      setError('New passwords do not match!');
      return;
    }

    // Validate password length
    if (passwordData?.newPassword?.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setIsChangingPassword(true);
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

      // Change password using PUT /profile/password
      await axios?.put(
        `${apiBaseUrl}/profile/password`,
        {
          current_password: passwordData?.currentPassword,
          new_password: passwordData?.newPassword
        },
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      setSuccessMessage('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Failed to change password:', err);
      
      if (err?.response?.status === 401) {
        setError('Current password is incorrect.');
      } else if (err?.response?.data?.detail) {
        setError(`Error: ${err?.response?.data?.detail}`);
      } else {
        setError('Failed to update password. Please try again.');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    setError(null);

    try {
      // Get auth token
      const authToken = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
      
      if (!authToken) {
        setError('Authentication required. Please log in.');
        return;
      }

      // Get API base URL
      const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

      // Delete account using DELETE /profile
      await axios?.delete(
        `${apiBaseUrl}/profile`,
        {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      // Clear auth data
      sessionStorage.clear();
      localStorage.clear();

      // Redirect to login with success message
      alert('Account deleted successfully.');
      navigate('/login');
    } catch (err) {
      console.error('Failed to delete account:', err);
      
      if (err?.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
      } else if (err?.response?.data?.detail) {
        setError(`Error: ${err?.response?.data?.detail}`);
      } else {
        setError('Failed to delete account. Please try again.');
      }
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-error/10 flex items-center justify-center">
          <Icon name="Lock" size={24} color="var(--color-error)" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{t('securitySettings')}</h2>
          <p className="text-sm text-muted-foreground">{t('managePasswordSecurity')}</p>
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
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <Input
          type="password"
          label={t('currentPassword')}
          value={passwordData?.currentPassword}
          onChange={(e) => handleChange('currentPassword', e?.target?.value)}
          disabled={isChangingPassword}
          required
        />

        <Input
          type="password"
          label={t('newPassword')}
          value={passwordData?.newPassword}
          onChange={(e) => handleChange('newPassword', e?.target?.value)}
          disabled={isChangingPassword}
          required
        />

        <Input
          type="password"
          label={t('confirmNewPassword')}
          value={passwordData?.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e?.target?.value)}
          disabled={isChangingPassword}
          required
        />

        <div className="flex gap-3 pt-4">
          <Button 
            type="submit" 
            iconName="Shield"
            loading={isChangingPassword}
            disabled={isChangingPassword}
          >
            {isChangingPassword ? t('updating') : t('updatePassword')}
          </Button>
        </div>
      </form>
      <div className="border-t border-border pt-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-error/10 flex items-center justify-center flex-shrink-0">
            <Icon name="Trash2" size={24} color="var(--color-error)" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">{t('deleteAccount')}</h3>
            <p className="text-sm text-muted-foreground">{t('deleteAccountWarning')}</p>
          </div>
        </div>

        {!showDeleteConfirm ? (
          <Button 
            type="button" 
            variant="outline"
            iconName="Trash2"
            onClick={() => setShowDeleteConfirm(true)}
            className="border-error text-error hover:bg-error/10"
          >
            {t('deleteAccount')}
          </Button>
        ) : (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4 space-y-4">
            <p className="text-sm font-semibold text-error">{t('deleteAccountConfirm')}</p>
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="default"
                iconName="Trash2"
                onClick={handleDeleteAccount}
                loading={isDeletingAccount}
                disabled={isDeletingAccount}
                className="bg-error hover:bg-error/90"
              >
                {isDeletingAccount ? t('deleting') : t('yesDeleteAccount')}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                iconName="X"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeletingAccount}
              >
                {t('cancel')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecuritySettings;