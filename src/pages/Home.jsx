import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Briefcase, Zap, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-24 md:pt-32 md:pb-40 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm mb-8 border border-indigo-100 shadow-sm">
          <Sparkles size={16} />
          <span>The Future of Freelancing is Here</span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
          Find the best <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">talents</span> for your vision.
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-12 leading-relaxed">
          QUUB connects elite creators with visionary clients. A premium marketplace designed for speed, security, and world-class quality.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full sm:w-auto">
          <Link to="/register" className="btn btn-primary w-full sm:w-auto text-lg px-10 py-4 shadow-xl">
            Get Started Now
          </Link>
          <Link to="/login" className="btn btn-secondary w-full sm:w-auto text-lg px-10 py-4">
            Sign In
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-5xl mx-auto">
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 text-left hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6">
              <Briefcase size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Premium Talent</h3>
            <p className="text-slate-500">Only the top 1% of creators and developers join our curated network.</p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 text-left hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center text-white mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Lightning Fast</h3>
            <p className="text-slate-500">Post a job in seconds and get world-class proposals within minutes.</p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 text-left hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Zero Risk</h3>
            <p className="text-slate-500">Advanced protection and secure real-time messaging for every project.</p>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none opacity-50">
        <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-indigo-200 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-cyan-100 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
}
