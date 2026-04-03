import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const HeroSection = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;
    const ctx = canvas?.getContext('2d');
    canvas.width = canvas?.offsetWidth;
    canvas.height = canvas?.offsetHeight;

    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles?.push({
        x: Math.random() * canvas?.width,
        y: Math.random() * canvas?.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    let animId;
    const animate = () => {
      ctx?.clearRect(0, 0, canvas?.width, canvas?.height);
      particles?.forEach((p) => {
        p.x += p?.vx;
        p.y += p?.vy;
        if (p?.x < 0 || p?.x > canvas?.width) p.vx *= -1;
        if (p?.y < 0 || p?.y > canvas?.height) p.vy *= -1;
        ctx?.beginPath();
        ctx?.arc(p?.x, p?.y, p?.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 200, 83, ${p?.opacity})`;
        ctx?.fill();
      });
      // Draw connecting lines
      for (let i = 0; i < particles?.length; i++) {
        for (let j = i + 1; j < particles?.length; j++) {
          const dx = particles?.[i]?.x - particles?.[j]?.x;
          const dy = particles?.[i]?.y - particles?.[j]?.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx?.beginPath();
            ctx?.moveTo(particles?.[i]?.x, particles?.[i]?.y);
            ctx?.lineTo(particles?.[j]?.x, particles?.[j]?.y);
            ctx.strokeStyle = `rgba(0, 200, 83, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx?.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section className="relative min-h-[700px] md:min-h-[800px] flex items-center justify-center px-4 md:px-6 lg:px-8 py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20 -z-10" />

      {/* Animated particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full -z-10 opacity-60"
        style={{ pointerEvents: 'none' }}
      />

      {/* Radial glow behind shield */}
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <div className="w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl animate-pulse" />
      </div>

      {/* Circuit lines decoration */}
      <div className="absolute left-0 top-1/3 w-32 h-px circuit-line opacity-40" />
      <div className="absolute right-0 top-2/3 w-32 h-px circuit-line opacity-40" />
      <div className="absolute top-1/4 left-1/4 w-px h-24 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
      <div className="absolute top-1/3 right-1/4 w-px h-16 bg-gradient-to-b from-transparent via-primary/20 to-transparent" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 glow-green-sm">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs md:text-sm font-medium text-primary tracking-wide uppercase">
            Secure Everything
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
          Protect and monitor{' '}
          <span className="relative">
            <span className="text-primary">financial transactions</span>
          </span>
          <br />
          <span className="text-foreground/80">in real time</span>
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          A fraud detection layer built for financial institutions — combining secure authentication,
          ML-powered risk scoring, and full administrative oversight in one platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => navigate('/register-page')}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-250 glow-green-sm hover:scale-105 active:scale-95"
          >
            Try Free
            <Icon name="ArrowRight" size={16} />
          </button>
          <button
            onClick={() => navigate('/login-page')}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-card border border-border text-foreground font-semibold text-sm hover:border-primary/50 hover:text-primary transition-all duration-250 hover:scale-105 active:scale-95"
          >
            <Icon name="RefreshCw" size={16} />
            Explore
          </button>
        </div>

        {/* Shield Visual */}
        <div className="relative flex items-center justify-center">
          {/* Outer ring */}
          <div className="absolute w-72 h-72 md:w-80 md:h-80 rounded-full border border-primary/10 animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute w-56 h-56 md:w-64 md:h-64 rounded-full border border-primary/15" />

          {/* Floating icons around shield */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 -translate-y-8 w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center shadow-lg">
            <Icon name="Lock" size={18} className="text-primary" />
          </div>
          <div className="absolute top-1/2 -left-8 md:-left-16 -translate-y-1/2 w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center shadow-lg">
            <Icon name="Activity" size={18} className="text-primary" />
          </div>
          <div className="absolute top-1/2 -right-8 md:-right-16 -translate-y-1/2 w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center shadow-lg">
            <Icon name="Database" size={18} className="text-primary" />
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8 w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center shadow-lg">
            <Icon name="Users" size={18} className="text-primary" />
          </div>

          {/* Central shield */}
          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center glow-green">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary/15 to-transparent border border-primary/20 flex items-center justify-center">
              <Icon name="ShieldCheck" size={56} className="text-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;