import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  }

  if (!userData) {
    return <div className="container" style={{ paddingTop: '2rem' }}>Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto px-4 animate-fade-in py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <div className="flex gap-3 w-full sm:w-auto">
          {userData.role === 'customer' && (
            <Link to="/post-job" className="btn btn-primary flex-1 sm:flex-none text-center shadow-sm">Post a New Job</Link>
          )}
        </div>
      </div>

      <div className="card shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <img 
            src={userData.avatarUrl} 
            alt="Profile Avatar" 
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shadow-sm"
          />
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{userData.name}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">{userData.email}</span>
              <span className="px-3 py-1 rounded-full bg-green-50 text-[#1dbf73] text-xs font-bold uppercase tracking-wider">
                {userData.role}
              </span>
            </div>
          </div>
        </div>
        
        <div className="h-px bg-gray-100 my-6"></div>

        <p className="text-gray-600">
          {userData.role === 'worker' 
            ? "Welcome to your worker dashboard! Soon you'll be able to manage your portfolio and apply for jobs." 
            : "Welcome to your customer dashboard! Soon you'll be able to post new projects and hire talented workers."}
        </p>
      </div>
    </div>
  );
}
