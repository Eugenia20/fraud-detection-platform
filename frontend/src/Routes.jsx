import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LoginPage from './pages/login-page';
import RegisterPage from './pages/register-page';
import LandingPage from './pages/landing-page';
import UserDashboard from './pages/user-dashboard';
import AddTransactionPage from './pages/add-transaction-page';
import AdminDashboard from './pages/admin-dashboard';
import AnalyticsPage from './pages/analytics-page';
import ProfilePage from './pages/profile-page';
import DeactivationPage from './pages/deactivation-page';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login-page" element={<LoginPage />} />
        <Route path="/register-page" element={<RegisterPage />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/add-transaction-page" element={<AddTransactionPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/deactivation-page" element={<DeactivationPage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
