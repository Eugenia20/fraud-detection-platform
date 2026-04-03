import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityFeatures = () => {
  const features = [
    {
      icon: 'Shield',
      title: 'Bank-Grade Security',
      description: 'Enterprise-level encryption and security protocols'
    },
    {
      icon: 'Lock',
      title: 'Secure Authentication',
      description: 'JWT token-based authentication system'
    },
    {
      icon: 'Eye',
      title: 'Real-Time Monitoring',
      description: 'Continuous fraud detection and alerts'
    },
    {
      icon: 'CheckCircle',
      title: 'Compliance Ready',
      description: 'Meets international banking standards'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
      {features?.map((feature, index) => (
        <div
          key={index}
          className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50 hover:bg-card hover:border-border transition-all duration-250"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
            <Icon name={feature?.icon} size={20} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground mb-1">
              {feature?.title}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {feature?.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SecurityFeatures;