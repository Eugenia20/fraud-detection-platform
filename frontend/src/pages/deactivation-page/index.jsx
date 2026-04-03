import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const DeactivationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg text-center">
          {/* Icon */}
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-error/10 mx-auto mb-6">
            <Icon name="ShieldOff" size={32} className="text-error" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground mb-3">
            Account Deactivated
          </h1>

          {/* Description */}
          <p className="text-muted-foreground mb-2">
            Your account has been deactivated and is currently inactive.
          </p>
          <p className="text-muted-foreground mb-8">
            If you believe this is a mistake or would like to restore access, please contact our support team.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <a
              href="mailto:support@fraudguard.com"
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors duration-200"
            >
              <Icon name="Mail" size={18} />
              Contact Support
            </a>
            <button
              onClick={() => navigate('/login-page')}
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-accent transition-colors duration-200"
            >
              <Icon name="ArrowLeft" size={18} />
              Back to Login
            </button>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Need help?{' '}
          <a
            href="mailto:support@fraudguard.com"
            className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
          >
            support@fraudguard.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default DeactivationPage;
