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
    <div className="page-bg min-h-screen pb-28">
      {/* Animated Hero Banner */}
      <div className="relative overflow-hidden" style={{ height: '260px', background: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 40%, #06B6D4 100%)' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          animation: 'gridDrift 20s linear infinite'
        }} />
        {/* Glowing orbs in banner */}
        <div style={{ position: 'absolute', top: '-80px', right: '-60px', width: '240px', height: '240px', background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-40px', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10 animate-fade-in">
        <div className="bg-white rounded-[2.5rem] border border-violet-100/50 shadow-2xl shadow-violet-100/40 overflow-hidden">
          <div className="px-6 md:px-12 pt-10 pb-12">

            {/* Header Row */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-10 pb-10 border-b border-slate-50">
              <div className="relative group">
                <div className="p-1 rounded-[2.5rem]" style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
                  <img src={userData.avatarUrl} alt=""
                    className="w-32 h-32 md:w-36 md:h-36 rounded-[2.25rem] border-4 border-white object-cover shadow-xl" />
                </div>
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                    <Camera className="text-white" size={28} />
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{userData.name}</h1>
                  <ShieldCheck size={24} className="text-violet-600" />
                </div>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-slate-400 font-bold text-sm">
                  <span>@{userData.email.split('@')[0]}</span>
                  <span className="px-3 py-1 rounded-full text-[11px] font-black text-violet-600"
                    style={{ background: 'rgba(124,58,237,0.1)' }}>
                    <Sparkles size={11} className="inline mr-1" />
                    Premium {userData.role}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap justify-center">
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="btn btn-primary rounded-2xl px-7 py-3 shadow-lg">
                    <Edit2 size={17} className="mr-2" /> Edit Profile
                  </button>
                ) : (
                  <>
                    <button onClick={() => setIsEditing(false)} className="btn btn-secondary rounded-2xl px-6 py-3 text-red-500 border-red-100">
                      <X size={17} className="mr-2" /> Cancel
                    </button>
                    <button onClick={handleSave} disabled={loading} className="btn btn-accent rounded-2xl px-7 py-3 shadow-lg">
                      <Check size={17} className="mr-2" /> {loading ? 'Saving...' : 'Save'}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Sidebar */}
              <div className="lg:col-span-4 space-y-8">
                <div className="space-y-5">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">Details</h4>
                  {[
                    { Icon: MapPin, field: 'location', placeholder: 'Your city, Country', display: userData.location || 'Location not set' },
                    { Icon: Briefcase, field: userData.role === 'customer' ? 'company' : 'skills', placeholder: userData.role === 'customer' ? 'Company Name' : 'React, Design, etc.', display: userData.role === 'customer' ? (userData.company || 'Private Client') : (userData.skills || 'No skills listed') },
                    { Icon: Globe, field: 'website', placeholder: 'yourwebsite.com', display: userData.website || 'No website' },
                  ].map(({ Icon, field, placeholder, display }) => (
                    <div key={field} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.1))' }}>
                        <Icon size={18} className="text-violet-600" />
                      </div>
                      {isEditing ? (
                        <input className="form-input text-sm py-2" value={formData[field]}
                          onChange={e => setFormData({ ...formData, [field]: e.target.value })} placeholder={placeholder} />
                      ) : (
                        <span className="text-slate-600 font-semibold text-sm">{display}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Verified Card */}
                <div className="rounded-3xl p-7 text-white relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 50%, #0891B2 100%)' }}>
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.15 }}>
                    <Award size={100} />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck size={20} className="text-cyan-300" />
                    <span className="text-xs font-black uppercase tracking-widest text-cyan-300">Verified</span>
                  </div>
                  <h5 className="font-black text-xl mb-2 leading-tight">Premium Member</h5>
                  <p className="text-white/70 text-sm leading-relaxed">Elite identity and quality verified by our team.</p>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-8 space-y-10">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-300 mb-5">About Me</h4>
                  {isEditing ? (
                    <textarea className="form-input min-h-[180px] leading-relaxed" value={formData.bio}
                      onChange={e => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell the world about your expertise..." />
                  ) : (
                    <p className="text-xl md:text-2xl font-semibold text-slate-600 leading-relaxed italic">
                      "{userData.bio || 'Excellence is not an act, but a habit. I am dedicated to delivering world-class results.'}"
                    </p>
                  )}
                </div>

                {userData.role === 'worker' && userData.skills && (
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-300 mb-5">Skills</h4>
                    <div className="flex flex-wrap gap-3">
                      {userData.skills.split(',').map((s, i) => (
                        <span key={i}
                          className="px-6 py-3 rounded-2xl text-sm font-black border hover:scale-105 transition-transform cursor-default"
                          style={{ background: 'rgba(124,58,237,0.06)', borderColor: 'rgba(124,58,237,0.15)', color: '#7C3AED' }}>
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
