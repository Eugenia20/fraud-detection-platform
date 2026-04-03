import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date()?.getFullYear();

  return (
    <footer id="contact" className="bg-card border-t border-border px-4 md:px-6 lg:px-8 py-10 md:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Icon name="ShieldCheck" size={18} className="text-primary" />
              </div>
              <span className="text-lg font-bold text-foreground">
                Bank<span className="text-primary">Protect</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Internal fraud detection layer for financial institutions. Secure authentication,
              real-time risk scoring, and admin monitoring in one platform.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-8 md:gap-12">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Platform</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Features', href: '#features' },
                  { label: 'How It Works', href: '#how-it-works' },
                  { label: 'Security', href: '#security' },
                ]?.map((link, i) => (
                  <li key={i}>
                    <a href={link?.href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-250">
                      {link?.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Account</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Login', action: () => navigate('/login-page') },
                  { label: 'Register', action: () => navigate('/register-page') },
                  { label: 'Dashboard', action: () => navigate('/user-dashboard') },
                ]?.map((link, i) => (
                  <li key={i}>
                    <button onClick={link?.action} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-250">
                      {link?.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {currentYear} BankProtect. Fraud detection simulation platform.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="ShieldCheck" size={12} className="text-primary" />
            <span>Secured with JWT authentication</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;