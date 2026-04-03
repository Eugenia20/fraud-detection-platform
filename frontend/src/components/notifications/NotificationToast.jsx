import React from 'react';
import { Toaster } from 'react-hot-toast';

const NotificationToast = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 5000,
        style: {
          background: 'var(--color-card)',
          color: 'var(--color-foreground)',
          border: '1px solid var(--color-border)',
          borderRadius: '0.75rem',
          padding: '1rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          maxWidth: '400px'
        },
        success: {
          duration: 4000,
          iconTheme: {
            primary: 'var(--color-success)',
            secondary: 'var(--color-card)'
          },
          style: {
            borderLeft: '4px solid var(--color-success)'
          }
        },
        error: {
          duration: 6000,
          iconTheme: {
            primary: 'var(--color-error)',
            secondary: 'var(--color-card)'
          },
          style: {
            borderLeft: '4px solid var(--color-error)'
          }
        },
        loading: {
          duration: Infinity,
          iconTheme: {
            primary: 'var(--color-primary)',
            secondary: 'var(--color-card)'
          }
        }
      }}
    />
  );
};

export default NotificationToast;