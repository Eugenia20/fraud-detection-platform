import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    fraudAlerts: true,
    weeklyReports: false,
    systemUpdates: true
  });

  // Load notifications and preferences from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('fraudNotifications');
    const savedPreferences = localStorage.getItem('notificationPreferences');
    
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
        setUnreadCount(parsed?.filter(n => !n?.read)?.length);
      } catch (e) {
        console.error('Failed to parse notifications:', e);
      }
    }
    
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (e) {
        console.error('Failed to parse preferences:', e);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('fraudNotifications', JSON.stringify(notifications));
  }, [notifications]);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date()?.toISOString(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    return newNotification;
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev?.map(n => 
        n?.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev?.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearNotification = (notificationId) => {
    setNotifications(prev => prev?.filter(n => n?.id !== notificationId));
    const notification = notifications?.find(n => n?.id === notificationId);
    if (notification && !notification?.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const updatePreferences = (newPreferences) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  const triggerEmailNotification = async (notification) => {
    // Only send email if preferences allow it
    if (!preferences?.emailNotifications || !preferences?.fraudAlerts) {
      return;
    }

    try {
      const authToken = sessionStorage.getItem('authToken');
      const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
      
      // This would be your backend endpoint for sending emails
      // For now, we'll just log it since the backend endpoint isn't specified
      console.log('Email notification would be sent:', {
        to: 'user@example.com', // Would come from user profile
        subject: `Fraud Alert: ${notification?.title}`,
        body: notification?.message,
        transactionId: notification?.transactionId,
        riskLevel: notification?.riskLevel
      });
      
      // Uncomment when backend endpoint is ready:
      // await axios.post(
      //   `${apiBaseUrl}/notifications/email`,
      //   {
      //     subject: `Fraud Alert: ${notification.title}`,
      //     message: notification.message,
      //     transactionId: notification.transactionId,
      //     riskLevel: notification.riskLevel
      //   },
      //   {
      //     headers: {
      //       'Authorization': `Bearer ${authToken}`,
      //       'Content-Type': 'application/json'
      //     }
      //   }
      // );
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    preferences,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    updatePreferences,
    triggerEmailNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;