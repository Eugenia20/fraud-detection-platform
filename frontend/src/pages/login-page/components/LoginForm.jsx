import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import axios from 'axios';

const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email?.trim()) {
      newErrors.email = t('emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = t('validEmailRequired');
    }

    if (!formData?.password) {
      newErrors.password = t('passwordRequired');
    } else if (formData?.password?.length < 6) {
      newErrors.password = t('passwordMinLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

      const response = await axios?.post(
        `${apiBaseUrl}/login`,
        {
          email: formData?.email,
          password: formData?.password
        },
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      // Store the real access token from backend
      if (response?.data?.access_token) {
        const token = response?.data?.access_token;
        
        // Store token in sessionStorage (or localStorage if rememberMe is checked)
        if (rememberMe) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('userEmail', formData?.email);
        } else {
          sessionStorage.setItem('authToken', token);
          sessionStorage.setItem('userEmail', formData?.email);
        }

        // Determine user role: use is_admin from API response if available, otherwise fallback to email check
        let userRole = 'user';
        if (response?.data?.is_admin === true) {
          userRole = 'admin';
        } else if (response?.data?.role === 'admin') {
          userRole = 'admin';
        } else if (formData?.email?.toLowerCase()?.includes('admin')) {
          userRole = 'admin';
        }

        if (rememberMe) {
          localStorage.setItem('userRole', userRole);
        } else {
          sessionStorage.setItem('userRole', userRole);
        }

        // Navigate based on role
        if (userRole === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        setGeneralError(t('loginFailedNoToken'));
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle different error types
      if (err?.code === 'ECONNABORTED') {
        setGeneralError(t('requestTimeout'));
      } else if (err?.code === 'ERR_NETWORK' || err?.message === 'Network Error') {
        const apiUrl = import.meta.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
        setGeneralError(t('cannotConnectBackend', { apiUrl }));
      } else if (err?.response?.status === 403 && err?.response?.data?.detail === 'Account is inactive') {
        navigate('/deactivation-page');
        return;
      } else if (err?.response?.status === 401 || err?.response?.status === 400) {
        setGeneralError(t('invalidCredentials'));
      } else if (err?.response?.data?.detail) {
        setGeneralError(`${t('error')}: ${err?.response?.data?.detail}`);
      } else if (err?.message) {
        setGeneralError(`${t('connectionError')}: ${err?.message}`);
      } else {
        setGeneralError(t('loginFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {generalError && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-error/10 border border-error/20">
          <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0 mt-0.5" />
          <p className="text-sm text-error">{generalError}</p>
        </div>
      )}
      <Input
        label={t('emailOrUsername')}
        type="email"
        name="email"
        placeholder={t('enterEmail')}
        value={formData?.email}
        onChange={handleInputChange}
        error={errors?.email}
        required
        disabled={isLoading}
      />
      <div className="relative">
        <Input
          label={t('password')}
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder={t('enterPassword')}
          value={formData?.password}
          onChange={handleInputChange}
          error={errors?.password}
          required
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-colors duration-250"
          aria-label={showPassword ? t('hidePassword') : t('showPassword')}
        >
          <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <Checkbox
          label={t('rememberMe')}
          checked={rememberMe}
          onChange={(e) => setRememberMe(e?.target?.checked)}
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => navigate('/forgot-password')}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-250"
          disabled={isLoading}
        >
          {t('forgotPassword')}
        </button>
      </div>
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        iconName="LogIn"
        iconPosition="right"
      >
        {isLoading ? t('signingIn') : t('signIn')}
      </Button>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {t('noAccount')}{' '}
          <button
            type="button"
            onClick={() => navigate('/register-page')}
            className="font-medium text-primary hover:text-primary/80 transition-colors duration-250"
            disabled={isLoading}
          >
            {t('createAccount')}
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;