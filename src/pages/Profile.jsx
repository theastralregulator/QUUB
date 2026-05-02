import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Briefcase, Calendar, Edit2, Check, X, Camera, Globe } from 'lucide-react';

export default function Profile() {
  const { userData, updateProfileData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
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
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
    setLoading(false);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Profile Header / Banner Area */}
        <div className="h-32 bg-gradient-to-r from-[#1dbf73] to-[#19a463]"></div>
        
        <div className="px-6 md:px-10 pb-10">
          <div className="relative flex flex-col md:flex-row items-end md:items-center gap-6 -mt-12 mb-8">
            <div className="relative group">
              <img 
                src={userData.avatarUrl} 
                alt={userData.name} 
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-extrabold text-gray-900">{userData.name}</h1>
              <p className="text-gray-500 font-medium">@{userData.email.split('@')[0]}</p>
            </div>

            <div className="flex gap-3">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-secondary flex items-center gap-2"
                >
                  <Edit2 size={18} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="btn btn-secondary flex items-center gap-2 border-red-200 text-red-500 hover:bg-red-50"
                  >
                    <X size={18} />
                    <span>Cancel</span>
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="btn btn-primary flex items-center gap-2 shadow-md"
                  >
                    <Check size={18} />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Left Column: Stats & Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Information</h4>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin size={18} className="text-[#1dbf73]" />
                  {isEditing ? (
                    <input 
                      className="form-input text-sm p-1"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                      placeholder="City, Country"
                    />
                  ) : (
                    <span>{userData.location || 'Location not set'}</span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <Briefcase size={18} className="text-[#1dbf73]" />
                  {isEditing ? (
                    <input 
                      className="form-input text-sm p-1"
                      value={userData.role === 'customer' ? formData.company : formData.skills}
                      onChange={e => setFormData({...formData, [userData.role === 'customer' ? 'company' : 'skills']: e.target.value})}
                      placeholder={userData.role === 'customer' ? "Company Name" : "Skills (e.g. React, Design)"}
                    />
                  ) : (
                    <span>
                      {userData.role === 'customer' 
                        ? (userData.company || 'Individual Client') 
                        : (userData.skills || 'Skills not listed')}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <Globe size={18} className="text-[#1dbf73]" />
                  {isEditing ? (
                    <input 
                      className="form-input text-sm p-1"
                      value={formData.website}
                      onChange={e => setFormData({...formData, website: e.target.value})}
                      placeholder="website.com"
                    />
                  ) : (
                    <span>{userData.website || 'No website'}</span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Calendar size={18} />
                  <span>Member since {new Date(userData.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase mb-2">Account Type</p>
                <span className="px-3 py-1 rounded-full bg-green-100 text-[#1dbf73] text-xs font-black uppercase">
                  {userData.role}
                </span>
              </div>
            </div>

            {/* Right Column: Bio & Content */}
            <div className="md:col-span-2 space-y-8">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">About Me</h4>
                {isEditing ? (
                  <textarea 
                    className="form-input w-full min-h-[150px]"
                    value={formData.bio}
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed text-lg italic">
                    {userData.bio || "No bio added yet. Tell people about yourself!"}
                  </p>
                )}
              </div>

              {userData.role === 'worker' && !isEditing && userData.skills && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">My Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {userData.skills.split(',').map((skill, i) => (
                      <span key={i} className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-bold text-sm">
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
  );
}
