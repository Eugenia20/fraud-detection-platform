import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustBadges = [
    {
      icon: 'Shield',
      title: 'Bank-Grade Security',
      description: 'ISO 27001 Certified'
    },
    {
      icon: 'Lock',
      title: 'Data Encryption',
      description: 'AES-256 Encryption'
    },
    {
      icon: 'CheckCircle',
      title: 'PCI DSS Compliant',
      description: 'Level 1 Certified'
    },
    {
      icon: 'Award',
      title: 'SOC 2 Type II',
      description: 'Audited & Verified'
    }
  ];

  return (
    <section className="px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-12 lg:mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4">
            Trusted by Leading Financial Institutions
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Our fraud detection system meets the highest security and compliance standards 
            in the banking industry.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7 lg:gap-8">
          {trustBadges?.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 md:p-7 lg:p-8 bg-card border border-border rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-success/10 flex items-center justify-center mb-4 md:mb-5">
                <Icon name={badge?.icon} size={28} className="text-success" />
              </div>
              <h3 className="text-base md:text-lg lg:text-xl font-semibold text-foreground mb-2">
                {badge?.title}
              </h3>
              <p className="text-xs md:text-sm lg:text-base text-muted-foreground">
                {badge?.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-14 lg:mt-16 text-center">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-10 lg:gap-12 opacity-60">
            {['Bank A', 'Bank B', 'Bank C', 'Bank D', 'Bank E']?.map((bank, index) => (
              <div key={index} className="text-lg md:text-xl lg:text-2xl font-semibold text-muted-foreground">
                {bank}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;