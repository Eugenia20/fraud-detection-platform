import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section id="security" className="px-4 md:px-6 lg:px-8 py-16 md:py-20 lg:py-24 bg-muted/20">
      <div className="max-w-5xl mx-auto">
        <div className="relative bg-card border border-primary/20 rounded-3xl p-8 md:p-12 lg:p-16 text-center overflow-hidden glow-green">
          {/* Background radial glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-3xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/10 blur-3xl rounded-full" />

          {/* Circuit corner decorations */}
          <div className="absolute top-4 left-4 w-12 h-12 opacity-30">
            <div className="absolute top-0 left-0 w-full h-px bg-primary" />
            <div className="absolute top-0 left-0 w-px h-full bg-primary" />
          </div>
          <div className="absolute top-4 right-4 w-12 h-12 opacity-30">
            <div className="absolute top-0 right-0 w-full h-px bg-primary" />
            <div className="absolute top-0 right-0 w-px h-full bg-primary" />
          </div>
          <div className="absolute bottom-4 left-4 w-12 h-12 opacity-30">
            <div className="absolute bottom-0 left-0 w-full h-px bg-primary" />
            <div className="absolute bottom-0 left-0 w-px h-full bg-primary" />
          </div>
          <div className="absolute bottom-4 right-4 w-12 h-12 opacity-30">
            <div className="absolute bottom-0 right-0 w-full h-px bg-primary" />
            <div className="absolute bottom-0 right-0 w-px h-full bg-primary" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <Icon name="Zap" size={14} className="text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                Get Started
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5 leading-tight">
              Secure your{' '}
              <span className="text-primary">financial operations</span>
            </h2>

            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Register your institution, submit transactions, and get real-time fraud scores — while your admins stay in full control.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/register-page')}
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all duration-250 glow-green-sm hover:scale-105 active:scale-95 w-full sm:w-auto justify-center"
              >
                Create Account
                <Icon name="ArrowRight" size={18} />
              </button>
              <button
                onClick={() => navigate('/login-page')}
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-transparent border border-border text-foreground font-semibold text-base hover:border-primary/50 hover:text-primary transition-all duration-250 hover:scale-105 active:scale-95 w-full sm:w-auto justify-center"
              >
                <Icon name="LogIn" size={18} />
                Sign In
              </button>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Icon name="ShieldCheck" size={15} className="text-primary" />
                <span>Secured authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Activity" size={15} className="text-primary" />
                <span>Real-time ML risk scoring</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Users" size={15} className="text-primary" />
                <span>Full admin oversight</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;