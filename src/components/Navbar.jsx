import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Briefcase, LayoutDashboard, PlusCircle, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { currentUser, userData, unreadCount, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (['/login', '/register', '/'].includes(location.pathname)) {
    return null;
  }

  if (!currentUser) return null;

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const linkStyle = (path) => `flex flex-col md:flex-row items-center gap-1 md:gap-2 p-2 rounded-md transition-colors font-medium ${
    location.pathname.includes(path) 
      ? 'text-[#1dbf73] md:bg-green-50' 
      : 'text-gray-500 md:text-gray-600 hover:text-[#1dbf73] md:hover:bg-gray-50'
  }`;

  return (
    <>
      {/* Top Navbar - Desktop Only */}
      <nav className="hidden md:block bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <Link to="/dashboard" className="text-2xl font-bold text-[#1dbf73] tracking-tight">
            QUUB
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/dashboard" className={linkStyle('/dashboard')}>
              <LayoutDashboard size={18} />
              <span>Home</span>
            </Link>
            
            <Link to="/jobs" className={linkStyle('/jobs')}>
              <Briefcase size={18} />
              <span>Find Jobs</span>
            </Link>

            {userData?.role === 'customer' && (
              <Link to="/post-job" className={linkStyle('/post-job')}>
                <PlusCircle size={18} />
                <span>Post Job</span>
              </Link>
            )}

            <Link to="/messages" className={`${linkStyle('/messages')} relative`}>
              <MessageSquare size={18} />
              <span>Messages</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold border-2 border-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            <Link to="/profile" className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-gray-200">
              <img 
                src={userData?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-gray-200 object-cover"
              />
              <span className="text-sm font-semibold text-gray-700 hidden lg:block">Profile</span>
            </Link>

            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors p-2" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Top Navbar - Mobile Logo Only */}
      <nav className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-50 h-14 flex items-center px-4 shadow-sm">
        <Link to="/dashboard" className="text-xl font-bold text-[#1dbf73] tracking-tight">
          QUUB
        </Link>
        <button onClick={handleLogout} className="ml-auto text-gray-400 p-2">
          <LogOut size={20} />
        </button>
      </nav>

      {/* Bottom Navigation Bar - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16 px-2">
          <Link to="/dashboard" className={linkStyle('/dashboard')}>
            <LayoutDashboard size={24} />
            <span className="text-[10px]">Home</span>
          </Link>

          <Link to="/jobs" className={linkStyle('/jobs')}>
            <Briefcase size={24} />
            <span className="text-[10px]">Jobs</span>
          </Link>

          {userData?.role === 'customer' && (
            <Link to="/post-job" className={linkStyle('/post-job')}>
              <div className="bg-[#1dbf73] p-2 rounded-full -mt-8 shadow-lg border-4 border-white text-white">
                <PlusCircle size={24} />
              </div>
              <span className="text-[10px] mt-1">Post</span>
            </Link>
          )}

          <Link to="/messages" className={`${linkStyle('/messages')} relative`}>
            <MessageSquare size={24} />
            <span className="text-[10px]">Messages</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-2 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </Link>

          <Link to="/profile" className={linkStyle('/profile')}>
            <User size={24} />
            <span className="text-[10px]">Profile</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
