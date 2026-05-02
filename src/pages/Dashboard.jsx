import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import {
  Briefcase, MessageSquare, ArrowRight, Crown,
  CheckCircle2, Circle, HeadphonesIcon, TrendingUp
} from 'lucide-react';

export default function Dashboard() {
  const { userData, unreadCount, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ jobs: 0 });

  useEffect(() => {
    if (!userData) return;
    async function fetchStats() {
      try {
        const col = userData.role === 'customer' ? 'Jobs' : 'Applications';
        const field = userData.role === 'customer' ? 'customerId' : 'workerId';
        const snap = await getDocs(query(collection(db, col), where(field, '==', userData.uid)));
        setStats({ jobs: snap.size });
      } catch (e) { console.error(e); }
    }
    fetchStats();
  }, [userData]);

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5FF]">
        <div className="w-10 h-10 rounded-full border-4 border-violet-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  const fields = ['bio', 'location', 'skills', 'company', 'website'];
  const filled = fields.filter(f => userData[f]).length;
  const pct = Math.round((filled / fields.length) * 100);

  const completionItems = [
    { label: 'Add a professional bio', done: !!userData.bio },
    { label: 'Set your location', done: !!userData.location },
    { label: userData.role === 'customer' ? 'Add company name' : 'Add your skills', done: !!(userData.skills || userData.company) },
  ];

  return (
    <div className="min-h-screen pb-28 md:pb-10" style={{ background: '#F5F5FF' }}>

      {/* ─── Welcome Banner ─── */}
      <div className="mx-4 mt-5 md:mx-auto md:max-w-2xl">
        <div className="rounded-[2rem] overflow-hidden relative animate-fade-in"
          style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 60%, #DDD6FE 100%)', minHeight: '160px' }}>
          {/* Illustration placeholder top-right */}
          <div className="absolute top-4 right-4 w-32 h-24 md:w-40 md:h-28 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)' }}>
            <TrendingUp size={40} className="text-violet-400" />
          </div>

          <div className="p-7 pr-36 md:pr-44">
            <p className="text-slate-600 text-base font-semibold mb-1">Welcome back,</p>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-1">
              {userData.name}! <span>👋</span>
            </h1>
            <p className="text-slate-500 text-sm mb-5 font-medium">Here's what's happening with your account today.</p>
            <Link to="/profile"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-sm font-bold transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', boxShadow: '0 6px 20px rgba(124,58,237,0.35)' }}>
              View Profile <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Stats Row ─── */}
      <div className="px-4 mt-5 md:mx-auto md:max-w-2xl">
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              icon: Briefcase, iconBg: 'rgba(16,185,129,0.12)', iconColor: '#10B981',
              value: stats.jobs, label: userData.role === 'customer' ? 'Jobs Posted' : 'Jobs Applied',
              sub: stats.jobs === 0 ? 'Get started!' : 'Keep going!', barColor: '#10B981'
            },
            {
              icon: MessageSquare, iconBg: 'rgba(99,102,241,0.12)', iconColor: '#6366F1',
              value: unreadCount, label: 'Unread Msgs',
              sub: unreadCount === 0 ? 'No new msgs' : 'Check inbox', barColor: '#6366F1'
            },
            {
              icon: Crown, iconBg: 'rgba(139,92,246,0.12)', iconColor: '#8B5CF6',
              value: 'Active', label: 'Status',
              sub: 'Account active', barColor: '#8B5CF6'
            },
          ].map(({ icon: Icon, iconBg, iconColor, value, label, sub, barColor }) => (
            <div key={label} className="bg-white rounded-[1.5rem] p-4 shadow-sm border border-slate-100 flex flex-col gap-2 relative overflow-hidden animate-fade-in">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-1" style={{ background: iconBg }}>
                <Icon size={18} style={{ color: iconColor }} />
              </div>
              <div className="text-xl md:text-2xl font-black text-slate-900 leading-none">{value}</div>
              <div className="text-[11px] font-black text-slate-700 leading-tight">{label}</div>
              <div className="text-[10px] text-slate-400 font-semibold">{sub}</div>
              {/* Bottom bar accent */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: barColor, opacity: 0.4 }} />
            </div>
          ))}
        </div>
      </div>

      {/* ─── Quick Actions ─── */}
      <div className="px-4 mt-7 md:mx-auto md:max-w-2xl animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-black text-slate-900">Quick Actions</h2>
          <Link to="/jobs" className="text-sm font-bold text-violet-600 hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {/* Browse Jobs */}
          <div className="bg-white rounded-[1.75rem] p-5 border border-slate-100 shadow-sm flex flex-col gap-3 hover:-translate-y-1 transition-all duration-200">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)' }}>
              <Briefcase size={22} className="text-indigo-600" />
            </div>
            <div>
              <p className="font-black text-slate-900 text-sm leading-tight mb-1">
                {userData.role === 'customer' ? 'Post a Job' : 'Browse All Jobs'}
              </p>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">
                {userData.role === 'customer' ? 'Hire talented workers for your project.' : 'Find the perfect project for your skills.'}
              </p>
            </div>
            <Link to={userData.role === 'customer' ? '/post-job' : '/jobs'}
              className="inline-flex items-center gap-1.5 text-violet-600 font-bold text-xs hover:gap-2.5 transition-all">
              {userData.role === 'customer' ? 'Post Job' : 'Explore Jobs'} <ArrowRight size={14} />
            </Link>
          </div>

          {/* Check Messages */}
          <div className="bg-white rounded-[1.75rem] p-5 border border-slate-100 shadow-sm flex flex-col gap-3 hover:-translate-y-1 transition-all duration-200">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
              <MessageSquare size={22} className="text-violet-600" />
            </div>
            <div>
              <p className="font-black text-slate-900 text-sm leading-tight mb-1">Check Messages</p>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">Keep up with your active conversations.</p>
            </div>
            <Link to="/messages"
              className="inline-flex items-center gap-1.5 text-violet-600 font-bold text-xs hover:gap-2.5 transition-all">
              View Messages <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Profile Completion ─── */}
      <div className="px-4 mt-7 md:mx-auto md:max-w-2xl animate-fade-in">
        <div className="bg-white rounded-[1.75rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden">
          {/* Illustration */}
          <div className="absolute right-5 top-5 opacity-20 hidden sm:block">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
              <CheckCircle2 size={40} className="text-white" />
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-900">Profile Completion</h2>
            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl">
              Step {filled} of {fields.length}
            </span>
          </div>

          <div className="text-4xl font-black text-violet-600 mb-3">{pct}%</div>

          {/* Progress bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-5">
            <div className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #7C3AED, #06B6D4)' }} />
          </div>

          {/* Checklist */}
          <ul className="space-y-3 mb-6">
            {completionItems.map(({ label, done }) => (
              <li key={label} className="flex items-center gap-3 text-sm">
                {done ? (
                  <CheckCircle2 size={20} className="text-violet-500 flex-shrink-0" />
                ) : (
                  <Circle size={20} className="text-slate-300 flex-shrink-0" />
                )}
                <span className={`font-semibold ${done ? 'line-through text-slate-300' : 'text-slate-600'}`}>
                  {label}
                </span>
              </li>
            ))}
          </ul>

          <button onClick={() => navigate('/profile')}
            className="w-full py-4 rounded-2xl text-white font-black text-base transition-all active:scale-98 hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', boxShadow: '0 6px 24px rgba(124,58,237,0.3)' }}>
            Complete Profile
          </button>
        </div>
      </div>

      {/* ─── Need Help ─── */}
      <div className="px-4 mt-5 md:mx-auto md:max-w-2xl animate-fade-in">
        <div className="rounded-[1.75rem] p-6 flex items-center justify-between gap-4"
          style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.1)' }}>
              <HeadphonesIcon size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-white text-base mb-0.5">Need Help?</h3>
              <p className="text-white/50 text-xs font-semibold">Our support team is available 24/7 to help you grow your career.</p>
            </div>
          </div>
          <button className="bg-white text-slate-900 font-black text-xs px-4 py-2.5 rounded-xl flex-shrink-0 hover:bg-slate-100 transition-colors whitespace-nowrap">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
