import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ProfileSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch user profile data from backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get auth token
        const authToken = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
        
        if (!authToken) {
          setError('Authentication required. Please log in.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        // Get API base URL
        const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

        // Fetch user profile from /profile endpoint
        const response = await axios?.get(
          `${apiBaseUrl}/profile`,
          {
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${authToken}`
            }
          }
        );

        if (response?.data) {
          setFormData({
            full_name: response?.data?.full_name || '',
            email: response?.data?.email || '',
            phone: response?.data?.phone || '',
            company: response?.data?.company || ''
          });
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        
        if (err?.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError('Failed to load profile data. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (successMessage) setSuccessMessage('');
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
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

      // Update profile using PUT /profile
      const response = await axios?.put(
        `${apiBaseUrl}/profile`,
        {
          full_name: formData?.full_name,
          phone: formData?.phone,
          company: formData?.company
        },
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      if (response?.data) {
        setSuccessMessage('Profile updated successfully!');
        // Update form with response data
        setFormData({
          full_name: response?.data?.full_name || '',
          email: response?.data?.email || '',
          phone: response?.data?.phone || '',
          company: response?.data?.company || ''
        });
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      
      if (err?.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
      } else if (err?.response?.data?.detail) {
        setError(`Error: ${err?.response?.data?.detail}`);
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">{t('loadingProfile')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !formData?.email) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="bg-error/10 border border-error/20 rounded-xl p-4 text-center">
          <Icon name="AlertTriangle" size={32} color="var(--color-error)" className="mx-auto mb-2" />
          <p className="text-error font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name="User" size={24} color="var(--color-primary)" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{t('profileInformation')}</h2>
          <p className="text-sm text-muted-foreground">{t('updatePersonalDetails')}</p>
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('fullName')}
            value={formData?.full_name}
            onChange={(e) => handleChange('full_name', e?.target?.value)}
            disabled={isSaving}
            required
          />

          <Input
            type="email"
            label={t('emailAddress')}
            value={formData?.email}
            disabled
            readOnly
            className="bg-muted cursor-not-allowed text-foreground"
          />

          <Input
            type="tel"
            label={t('phoneNumber')}
            value={formData?.phone}
            onChange={(e) => handleChange('phone', e?.target?.value)}
            disabled={isSaving}
          />

          <Input
            label={t('company')}
            value={formData?.company}
            onChange={(e) => handleChange('company', e?.target?.value)}
            disabled={isSaving}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" iconName="Save" loading={isSaving} disabled={isSaving}>
            {isSaving ? t('saving') : t('saveChanges')}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            iconName="X"
            disabled={isSaving}
            onClick={() => window.location?.reload()}
          >
            {t('cancel')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;