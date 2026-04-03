import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const RegisterForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: ''
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.full_name) {
      newErrors.full_name = t('fullNameRequired');
    } else if (formData?.full_name?.length < 2) {
      newErrors.full_name = t('fullNameMinLength');
    }

    if (!formData?.email) {
      newErrors.email = t('emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = t('validEmailRequired');
    }

    if (!formData?.password) {
      newErrors.password = t('passwordRequired');
    } else if (formData?.password?.length < 6) {
      newErrors.password = t('passwordMinLength');
    }

    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = t('confirmPasswordRequired');
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = t('passwordsDoNotMatch');
    }

    if (!formData?.phone) {
      newErrors.phone = t('phoneRequired');
    } else if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/?.test(formData?.phone)) {
      newErrors.phone = t('validPhoneRequired');
    }

    if (!formData?.company) {
      newErrors.company = t('companyRequired');
    } else if (formData?.company?.length < 2) {
      newErrors.company = t('companyMinLength');
    }

    if (!agreeToTerms) {
      newErrors.terms = t('agreeToTermsRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors?.[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
    setGeneralError('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setGeneralError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios?.post(`${API_BASE_URL}/users`, {
        full_name: formData?.full_name,
        email: formData?.email,
        password: formData?.password,
        phone: formData?.phone,
        company: formData?.company
      });

      if (response?.data) {
        setSuccessMessage(t('accountCreatedSuccess'));
        setTimeout(() => {
          navigate('/login-page');
        }, 2000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error?.response?.data?.detail) {
        setGeneralError(error?.response?.data?.detail);
      } else if (error?.response?.status === 400) {
        setGeneralError(t('emailAlreadyRegistered'));
      } else if (error?.message === 'Network Error') {
        setGeneralError(t('networkError'));
      } else {
        setGeneralError(t('registrationFailed'));
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
      {successMessage && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-success/10 border border-success/20">
          <Icon name="CheckCircle" size={20} className="text-success flex-shrink-0 mt-0.5" />
          <p className="text-sm text-success">{successMessage}</p>
        </div>
      )}
      <Input
        label={t('fullName')}
        type="text"
        name="full_name"
        placeholder={t('enterFullName')}
        value={formData?.full_name}
        onChange={handleInputChange}
        error={errors?.full_name}
        required
        disabled={isLoading}
      />
      <Input
        label={t('email')}
        type="email"
        name="email"
        placeholder={t('enterEmail')}
        value={formData?.email}
        onChange={handleInputChange}
        error={errors?.email}
        required
        disabled={isLoading}
      />
      <Input
        label={t('phone')}
        type="tel"
        name="phone"
        placeholder={t('enterPhone')}
        value={formData?.phone}
        onChange={handleInputChange}
        error={errors?.phone}
        required
        disabled={isLoading}
      />
      <Input
        label={t('company')}
        type="text"
        name="company"
        placeholder={t('enterCompany')}
        value={formData?.company}
        onChange={handleInputChange}
        error={errors?.company}
        required
        disabled={isLoading}
      />
      <div className="relative">
        <Input
          label={t('password')}
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder={t('createPassword')}
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
      <div className="relative">
        <Input
          label={t('confirmPassword')}
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          placeholder={t('reenterPassword')}
          value={formData?.confirmPassword}
          onChange={handleInputChange}
          error={errors?.confirmPassword}
          required
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-colors duration-250"
          aria-label={showConfirmPassword ? t('hidePassword') : t('showPassword')}
        >
          <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={20} />
        </button>
      </div>
      <div>
        <Checkbox
          label={
            <span className="text-sm text-muted-foreground">
              {t('agreeToThe')}{' '}
              <button
                type="button"
                className="text-primary hover:text-primary/80 transition-colors duration-250"
              >
                {t('termsOfService')}
              </button>
              {' '}{t('and')}{' '}
              <button
                type="button"
                className="text-primary hover:text-primary/80 transition-colors duration-250"
              >
                {t('privacyPolicy')}
              </button>
            </span>
          }
          checked={agreeToTerms}
          onChange={(e) => {
            setAgreeToTerms(e?.target?.checked);
            if (errors?.terms) {
              setErrors((prev) => ({ ...prev, terms: '' }));
            }
          }}
          disabled={isLoading}
        />
        {errors?.terms && (
          <p className="text-xs text-error mt-1">{errors?.terms}</p>
        )}
      </div>
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        iconName="UserPlus"
        iconPosition="right"
        disabled={isLoading}
      >
        {isLoading ? t('creatingAccount') : t('createAccount')}
      </Button>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {t('alreadyHaveAccount')}{' '}
          <button
            type="button"
            onClick={() => navigate('/login-page')}
            className="font-medium text-primary hover:text-primary/80 transition-colors duration-250"
            disabled={isLoading}
          >
            {t('signIn')}
          </button>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;