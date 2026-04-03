import React from 'react';
import Icon from '../../../components/AppIcon';

const HowItWorks = () => {
  const steps = [
    {
      icon: 'UserPlus',
      title: 'Register an Account',
      description: 'Create your account with your email and company details.',
    },
    {
      icon: 'KeyRound',
      title: 'Login & Get Token',
      description: 'Authenticate with your credentials for your security.',
    },
    {
      icon: 'Send',
      title: 'Submit a Transaction',
      description: 'Submit transaction data including amount, country, and other attributes.',
    },
    {
      icon: 'AlertTriangle',
      title: 'Receive Fraud Score',
      description: 'Get back a result (fraud or safe) and a score (0–100).',
    },
  ];

  return (
    <section id="how-it-works" className="px-4 md:px-6 lg:px-8 py-16 md:py-20 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-5">
            <Icon name="Workflow" size={14} className="text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">
              How It Works
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            From registration to fraud score
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
            Four steps from account creation to real-time fraud detection results.
          </p>
        </div>

        {/* Steps — asymmetric 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {steps?.map((step, index) => (
            <div
              key={index}
              className="group relative bg-card border border-border rounded-2xl p-7 md:p-8 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden"
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

              <div className="relative z-10 flex gap-5">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon name={step?.icon} size={22} className="text-primary" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step?.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {step?.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
