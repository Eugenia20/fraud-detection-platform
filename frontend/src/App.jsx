import React from 'react';

import Routes from './Routes';
import ErrorBoundary from './components/ErrorBoundary';
import { NotificationProvider } from './contexts/NotificationContext';
import NotificationToast from './components/notifications/NotificationToast';
import './styles/tailwind.css';
import './styles/index.css';

function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <NotificationToast />
        <Routes />
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;
