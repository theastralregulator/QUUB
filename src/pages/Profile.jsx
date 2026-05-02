import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Briefcase, Calendar, Edit2, Check, X, Camera, Globe, Award, ShieldCheck } from 'lucide-react';

export default function Profile() {
  const { userData, updateProfileData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    bio: userData?.bio || '',
    location: userData?.location || '',
    skills: userData?.skills || '',
    company: userData?.company || '',
    website: userData?.website || ''
  });

  if (!userData) {
    return <div className="container mx-auto px-4 py-8">Loading profile...</div>;
  }

  async function handleSave() {
    setLoading(true);
    try {
      await updateProfileData(formData);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  return (
    <div className="bg-[#fcfdff] min-h-screen pb-20">
      {/* Premium Hero Banner */}
      <div className="h-64 md:h-80 bg-gradient-to-br from-indigo-700 via-indigo-600 to-cyan-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>

      <div className="container mx-auto px-4 -mt-24 md:-mt-32 relative z-10 animate-fade-in">
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl shadow-indigo-100/50 overflow-hidden">
          
          <div className="px-8 md:px-16 pt-12 pb-16">
            {/* Top Header Row */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-12 border-b border-slate-50 pb-12">
              <div className="relative group">
                <img 
                  src={userData.avatarUrl} 
                  alt="" 
                  className="w-40 h-40 md:w-48 md:h-48 rounded-[3.5rem] border-8 border-white object-cover shadow-2xl"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 rounded-[3.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                    <Camera className="text-white" size={32} />
                  </div>
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{userData.name}</h1>
                  <ShieldCheck size={28} className="text-indigo-600" />
                </div>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-slate-400 font-bold text-sm tracking-widest uppercase">
                  <span>@{userData.email.split('@')[0]}</span>
                  <span className="hidden md:inline">•</span>
                  <div className="px-4 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black">
                    Premium {userData.role}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="btn btn-primary rounded-full px-8 py-4 shadow-lg shadow-indigo-100">
                    <Edit2 size={18} className="mr-2" /> Edit Profile
                  </button>
                ) : (
                  <>
                    <button onClick={() => setIsEditing(false)} className="btn btn-secondary rounded-full px-8">
                      <X size={18} className="mr-2" /> Cancel
                    </button>
                    <button onClick={handleSave} disabled={loading} className="btn btn-accent rounded-full px-8 shadow-lg">
                      <Check size={18} className="mr-2" /> {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Sidebar Info */}
              <div className="lg:col-span-4 space-y-10">
                <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Credentials</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-slate-600 font-medium">
                      <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600">
                        <MapPin size={20} />
                      </div>
                      {isEditing ? (
                        <input className="form-input" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Location" />
                      ) : (
                        <span>{userData.location || 'Global Citizen'}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-slate-600 font-medium">
                      <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600">
                        <Briefcase size={20} />
                      </div>
                      {isEditing ? (
                        <input className="form-input" value={userData.role === 'customer' ? formData.company : formData.skills} onChange={e => setFormData({...formData, [userData.role === 'customer' ? 'company' : 'skills']: e.target.value})} placeholder="Company/Skills" />
                      ) : (
                        <span>{userData.role === 'customer' ? (userData.company || 'Private Client') : (userData.skills || 'Top Talent')}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-slate-600 font-medium">
                      <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600">
                        <Globe size={20} />
                      </div>
                      {isEditing ? (
                        <input className="form-input" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} placeholder="Website" />
                      ) : (
                        <span>{userData.website || 'quub.io/profile'}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-8 rounded-[2.5rem] bg-indigo-600 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
                    <Award size={64} />
                  </div>
                  <h5 className="font-black text-xl mb-2">QUUB Verified</h5>
                  <p className="text-indigo-100 text-sm leading-relaxed">This member has passed our elite identity and quality verification process.</p>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-8 space-y-12">
                <div className="space-y-6">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">About Me</h4>
                  {isEditing ? (
                    <textarea className="form-input min-h-[200px] leading-relaxed" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder="Describe your world-class expertise..." />
                  ) : (
                    <p className="text-2xl font-medium text-slate-600 leading-relaxed italic">
                      "{userData.bio || 'Excellence is not an act, but a habit. I am dedicated to delivering world-class results for elite projects.'}"
                    </p>
                  )}
                </div>

                {userData.role === 'worker' && userData.skills && (
                  <div className="space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">Expertise Area</h4>
                    <div className="flex flex-wrap gap-4">
                      {userData.skills.split(',').map((skill, i) => (
                        <span key={i} className="px-8 py-4 bg-white border border-slate-100 rounded-3xl text-slate-900 font-black text-sm shadow-sm hover:border-indigo-600 hover:text-indigo-600 transition-all cursor-default">
                          {skill.trim()}
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
