import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import ThemeToggle from '../../../components/navigation/ThemeToggle';

const NavigationBar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Security', href: '#security' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18 lg:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center glow-green-sm">
                <Icon name="ShieldCheck" size={20} className="text-primary" />
              </div>
              <span className="text-lg md:text-xl font-bold text-foreground tracking-tight">
                Bank<span className="text-primary">Protect</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks?.map((link, index) => (
                <a
                  key={index}
                  href={link?.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-250 relative group"
                >
                  {link?.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3 md:gap-4">
              <div className="hidden md:flex items-center gap-3">
                <ThemeToggle />
              </div>
              <div className="hidden md:flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="default"
                  onClick={() => navigate('/login-page')}
                  className="text-muted-foreground hover:text-primary"
                >
                  Login
                </Button>
                <Button
                  variant="default"
                  size="default"
                  iconName="ArrowRight"
                  iconPosition="right"
                  onClick={() => navigate('/register-page')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 glow-green-sm"
                >
                  Sign Up
                </Button>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-card border border-border hover:bg-muted transition-colors duration-250"
                aria-label="Toggle mobile menu"
              >
                <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} className="text-foreground" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-16 left-0 right-0 bg-card border-b border-border shadow-lg p-6 animate-slide-up">
            <div className="flex flex-col gap-4 mb-6">
              {navLinks?.map((link, index) => (
                <a
                  key={index}
                  href={link?.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium text-muted-foreground hover:text-primary transition-colors duration-250 py-2 border-b border-border/50"
                >
                  {link?.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3 mb-4">
              <ThemeToggle />
            </div>
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                size="default"
                onClick={() => { navigate('/login-page'); setIsMobileMenuOpen(false); }}
                fullWidth
              >
                Login
              </Button>
              <Button
                variant="default"
                size="default"
                iconName="ArrowRight"
                iconPosition="right"
                onClick={() => { navigate('/register-page'); setIsMobileMenuOpen(false); }}
                fullWidth
                className="bg-primary text-primary-foreground"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationBar;