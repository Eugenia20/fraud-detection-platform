import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CredentialsInfo = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const credentials = [
    {
      role: 'User Account',
      email: 'festa@gmail.com',
      password: '123456',
      icon: 'User',
      color: 'text-primary'
    },
    {
      role: 'Admin Account',
      email: 'admin@fraudguard.com',
      password: 'Admin@123',
      icon: 'Shield',
      color: 'text-accent'
    }
  ];

  return (
    <div className="mt-6 md:mt-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors duration-250"
      >
        <div className="flex items-center gap-3">
          <Icon name="Info" size={20} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Demo Credentials</span>
        </div>
        <Icon 
          name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
          size={20} 
          className="text-muted-foreground"
        />
      </button>
      {isExpanded && (
        <div className="mt-3 p-4 md:p-5 rounded-lg bg-card border border-border space-y-4 animate-slide-up">
          <p className="text-sm text-muted-foreground">
            Use these credentials to explore different user roles:
          </p>
          
          {credentials?.map((cred, index) => (
            <div 
              key={index}
              className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-2"
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon name={cred?.icon} size={18} className={cred?.color} />
                <span className="text-sm font-semibold text-foreground">{cred?.role}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Icon name="Mail" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="text-sm font-mono text-foreground break-all">{cred?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Icon name="Key" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">Password</p>
                    <p className="text-sm font-mono text-foreground break-all">{cred?.password}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
            <Icon name="AlertTriangle" size={16} className="text-warning flex-shrink-0 mt-0.5" />
            <p className="text-xs text-warning">
              These are demo credentials for testing purposes only. Never share real credentials.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CredentialsInfo;