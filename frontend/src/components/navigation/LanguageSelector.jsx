import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../AppIcon';

const LanguageSelector = ({ position = 'topbar' }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n?.language || 'en');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'nl', label: 'Nederlands', flag: '🇳🇱' }
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
      i18n?.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event?.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleLanguageChange = (languageCode) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('preferredLanguage', languageCode);
    i18n?.changeLanguage(languageCode);
    setIsOpen(false);
  };

  const currentLang = languages?.find(lang => lang?.code === currentLanguage);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors duration-250"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="text-xl">{currentLang?.flag}</span>
        <span className="hidden sm:inline text-sm font-medium text-foreground">
          {currentLang?.label}
        </span>
        <Icon 
          name={isOpen ? 'ChevronUp' : 'ChevronDown'} 
          size={16} 
          className="text-muted-foreground"
        />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden animate-slide-up">
          <div className="py-2">
            {languages?.map((language) => (
              <button
                key={language?.code}
                onClick={() => handleLanguageChange(language?.code)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-250
                  ${currentLanguage === language?.code 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-popover-foreground hover:bg-muted'
                  }
                `}
              >
                <span className="text-xl">{language?.flag}</span>
                <span className="font-medium">{language?.label}</span>
                {currentLanguage === language?.code && (
                  <Icon name="Check" size={16} className="ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;