import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, Briefcase, Edit2, Check, X, Camera, Globe, Award, ShieldCheck, Sparkles } from 'lucide-react';

export default function Profile() {
  const { userData, updateProfileData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || '', bio: userData?.bio || '',
    location: userData?.location || '', skills: userData?.skills || '',
    company: userData?.company || '', website: userData?.website || ''
  });

  if (!userData) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  async function handleSave() {
    setLoading(true);
    try { await updateProfileData(formData); setIsEditing(false); }
    catch (e) { console.error(e); }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#060812] text-white pb-32">
      {/* --- Profile Banner --- */}
      <div className="relative h-28 bg-gradient-to-r from-violet-600 to-cyan-500 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="container mx-auto px-6 -mt-14 relative z-10 max-w-2xl animate-fade-in">
        {/* --- Header Card --- */}
        <section className="bg-[#0e1328] border border-white/5 rounded-[2rem] p-6 text-center mb-6 shadow-2xl shadow-black/40">
          <div className="relative w-28 h-28 mx-auto mb-5">
            <div className="w-full h-full rounded-full border-4 border-[#0e1328] bg-[#161b33] overflow-hidden shadow-xl">
              <img src={userData.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=John"} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-1.5 right-1.5 w-6 h-6 bg-emerald-500 border-4 border-[#0e1328] rounded-full shadow-lg"></div>
          </div>
          
          <h1 className="text-2xl font-black mb-1 flex items-center justify-center gap-2">
            {userData.name}
            <div className="bg-violet-500/10 text-violet-400 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-violet-500/20">WORKER</div>
          </h1>
          <p className="text-xs font-bold text-slate-500 mb-6">@{userData.email.split('@')[0]}</p>
          
          <p className="text-slate-400 text-sm italic font-medium leading-relaxed mb-8 px-4">
            "{userData.bio || 'Excellence is not an act, but a habit. I am dedicated to delivering world-class results.'}"
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-slate-500">
               <MapPin size={16} className="text-violet-500" />
               <span className="text-xs font-bold uppercase tracking-widest">{userData.location || 'Location not set'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
               <Globe size={16} className="text-cyan-500" />
               <span className="text-xs font-bold uppercase tracking-widest">{userData.website || 'No website'}</span>
            </div>
          </div>
        </section>

        {/* --- Premium Member Card --- */}
        <section className="bg-gradient-to-br from-[#1e1b4b] to-[#060812] border border-white/10 rounded-[2rem] p-6 mb-6 relative overflow-hidden group shadow-xl">
          <div className="absolute top-[-20%] right-[-10%] opacity-10 group-hover:opacity-20 transition-all">
             <Award size={180} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={18} className="text-cyan-400" />
              <span className="text-[10px] font-black tracking-[0.2em] text-cyan-400 uppercase">Premium Member</span>
            </div>
            <h3 className="text-xl font-black mb-2">Verified Professional</h3>
            <p className="text-slate-400 text-xs font-medium leading-relaxed">
              Elite identity and quality verified by our expert moderation team for high-end projects.
            </p>
          </div>
        </section>

        {/* --- Content Sections --- */}
        <div className="space-y-4 mb-8">
          <div className="bg-[#0e1328] border border-white/5 rounded-3xl p-6">
            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">About Me</h4>
            <p className="text-sm font-medium text-slate-400 leading-relaxed">
              Dedicated professional with a track record of delivering high-quality solutions. Specialized in React development, UI/UX design, and complex problem-solving.
            </p>
          </div>

          <div className="bg-[#0e1328] border border-white/5 rounded-3xl p-6">
            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">Contact Information</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-violet-500 border border-white/5">
                    <User size={18} />
                 </div>
                 <div>
                    <p className="text-[8px] font-black text-slate-600 uppercase">Email Address</p>
                    <p className="text-xs font-bold text-slate-300">{userData.email}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-cyan-500 border border-white/5">
                    <Globe size={18} />
                 </div>
                 <div>
                    <p className="text-[8px] font-black text-slate-600 uppercase">Website / Portfolio</p>
                    <p className="text-xs font-bold text-slate-300">{userData.website || 'Not provided'}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95"
        >
          {isEditing ? <Check size={16} /> : <Edit2 size={16} />}
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>
    </div>
  );
}
