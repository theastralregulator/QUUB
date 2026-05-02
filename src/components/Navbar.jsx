import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  MessageSquare, Briefcase, LayoutDashboard, PlusCircle, 
  LogOut, User, Bell, ChevronDown 
} from 'lucide-react';

export default function Navbar() {
  const { currentUser, userData, unreadCount, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const publicPaths = ['/', '/login', '/register'];
  if (publicPaths.includes(location.pathname)) return null;
  if (!currentUser) return null;

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const isActive = (path) => location.pathname.startsWith(path);

  const mobileNavItem = (path) =>
    `flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 ${
      isActive(path)
        ? 'text-violet-600 scale-110'
        : 'text-slate-400 hover:text-violet-500'
    }`;

  return (
    <>
      {/* ---- Premium Header (Desktop & Mobile Top) ---- */}
      <header className={`sticky top-0 z-50 transition-all duration-300 bg-white border-b border-slate-50 ${scrolled ? 'shadow-md shadow-slate-100/50' : ''}`}>
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          {/* Logo Section */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold text-[#1e1b4b]">Quub.</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className={`text-sm font-bold transition-colors ${isActive('/dashboard') ? 'text-violet-600' : 'text-slate-400 hover:text-violet-600'}`}>Home</Link>
            <Link to="/jobs" className={`text-sm font-bold transition-colors ${isActive('/jobs') ? 'text-violet-600' : 'text-slate-400 hover:text-violet-600'}`}>Jobs</Link>
            <Link to="/messages" className={`text-sm font-bold transition-colors ${isActive('/messages') ? 'text-violet-600' : 'text-slate-400 hover:text-violet-600'}`}>Messages</Link>
          </div>

          {/* Icons & Profile Section */}
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative cursor-pointer hover:scale-110 transition-transform">
              <Bell size={22} className="text-slate-400" />
              {unreadCount > 0 && (
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white animate-pulse"></div>
              )}
            </div>
            
            <div className="group relative flex items-center gap-2 bg-slate-50 p-1 pr-3 rounded-full border border-slate-100 cursor-pointer hover:bg-slate-100 transition-all">
              <img 
                src={userData?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`} 
                alt="" 
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm" 
              />
              <span className="text-sm font-bold text-slate-700 hidden sm:inline">{userData?.name?.split(' ')[0]}</span>
              <ChevronDown size={14} className="text-slate-400 group-hover:rotate-180 transition-transform" />
              
              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-violet-50 hover:text-violet-600 transition-colors">
                  <User size={18} /> Profile
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ---- Mobile Bottom Nav Bar ---- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(91,33,182,0.1)',
          boxShadow: '0 -8px 32px rgba(91,33,182,0.1)',
          paddingBottom: 'env(safe-area-inset-bottom, 8px)'
        }}>
        <div className="flex justify-around items-center px-2 py-2">
          <Link to="/dashboard" className={mobileNavItem('/dashboard')}>
            <div className={`p-2 rounded-2xl transition-all ${isActive('/dashboard') ? 'bg-violet-100' : ''}`}>
              <LayoutDashboard size={24} />
            </div>
            <span className="text-[10px] font-black tracking-tight">Home</span>
          </Link>

          <Link to="/jobs" className={mobileNavItem('/jobs')}>
            <div className={`p-2 rounded-2xl transition-all ${isActive('/jobs') ? 'bg-violet-100' : ''}`}>
              <Briefcase size={24} />
            </div>
            <span className="text-[10px] font-black tracking-tight">Jobs</span>
          </Link>

          {userData?.role === 'customer' ? (
            <Link to="/post-job" className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 -mt-8 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', boxShadow: '0 8px 24px rgba(124,58,237,0.5)' }}>
                <PlusCircle size={26} />
              </div>
              <span className="text-[10px] font-black text-violet-600 tracking-tight">Post</span>
            </Link>
          ) : (
            <Link to="/messages" className={`${mobileNavItem('/messages')} relative`}>
              <div className={`p-2 rounded-2xl relative transition-all ${isActive('/messages') ? 'bg-violet-100' : ''}`}>
                <MessageSquare size={24} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-black">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-black tracking-tight">Messages</span>
            </Link>
          )}

          <Link to="/profile" className={mobileNavItem('/profile')}>
            <div className={`p-2 rounded-2xl transition-all ${isActive('/profile') ? 'bg-violet-100' : ''}`}>
              <User size={24} />
            </div>
            <span className="text-[10px] font-black tracking-tight">Profile</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
