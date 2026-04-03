import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AuthenticationGuard = ({ children, requiredRole = null }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = () => {
      // Check both sessionStorage and localStorage (localStorage used when rememberMe is checked)
      const authToken = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
      const storedRole = sessionStorage.getItem('userRole') || localStorage.getItem('userRole');

      if (authToken && storedRole) {
        setIsAuthenticated(true);
        setUserRole(storedRole);
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
      
      setIsLoading(false);
    };

    checkAuthentication();
  }, [location]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login-page" state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    const redirectPath = userRole === 'admin' ? '/admin-dashboard' : '/user-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default AuthenticationGuard;