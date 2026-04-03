import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import NavigationBar from './components/NavigationBar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import TrustSignals from './components/TrustSignals';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

const LandingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>BankProtect - AI-Powered Banking Fraud Detection</title>
        <meta
          name="description"
          content="Protect your banking operations with BankProtect's advanced machine learning fraud detection system. Real-time monitoring, 99.8% accuracy, and comprehensive analytics."
        />
        <meta
          name="keywords"
          content="fraud detection, banking security, machine learning, transaction monitoring, financial security"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <NavigationBar />
        
        <main className="pt-16 md:pt-18 lg:pt-20">
          <HeroSection />
          <FeaturesSection />
          <TrustSignals />
          <CTASection />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default LandingPage;