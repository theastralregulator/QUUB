import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { 
  Briefcase, MessageSquare, ArrowRight, TrendingUp,
  Headphones, CheckCircle2, Circle, Crown
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

  if (!userData) {
    return <div className="min-h-screen bg-[#F8FAFF] flex items-center justify-center font-bold text-slate-400">Loading your space...</div>;
  }

  const fields = ['bio', 'location', 'skills', 'company', 'website'];
  const filledFields = fields.filter(f => userData[f]).length;
  const pct = Math.round((filledFields / fields.length) * 100);

  return (
    <div className="min-h-screen pb-32 md:pb-10 font-sans relative">
      
      {/* Background Blobs for Premium Feel (From Image) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[100px] -z-10"></div>

      <div className="container mx-auto px-6 py-8 max-w-4xl space-y-8 animate-fade-in">
        
        {/* ─── WELCOME SECTION ─── */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="space-y-2 flex-1">
            <h2 className="text-xl font-bold text-slate-400 leading-tight">Welcome back,</h2>
            <h1 className="text-4xl md:text-5xl font-black text-[#1e1b4b] tracking-tight mb-2">
              {userData.name}! <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-slate-400 font-semibold text-lg">Here's what's happening with your account today.</p>
            <div className="pt-6">
              <Link to="/profile" className="btn bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-8 py-4 flex items-center gap-2 shadow-2xl shadow-indigo-200 font-black transition-all hover:-translate-y-1 active:scale-95 text-base">
                View Profile <ArrowRight size={20} />
              </Link>
            </div>
          </div>
          
          {/* Chart Illustration Card */}
          <div className="hidden lg:block w-72 h-52 bg-white rounded-[2.5rem] border border-slate-50 shadow-2xl p-8 relative">
             <div className="absolute top-8 left-8 w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
               <TrendingUp size={24} />
             </div>
             <div className="mt-14 h-full flex items-end">
               <svg viewBox="0 0 100 30" className="w-full h-24 text-indigo-400">
                  <path d="M0,25 Q15,5 30,20 T60,10 T100,5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  <path d="M0,25 Q15,5 30,20 T60,10 T100,5 V30 H0 Z" fill="url(#grad)" opacity="0.1" />
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" />
                      <stop offset="100%" stopColor="white" />
                    </linearGradient>
                  </defs>
               </svg>
             </div>
          </div>
        </div>

        {/* ─── STATS ROW ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm relative overflow-hidden flex flex-col gap-3 group hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
              <Briefcase size={24} />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 leading-none mb-1">{stats.jobs}</div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{userData.role === 'customer' ? 'Jobs Posted' : 'Jobs Applied'}</p>
            </div>
            <p className="text-[11px] font-bold text-slate-300">Keep up the great work!</p>
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-emerald-500 opacity-20"></div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm relative overflow-hidden flex flex-col gap-3 group hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
              <MessageSquare size={24} />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 leading-none mb-1">{unreadCount}</div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unread Messages</p>
            </div>
            <p className="text-[11px] font-bold text-slate-300">Stay connected with clients</p>
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-blue-500 opacity-20"></div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm relative overflow-hidden flex flex-col gap-3 group hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-violet-50 text-violet-500 rounded-2xl flex items-center justify-center">
              <Crown size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 leading-none mb-1">Active</div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Status</p>
            </div>
            <p className="text-[11px] font-bold text-slate-300">Your account is in good standing</p>
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-violet-500 opacity-20"></div>
          </div>
        </div>

        {/* ─── QUICK ACTIONS ─── */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-[#1e1b4b]">Quick Actions</h3>
            <Link to="/jobs" className="text-indigo-600 font-black text-sm hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col gap-5 group hover:border-indigo-100 transition-all hover:shadow-2xl">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-[1.75rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <Briefcase size={32} />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-xl mb-2">Browse All Jobs</h4>
                <p className="text-slate-400 text-sm font-bold leading-relaxed">Find the perfect project for your skills and expertise.</p>
              </div>
              <Link to="/jobs" className="text-indigo-600 font-black text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                Explore Jobs <ArrowRight size={18} />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col gap-5 group hover:border-blue-100 transition-all hover:shadow-2xl">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-[1.75rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <MessageSquare size={32} />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-xl mb-2">Check Messages</h4>
                <p className="text-slate-400 text-sm font-bold leading-relaxed">Keep up with your active conversations and offers.</p>
              </div>
              <Link to="/messages" className="text-blue-600 font-black text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                View Messages <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* ─── PROFILE COMPLETION ─── */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm space-y-8 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-[#1e1b4b]">Profile Completion</h3>
            <span className="text-xs font-black text-slate-400 bg-slate-50 px-4 py-2 rounded-full uppercase tracking-tighter">Step {filledFields} of 5</span>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 space-y-8">
              <div className="text-6xl font-black text-indigo-600">{pct}%</div>
              
              <div className="w-full bg-slate-50 h-4 rounded-full overflow-hidden border border-slate-100 p-1">
                <div 
                  className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${pct}%` }}
                ></div>
              </div>

              <ul className="space-y-5">
                <li className={`flex items-center gap-4 text-base font-bold ${userData.bio ? 'text-slate-300' : 'text-slate-600'}`}>
                  {userData.bio ? <CheckCircle2 size={24} className="text-indigo-400" /> : <Circle size={24} className="text-slate-200" />}
                  Add a professional bio
                </li>
                <li className={`flex items-center gap-4 text-base font-bold ${userData.location ? 'text-slate-300' : 'text-slate-600'}`}>
                  {userData.location ? <CheckCircle2 size={24} className="text-indigo-400" /> : <Circle size={24} className="text-slate-200" />}
                  Set your location
                </li>
                <li className={`flex items-center gap-4 text-base font-bold ${userData.skills ? 'text-slate-300' : 'text-slate-600'}`}>
                  {userData.skills ? <CheckCircle2 size={24} className="text-indigo-400" /> : <Circle size={24} className="text-slate-200" />}
                  Add your skills
                </li>
              </ul>
            </div>
            
            {/* Clipboard Illustration */}
            <div className="hidden lg:block w-56 h-72 bg-indigo-50/50 rounded-[3rem] relative p-8 border border-indigo-100/50">
               <div className="w-full h-48 bg-white rounded-[2rem] shadow-2xl p-6 space-y-3">
                 <div className="w-10 h-10 rounded-full bg-indigo-100 mx-auto mb-2 flex items-center justify-center">
                   <User size={18} className="text-indigo-600" />
                 </div>
                 <div className="h-2.5 w-full bg-slate-100 rounded-full"></div>
                 <div className="h-2.5 w-3/4 bg-slate-50 rounded-full mx-auto"></div>
                 <div className="h-2.5 w-1/2 bg-slate-50 rounded-full mx-auto"></div>
               </div>
               <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-indigo-600 rounded-[1.75rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-200 border-4 border-white">
                 <span className="text-3xl font-black">+</span>
               </div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/profile')}
            className="w-full py-5 bg-indigo-600 text-white font-black text-xl rounded-[2rem] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 active:scale-95 hover:-translate-y-1"
          >
            Complete Profile
          </button>
        </div>

        {/* ─── NEED HELP SECTION ─── */}
        <div className="bg-[#1e1b4b] p-8 rounded-[2.5rem] flex items-center justify-between gap-6 text-white shadow-2xl border border-white/5">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shadow-inner">
              <Headphones size={28} className="text-indigo-300" />
            </div>
            <div>
              <h4 className="font-black text-xl leading-tight mb-1">Need Help?</h4>
              <p className="text-slate-400 text-sm font-bold">Our support team is available 24/7 to help you grow your career.</p>
            </div>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3.5 rounded-2xl text-sm font-black transition-all shadow-xl shadow-indigo-900/50 active:scale-95">
            Contact Support
          </button>
        </div>

      </div>
    </div>
  );
}
