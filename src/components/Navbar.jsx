import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Briefcase, LayoutDashboard, PlusCircle, Menu, X, LogOut } from 'lucide-react';

export default function Navbar() {
  const { currentUser, userData, unreadCount, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  if (['/login', '/register', '/'].includes(location.pathname)) {
    return null;
  }

  if (!currentUser) return null;

  const linkStyle = (path) => `flex items-center gap-2 p-2 rounded-md transition-colors font-medium ${
    location.pathname.includes(path) 
      ? 'text-[#1dbf73] bg-green-50' 
      : 'text-gray-600 hover:text-[#1dbf73] hover:bg-gray-50'
  }`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link to="/dashboard" className="text-2xl font-bold text-[#1dbf73] tracking-tight">
          QUUB
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
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

          <Link to="/dashboard" className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-gray-200">
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

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-gray-600 hover:text-[#1dbf73]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-3 shadow-lg absolute w-full left-0">
          <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={`w-full ${linkStyle('/dashboard')}`}>
            <LayoutDashboard size={20} />
            <span>Home</span>
          </Link>
          
          <Link to="/jobs" onClick={() => setMobileMenuOpen(false)} className={`w-full ${linkStyle('/jobs')}`}>
            <Briefcase size={20} />
            <span>Find Jobs</span>
          </Link>

          {userData?.role === 'customer' && (
            <Link to="/post-job" onClick={() => setMobileMenuOpen(false)} className={`w-full ${linkStyle('/post-job')}`}>
              <PlusCircle size={20} />
              <span>Post Job</span>
            </Link>
          )}

          <Link to="/messages" onClick={() => setMobileMenuOpen(false)} className={`w-full ${linkStyle('/messages')} flex justify-between`}>
            <div className="flex items-center gap-2">
              <MessageSquare size={20} />
              <span>Messages</span>
            </div>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">
                {unreadCount} new
              </span>
            )}
          </Link>

          <div className="pt-4 mt-2 border-t border-gray-100 flex justify-between items-center">
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-2">
              <img 
                src={userData?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border border-gray-200 object-cover"
              />
              <div>
                <p className="font-semibold text-gray-800">{userData?.name || 'User'}</p>
                <p className="text-xs text-gray-500 capitalize">{userData?.role}</p>
              </div>
            </Link>
            <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500">
              <LogOut size={24} />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
