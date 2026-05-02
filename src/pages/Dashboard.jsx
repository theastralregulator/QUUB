import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Briefcase, MessageSquare, User, ArrowRight, TrendingUp, CheckCircle } from 'lucide-react';

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
    return <div className="container mx-auto px-4 py-8">Loading dashboard...</div>;
  }

  // Calculate profile completion %
  const fields = ['bio', 'location', 'skills', 'company', 'website'];
  const filledFields = fields.filter(f => userData[f]).length;
  const completionPercentage = Math.round((filledFields / fields.length) * 100);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome back, {userData.name}!</h1>
          <p className="text-gray-500 font-medium">Here's what's happening with your account today.</p>
        </div>
        <Link 
          to="/profile" 
          className="flex items-center gap-2 p-1 pr-4 bg-white border border-gray-200 rounded-full hover:shadow-md transition-shadow"
        >
          <img src={userData.avatarUrl} alt="" className="w-10 h-10 rounded-full border border-gray-100" />
          <span className="text-sm font-bold text-gray-700">View Profile</span>
          <ArrowRight size={16} className="text-[#1dbf73]" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Completion */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-[#1dbf73] mb-4">
                <Briefcase size={24} />
              </div>
              <span className="text-3xl font-black text-gray-900 mb-1">{stats.jobs}</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {userData.role === 'customer' ? 'Jobs Posted' : 'Jobs Applied'}
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 mb-4">
                <MessageSquare size={24} />
              </div>
              <span className="text-3xl font-black text-gray-900 mb-1">{unreadCount}</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unread Messages</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500 mb-4">
                <TrendingUp size={24} />
              </div>
              <span className="text-3xl font-black text-gray-900 mb-1">Active</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account Status</span>
            </div>
          </div>

          {/* Quick Actions / Recent Activity Placeholder */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userData.role === 'customer' ? (
                <Link to="/post-job" className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#1dbf73] hover:bg-green-50 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-green-100 text-[#1dbf73] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Post a New Job</p>
                    <p className="text-xs text-gray-500">Hire talented workers for your project.</p>
                  </div>
                </Link>
              ) : (
                <Link to="/jobs" className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#1dbf73] hover:bg-green-50 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-green-100 text-[#1dbf73] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Browse All Jobs</p>
                    <p className="text-xs text-gray-500">Find the perfect project for your skills.</p>
                  </div>
                </Link>
              )}

              <Link to="/messages" className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-400 hover:bg-blue-50 transition-all group">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Check Messages</p>
                  <p className="text-xs text-gray-500">Keep up with your active conversations.</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Completion & Secondary Info */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User size={20} className="text-[#1dbf73]" />
              Profile Completion
            </h3>
            
            <div className="mb-4 flex justify-between items-end">
              <span className="text-3xl font-black text-[#1dbf73]">{completionPercentage}%</span>
              <span className="text-xs font-bold text-gray-400 uppercase">Step {filledFields} of {fields.length}</span>
            </div>

            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-8">
              <div 
                className="bg-[#1dbf73] h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(29,191,115,0.4)]"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className={`flex items-center gap-3 text-sm ${userData.bio ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
                <div className={`w-2 h-2 rounded-full ${userData.bio ? 'bg-gray-300' : 'bg-[#1dbf73]'}`}></div>
                Add a professional bio
              </li>
              <li className={`flex items-center gap-3 text-sm ${userData.location ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
                <div className={`w-2 h-2 rounded-full ${userData.location ? 'bg-gray-300' : 'bg-[#1dbf73]'}`}></div>
                Set your location
              </li>
              <li className={`flex items-center gap-3 text-sm ${userData.skills || userData.company ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
                <div className={`w-2 h-2 rounded-full ${userData.skills || userData.company ? 'bg-gray-300' : 'bg-[#1dbf73]'}`}></div>
                {userData.role === 'customer' ? 'Add company name' : 'Add your skills'}
              </li>
            </ul>

            <button 
              onClick={() => navigate('/profile')}
              className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg"
            >
              Complete Profile
            </button>
          </div>

          <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl text-white shadow-xl">
            <h4 className="font-bold mb-2">Need Help?</h4>
            <p className="text-gray-400 text-sm mb-4">Our support team is available 24/7 to help you grow your business.</p>
            <button className="text-sm font-bold text-[#1dbf73] hover:underline flex items-center gap-1">
              Contact Support <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
