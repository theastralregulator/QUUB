import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { 
  Briefcase, MessageSquare, ArrowRight, Bell, ChevronDown, 
  Search, Headphones, CheckCircle2, Circle, LayoutDashboard, User, TrendingUp
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
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    fetchStats();
  }, [userData]);

  if (!userData) {
    return <div className="min-h-screen bg-[#F8FAFF] flex items-center justify-center font-bold text-slate-400">Loading your space...</div>;
  }

  // Calculate profile completion %
  const fields = ['bio', 'location', 'skills', 'company', 'website'];
  const filledFields = fields.filter(f => userData[f]).length;
  const completionPercentage = Math.round((filledFields / fields.length) * 100);

  return (
    <div className="min-h-screen bg-[#F8FAFF] pb-32 md:pb-10 font-sans">
      
      {/* ─── CUSTOM HEADER (Matches Image) ─── */}
      <header className="bg-white px-6 py-4 flex justify-between items-center border-b border-slate-50 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold text-[#1e1b4b]">Quub.</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell size={24} className="text-slate-400" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-1 pr-3 rounded-full border border-slate-100">
            <img src={userData.avatarUrl} alt="" className="w-8 h-8 rounded-full border border-white" />
            <span className="text-sm font-bold text-slate-700 hidden sm:inline">{userData.name}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8 animate-fade-in">
        
        {/* ─── WELCOME SECTION ─── */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative">
          <div className="space-y-2">
            <h2 className="text-2xl font-medium text-slate-500 leading-tight">Welcome back,</h2>
            <h1 className="text-4xl md:text-5xl font-black text-[#1e1b4b] tracking-tight">
              {userData.name}! <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg pt-2">Here's what's happening with your account today.</p>
            <div className="pt-4">
              <Link to="/profile" className="btn bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-8 py-3.5 flex items-center gap-2 shadow-xl shadow-indigo-100 font-bold transition-all hover:-translate-y-0.5 active:scale-95">
                View Profile <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          
          {/* Decorative Graph Box (From Image) */}
          <div className="hidden lg:block w-64 h-48 bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 relative">
             <div className="absolute top-6 left-6 w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
               <TrendingUp size={20} />
             </div>
             <div className="mt-12">
               <svg viewBox="0 0 100 30" className="w-full h-full text-indigo-400">
                  <path d="M0,25 Q20,10 40,20 T80,5 T100,15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <path d="M0,25 Q20,10 40,20 T80,5 T100,15 V30 H0 Z" fill="url(#gradient)" opacity="0.1" />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" />
                      <stop offset="100%" stopColor="white" />
                    </linearGradient>
                  </defs>
               </svg>
             </div>
          </div>
        </div>

        {/* ─── STATS ROW ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden flex flex-col gap-2">
            <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-1">
              <Briefcase size={24} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{stats.jobs}</span>
              <span className="text-sm font-bold text-slate-400">{userData.role === 'customer' ? 'Jobs Posted' : 'Jobs Applied'}</span>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Keep applying!</p>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 opacity-20"></div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden flex flex-col gap-2">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-1">
              <MessageSquare size={24} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{unreadCount}</span>
              <span className="text-sm font-bold text-slate-400">Unread Messages</span>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">No new messages</p>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 opacity-20"></div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden flex flex-col gap-2">
            <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-1">
              <TrendingUp size={24} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">Active</span>
              <span className="text-sm font-bold text-slate-400">Account Status</span>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Your account is active</p>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500 opacity-20"></div>
          </div>
        </div>

        {/* ─── QUICK ACTIONS ─── */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-[#1e1b4b]">Quick Actions</h3>
            <Link to="/jobs" className="text-indigo-600 font-bold text-sm">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-4 group hover:border-indigo-100 transition-all">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-[1.5rem] flex items-center justify-center">
                <Briefcase size={28} />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-lg mb-1">Browse All Jobs</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">Find the perfect project for your skills and expertise.</p>
              </div>
              <Link to="/jobs" className="text-indigo-600 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                Explore Jobs <ArrowRight size={16} />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-4 group hover:border-blue-100 transition-all">
              <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-[1.5rem] flex items-center justify-center">
                <MessageSquare size={28} />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-lg mb-1">Check Messages</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">Keep up with your active conversations.</p>
              </div>
              <Link to="/messages" className="text-blue-600 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                View Messages <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* ─── PROFILE COMPLETION (Matches Image) ─── */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-[#1e1b4b]">Profile Completion</h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-tighter">Step {filledFields} of 5</span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 space-y-6">
              <div className="text-5xl font-black text-indigo-600">{completionPercentage}%</div>
              
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-1000 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>

              <ul className="space-y-4">
                <li className={`flex items-center gap-3 text-sm font-bold ${userData.bio ? 'text-slate-300 line-through' : 'text-slate-600'}`}>
                  {userData.bio ? <CheckCircle2 size={20} className="text-indigo-400" /> : <Circle size={20} className="text-slate-200" />}
                  Add a professional bio
                </li>
                <li className={`flex items-center gap-3 text-sm font-bold ${userData.location ? 'text-slate-300 line-through' : 'text-slate-600'}`}>
                  {userData.location ? <CheckCircle2 size={20} className="text-indigo-400" /> : <Circle size={20} className="text-slate-200" />}
                  Set your location
                </li>
                <li className={`flex items-center gap-3 text-sm font-bold ${userData.skills ? 'text-slate-300 line-through' : 'text-slate-600'}`}>
                  {userData.skills ? <CheckCircle2 size={20} className="text-indigo-400" /> : <Circle size={20} className="text-slate-200" />}
                  Add your skills
                </li>
              </ul>
            </div>
            
            {/* Illustration (From Image) */}
            <div className="hidden md:block w-48 h-64 bg-indigo-50/50 rounded-[2rem] relative p-6 border border-indigo-50">
               <div className="w-full h-40 bg-white rounded-2xl shadow-lg p-4 space-y-2">
                 <div className="w-8 h-8 rounded-full bg-indigo-100 mx-auto"></div>
                 <div className="h-2 w-3/4 bg-slate-100 rounded mx-auto"></div>
                 <div className="h-2 w-1/2 bg-slate-50 rounded mx-auto"></div>
                 <div className="h-2 w-2/3 bg-slate-50 rounded mx-auto"></div>
               </div>
               <div className="absolute bottom-4 right-4 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                 <span className="text-2xl font-bold">+</span>
               </div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/profile')}
            className="w-full py-4 bg-indigo-600 text-white font-black text-lg rounded-2xl hover:bg-indigo-700 transition-colors shadow-xl shadow-indigo-100 active:scale-95"
          >
            Complete Profile
          </button>
        </div>

        {/* ─── NEED HELP SECTION (Bottom Bar) ─── */}
        <div className="bg-[#1e1b4b] p-6 rounded-[2rem] flex items-center justify-between gap-4 text-white shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <Headphones size={24} className="text-indigo-300" />
            </div>
            <div>
              <h4 className="font-bold text-lg leading-tight">Need Help?</h4>
              <p className="text-slate-400 text-xs font-medium">Our support team is available 24/7 to help you grow your career.</p>
            </div>
          </div>
          <button className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2 rounded-xl text-xs font-black transition-colors">
            Contact Support
          </button>
        </div>

      </div>
    </div>
  );
}
