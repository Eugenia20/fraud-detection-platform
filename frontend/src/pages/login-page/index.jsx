import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';

import ThemeToggle from '../../components/navigation/ThemeToggle';
import LanguageSelector from '../../components/navigation/LanguageSelector';
import LoginForm from './components/LoginForm';
import CredentialsInfo from './components/CredentialsInfo';
import SecurityFeatures from './components/SecurityFeatures';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = sessionStorage.getItem('authToken');
    const userRole = sessionStorage.getItem('userRole');

    if (authToken && userRole) {
      if (userRole === 'admin') {
        navigate('/system-stats');
      } else {
        navigate('/user-dashboard');
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
        <LanguageSelector />
        <ThemeToggle />
      </div>
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1 space-y-6 md:space-y-8">
              <div className="text-center lg:text-left">
                <button
                  onClick={() => navigate('/landing-page')}
                  className="inline-flex items-center gap-2 mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors duration-250"
                >
                  <Icon name="ArrowLeft" size={16} />
                  <span>Back to Home</span>
                </button>

                <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10">
                    <Icon name="Shield" size={28} className="text-primary" />
                  </div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                    FraudGuard
                  </h1>
                </div>

                <p className="text-base md:text-lg text-muted-foreground mb-2">
                  Welcome Back
                </p>
                <p className="text-sm text-muted-foreground">
                  Sign in to access your fraud detection dashboard
                </p>
              </div>

              <div className="hidden lg:block">
                <SecurityFeatures />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="w-full max-w-md mx-auto bg-card rounded-2xl border border-border shadow-lg p-6 md:p-8">
                <div className="mb-6 md:mb-8">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                    Sign In
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Enter your credentials to access your account
                  </p>
                </div>

                <LoginForm />

                <CredentialsInfo />

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Icon name="Lock" size={14} />
                    <span>Secured by 256-bit SSL encryption</span>
                  </div>
                </div>
              </div>

              <div className="lg:hidden mt-6">
                <SecurityFeatures />
              </div>
            </div>
          </div>

          <div className="mt-12 md:mt-16 text-center">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs text-muted-foreground">
              <button className="hover:text-foreground transition-colors duration-250">
                Privacy Policy
              </button>
              <span className="hidden sm:inline">•</span>
              <button className="hover:text-foreground transition-colors duration-250">
                Terms of Service
              </button>
              <span className="hidden sm:inline">•</span>
              <button className="hover:text-foreground transition-colors duration-250">
                Help Center
              </button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              © {new Date()?.getFullYear()} BankProtect. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;