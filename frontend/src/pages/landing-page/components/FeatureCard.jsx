import React from 'react';
import Icon from '../../../components/AppIcon';

const FeatureCard = ({ icon, title, description, gradient }) => {
  return (
    <div className="group relative bg-card border border-border rounded-2xl p-6 md:p-7 lg:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
      
      <div className="relative z-10">
        <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 md:mb-5 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
          <Icon name={icon} size={24} className="text-primary" />
        </div>

        <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-foreground mb-3 md:mb-4">
          {title}
        </h3>

        <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;