import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { 
  Briefcase, MessageSquare, ArrowRight, TrendingUp,
  Headphones, CheckCircle2, Circle, Crown, User
} from 'lucide-react';

export default function Dashboard() {
  const { userData, unreadCount } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ jobs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!userData) return;
      try {
        const collectionName = userData.role === 'customer' ? "Jobs" : "Applications";
        const filterField = userData.role === 'customer' ? "customerId" : "workerId";
        const q = query(collection(db, collectionName), where(filterField, "==", userData.uid));
        const snap = await getDocs(q);
        setStats({ jobs: snap.size });
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    fetchStats();
  }, [userData]);

    <div className="min-h-screen bg-[#060812] text-white pb-32">
      {/* Background Orbs */}
      <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 py-8 relative z-10 max-w-2xl space-y-8 animate-fade-in">
        
        {/* --- WELCOME SECTION --- */}
        <section className="flex flex-col gap-6">
          <div className="space-y-1">
            <p className="text-slate-400 font-bold text-lg">Welcome back,</p>
            <h1 className="text-4xl font-black tracking-tight leading-tight">
              {userData.name}! <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm">Here's what's happening with your account today.</p>
          </div>
          
          <div className="flex gap-4">
            <Link to="/profile" className="flex-1 py-4 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl text-base font-black flex items-center justify-center gap-2 shadow-lg shadow-violet-900/20 active:scale-95 transition-all">
              View Profile <ArrowRight size={18} />
            </Link>
            {/* Minimalist Chart Card (Small for mobile) */}
            <div className="w-32 h-14 bg-[#0e1328] border border-white/5 rounded-2xl p-3 flex items-center justify-center overflow-hidden">
               <svg viewBox="0 0 100 40" className="w-full h-full text-violet-400 opacity-60">
                  <path d="M0,35 Q15,10 30,25 T60,15 T100,5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
               </svg>
            </div>
          </div>
        </section>

        {/* --- STATS GRID (Horizontal Cards) --- */}
        <section className="grid grid-cols-1 gap-4">
          {[
            { label: userData.role === 'customer' ? 'Jobs Posted' : 'Jobs Applied', val: stats.jobs, sub: 'Keep applying!', icon: <Briefcase />, color: 'emerald' },
            { label: 'Unread Messages', val: unreadCount, sub: 'No new messages', icon: <MessageSquare />, color: 'blue' },
            { label: 'Account Status', val: 'Active', sub: 'Your account is active', icon: <Crown />, color: 'violet' }
          ].map((s, i) => (
            <div key={i} className="bg-[#0e1328] border border-white/5 rounded-[1.5rem] p-5 flex items-center gap-5 group relative overflow-hidden">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-${s.color}-500 bg-${s.color}-500/10 border border-${s.color}-500/10`}>
                {s.icon}
              </div>
              <div className="flex-1">
                <div className="text-2xl font-black leading-tight mb-0.5">{s.val}</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">{s.label}</p>
                <p className="text-[10px] font-bold text-slate-600">{s.sub}</p>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-${s.color}-500 opacity-20`} />
            </div>
          ))}
        </section>

        {/* --- QUICK ACTIONS --- */}
        <section className="space-y-5">
          <div className="flex justify-between items-end">
            <h3 className="text-xl font-black">Quick Actions</h3>
            <Link to="/jobs" className="text-violet-400 font-bold text-xs uppercase tracking-wider">View All</Link>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-[#0e1328] border border-white/5 rounded-3xl p-6 flex flex-col gap-5 group">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-violet-500 border border-white/5 shadow-inner">
                <Briefcase size={28} />
              </div>
              <div>
                <h4 className="font-black text-lg mb-1">Browse All Jobs</h4>
                <p className="text-slate-500 text-xs font-bold leading-relaxed">Find the perfect project for your skills and expertise.</p>
              </div>
              <Link to="/jobs" className="text-violet-400 font-black text-xs uppercase flex items-center gap-2 tracking-widest">
                Explore Jobs <ArrowRight size={14} />
              </Link>
            </div>

            <div className="bg-[#0e1328] border border-white/5 rounded-3xl p-6 flex flex-col gap-5 group">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-500 border border-white/5 shadow-inner">
                <MessageSquare size={28} />
              </div>
              <div>
                <h4 className="font-black text-lg mb-1">Check Messages</h4>
                <p className="text-slate-500 text-xs font-bold leading-relaxed">Keep up with your active conversations and offers.</p>
              </div>
              <Link to="/messages" className="text-cyan-400 font-black text-xs uppercase flex items-center gap-2 tracking-widest">
                View Messages <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* --- PROFILE COMPLETION --- */}
        <section className="bg-[#0e1328] border border-white/5 p-8 rounded-[2.5rem] space-y-8 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black">Profile Completion</h3>
            <span className="text-[10px] font-black text-slate-500 bg-white/5 px-3 py-1.5 rounded-lg uppercase tracking-widest">Step {filledFields} of 5</span>
          </div>
          
          <div className="flex flex-col gap-8">
            <div className="space-y-6">
              <div className="text-5xl font-black text-violet-500">{pct}%</div>
              
              <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5 p-0.5">
                <div 
                  className="bg-gradient-to-r from-violet-600 to-cyan-500 h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${pct}%` }}
                ></div>
              </div>

              <ul className="space-y-4">
                {[
                  { label: 'Add a professional bio', done: userData.bio },
                  { label: 'Set your location', done: userData.location },
                  { label: 'Add your skills', done: userData.skills }
                ].map((item, i) => (
                  <li key={i} className={`flex items-center gap-4 text-xs font-bold ${item.done ? 'text-slate-600' : 'text-slate-400'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${item.done ? 'border-violet-500/30 text-violet-500' : 'border-slate-800'}`}>
                      {item.done ? <CheckCircle2 size={12} /> : null}
                    </div>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
            
            <button 
              onClick={() => navigate('/profile')}
              className="w-full py-4 bg-white/5 border border-white/10 text-white font-black text-sm rounded-2xl hover:bg-white/10 transition-all active:scale-95"
            >
              Complete Profile &nbsp;→
            </button>
          </div>
        </section>

        {/* --- NEED HELP --- */}
        <section className="bg-[#1e1b4b] p-6 rounded-[2rem] flex flex-col gap-6 text-white shadow-2xl border border-white/5">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shadow-inner">
              <Headphones size={24} className="text-violet-300" />
            </div>
            <div className="flex-1">
              <h4 className="font-black text-lg leading-tight mb-0.5">Need Help?</h4>
              <p className="text-slate-400 text-[10px] font-bold">Our support team is available 24/7 to help you grow.</p>
            </div>
          </div>
          <button className="bg-violet-600 hover:bg-violet-700 w-full py-3.5 rounded-2xl text-xs font-black transition-all shadow-xl shadow-violet-900/50 active:scale-95">
            Contact Support
          </button>
        </section>

      </div>
    </div>
  );
}
