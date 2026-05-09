import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, Briefcase, Zap, ShieldCheck, 
  ArrowRight, Star, Home as HomeIcon, MessageSquare, User 
} from 'lucide-react';

export default function Home() {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#060812] text-white font-sans relative overflow-x-hidden pb-24">
      
      {/* --- Premium Header --- */}
      <header className="container mx-auto px-6 h-20 flex justify-between items-center relative z-50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 flex items-center justify-center">
             <img src="/quub-logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-black tracking-wider uppercase">Quub</span>
        </div>
        
        <div className="flex items-center gap-5">
           <div className="flex items-center gap-2 cursor-pointer group">
              <img 
                src={userData?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=John"} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-white/10"
              />
              <div className="w-2 h-2 border-r-2 border-b-2 border-slate-500 rotate-45 group-hover:border-white transition-colors" />
           </div>
           <button className="flex flex-col gap-1.5 cursor-pointer">
             <span className="w-6 h-0.5 bg-white rounded-full"></span>
             <span className="w-6 h-0.5 bg-white rounded-full"></span>
             <span className="w-6 h-0.5 bg-white rounded-full"></span>
           </button>
        </div>
      </header>

      {/* --- Hero Section --- */}
      <section className="relative pt-10 pb-20 px-6 flex flex-col items-center text-center">
        {/* Nebula Background Effects */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-cyan-600/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-8 max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1e1b4b]/40 border border-violet-500/30 text-xs font-bold tracking-wide text-violet-200">
            <Sparkles size={14} className="text-yellow-400" />
            <span>THE FUTURE OF FREELANCING</span>
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
            Connect with<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
              Elite Talent
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-lg leading-relaxed max-w-lg mx-auto">
            A premium freelance marketplace designed for speed, security, and world-class quality.
          </p>

          {/* Perks */}
          <div className="flex justify-center gap-6 text-sm font-bold text-slate-400">
            <div className="flex items-center gap-2">
              <div className="text-violet-500"><ShieldCheck size={18} /></div>
              <span>Zero fees.</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-cyan-500">
                <svg width="24" height="12" viewBox="0 0 36 16" fill="none">
                  <ellipse cx="10" cy="8" rx="10" ry="7" stroke="currentColor" strokeWidth="2"/>
                  <ellipse cx="26" cy="8" rx="10" ry="7" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span>Infinite possibilities.</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4 pt-4">
            <Link to="/register" className="w-full py-5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl text-lg font-black shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
              Get Started <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="w-full py-5 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl text-lg font-black hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              Sign In <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* --- Stats Bar --- */}
      <section className="px-6 mb-8">
        <div className="bg-[#0e1328] border border-white/5 rounded-[2.5rem] p-8 flex justify-between items-center shadow-2xl">
          <div className="flex flex-col items-center gap-2 flex-1 border-r border-white/5">
            <div className="text-violet-500"><User size={24} /></div>
            <div className="text-2xl font-black tracking-tight">10K+</div>
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Creators</div>
          </div>
          <div className="flex flex-col items-center gap-2 flex-1 border-r border-white/5 px-2">
            <div className="text-cyan-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            </div>
            <div className="text-2xl font-black tracking-tight">$0</div>
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Fees</div>
          </div>
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="text-violet-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
            </div>
            <div className="text-2xl font-black tracking-tight">24/7</div>
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Support</div>
          </div>
        </div>
      </section>

      {/* --- Feature List --- */}
      <section className="px-6 space-y-3 mb-12">
        {[
          { icon: <Star />, color: 'violet', title: 'Premium Talent', desc: 'Only the top 1% of creators join our network.' },
          { icon: <Zap />, color: 'cyan', title: 'Lightning Fast', desc: 'Post a job and receive proposals in minutes.' },
          { icon: <ShieldCheck />, color: 'emerald', title: 'Zero Risk', desc: 'Advanced protection for every project you run.' }
        ].map((f, i) => (
          <div key={i} className="bg-[#121833] border border-white/5 rounded-3xl p-5 flex items-center gap-5 group cursor-pointer hover:border-white/10 transition-all">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-${f.color}-500 bg-${f.color}-500/10 border border-${f.color}-500/20 shadow-inner`}>
              {f.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-black text-sm mb-1">{f.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{f.desc}</p>
            </div>
            <div className="text-slate-600 group-hover:text-white transition-colors">
              <ArrowRight size={20} />
            </div>
          </div>
        ))}
      </section>

      {/* --- Trust Bar --- */}
      <section className="px-6 mb-12">
        <div className="bg-[#0e1328] border border-white/5 rounded-[2rem] p-5 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                 {[1, 5, 12].map(id => (
                   <img key={id} src={`https://i.pravatar.cc/40?img=${id}`} className="w-9 h-9 rounded-full border-2 border-[#0e1328]" />
                 ))}
                 <div className="w-9 h-9 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center text-[10px] font-black border-2 border-[#0e1328]">10K+</div>
              </div>
              <div>
                <p className="text-xs font-black text-slate-300">Trusted by 10K+ creators</p>
                <div className="flex items-center gap-1 text-[10px] text-yellow-400">
                  <Star size={10} className="fill-yellow-400" />
                  <Star size={10} className="fill-yellow-400" />
                  <Star size={10} className="fill-yellow-400" />
                  <Star size={10} className="fill-yellow-400" />
                  <Star size={10} className="fill-yellow-400" />
                  <span className="text-slate-500 ml-1">4.9/5</span>
                </div>
              </div>
           </div>
           <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
             <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white">
               <ShieldCheck size={12} />
             </div>
             <div className="text-[10px] font-black leading-tight">
               <span className="block text-white">Secure &</span>
               <span className="block text-white">Verified</span>
             </div>
           </div>
        </div>
      </section>

      {/* --- Bottom Nav --- */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#060812]/80 backdrop-blur-2xl border-t border-white/5 flex justify-around items-center px-4 z-50">
        <Link to="/" className="flex flex-col items-center gap-1.5 text-violet-500">
          <HomeIcon size={24} />
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link to="/jobs" className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-white transition-colors">
          <Briefcase size={24} />
          <span className="text-[10px] font-bold">Jobs</span>
        </Link>
        <Link to="/messages" className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-white transition-colors">
          <MessageSquare size={24} />
          <span className="text-[10px] font-bold">Messages</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-white transition-colors">
          <User size={24} />
          <span className="text-[10px] font-bold">Profile</span>
        </Link>
      </nav>

    </div>
  );
}
