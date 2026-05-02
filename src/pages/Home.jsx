import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Briefcase, Zap, ShieldCheck, ArrowRight, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen relative flex flex-col items-center">
      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-5 pt-12 pb-16 md:pt-24 md:pb-32 text-center flex flex-col items-center">

        {/* Logo */}
        <div className="animate-bounce-in mb-8">
          <img src="/logo.png" alt="QUUB" className="h-20 md:h-28 w-auto drop-shadow-2xl" />
        </div>

        {/* Badge */}
        <div className="animate-fade-in inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md text-white font-bold text-sm mb-8 border border-white/20 shadow-lg">
          <Sparkles size={16} className="text-yellow-300" />
          <span>The Future of Freelancing</span>
          <Star size={14} className="text-yellow-300 fill-yellow-300" />
        </div>

        {/* Main Heading */}
        <h1 className="animate-fade-in text-5xl md:text-8xl font-black text-white mb-6 tracking-tight leading-[1.05]">
          Connect with
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-purple-300 to-cyan-300">
            Elite Talent
          </span>
        </h1>

        <p className="animate-fade-in text-lg md:text-xl text-white/70 max-w-xl mx-auto mb-10 leading-relaxed font-medium">
          A premium freelance marketplace designed for speed, security, and world-class quality. Zero fees. Infinite possibilities.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in flex flex-col sm:flex-row gap-4 w-full max-w-sm sm:max-w-none sm:justify-center">
          <Link to="/register"
            className="btn btn-primary w-full sm:w-auto text-lg px-10 py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-2 group"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', boxShadow: '0 8px 32px rgba(124,58,237,0.5)' }}
          >
            Get Started
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/login"
            className="btn w-full sm:w-auto text-lg px-10 py-4 rounded-2xl text-white font-bold border border-white/25 hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            Sign In
          </Link>
        </div>

        {/* Floating Stats */}
        <div className="stagger-children grid grid-cols-3 gap-4 mt-16 w-full max-w-md mx-auto">
          {[
            { value: '10K+', label: 'Creators' },
            { value: '$0', label: 'Fees' },
            { value: '24/7', label: 'Support' },
          ].map(({ value, label }) => (
            <div key={label} className="glass-card rounded-3xl p-5 text-center"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)' }}>
              <div className="text-2xl font-black text-white mb-1">{value}</div>
              <div className="text-white/60 text-xs font-bold uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="stagger-children grid grid-cols-1 md:grid-cols-3 gap-5 mt-16 w-full max-w-4xl">
          {[
            { icon: Briefcase, color: '#7C3AED', title: 'Premium Talent', desc: 'Only the top 1% of creators join our curated network.' },
            { icon: Zap, color: '#06B6D4', title: 'Lightning Fast', desc: 'Post a job and receive proposals within minutes.' },
            { icon: ShieldCheck, color: '#10B981', title: 'Zero Risk', desc: 'Advanced protection for every project you run.' },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div key={title}
              className="rounded-3xl p-7 text-left transition-all duration-300 hover:-translate-y-2 cursor-default"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)' }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-5"
                style={{ background: `${color}33`, border: `1px solid ${color}44` }}>
                <Icon size={24} style={{ color }} />
              </div>
              <h3 className="text-xl font-black text-white mb-2">{title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
