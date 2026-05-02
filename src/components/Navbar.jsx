import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Briefcase, LayoutDashboard, PlusCircle, LogOut, User, Home } from 'lucide-react';

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

  const navItemClass = (path) =>
    `flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-xl transition-all duration-200 font-bold text-sm ${
      isActive(path)
        ? 'text-white bg-gradient-to-r from-violet-600 to-cyan-500 shadow-lg shadow-violet-500/30'
        : 'text-slate-500 hover:text-violet-600 hover:bg-violet-50'
    }`;

  const mobileNavItem = (path) =>
    `flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 ${
      isActive(path)
        ? 'text-violet-600 scale-110'
        : 'text-slate-400 hover:text-violet-500'
    }`;

  return (
    <>
      {/* ---- Top Navbar - Desktop ---- */}
      <nav className={`hidden md:block sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg shadow-violet-100/50' : ''}`}
        style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(91,33,182,0.08)' }}>
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <Link to="/dashboard">
            <img src="/logo.png" alt="Logo" className="h-9 w-auto transition-transform hover:scale-105" />
          </Link>

          <div className="flex items-center gap-1">
            <Link to="/dashboard" className={navItemClass('/dashboard')}>
              <LayoutDashboard size={17} /><span>Home</span>
            </Link>
            <Link to="/jobs" className={navItemClass('/jobs')}>
              <Briefcase size={17} /><span>Jobs</span>
            </Link>
            {userData?.role === 'customer' && (
              <Link to="/post-job" className={navItemClass('/post-job')}>
                <PlusCircle size={17} /><span>Post Job</span>
              </Link>
            )}
            <Link to="/messages" className={`${navItemClass('/messages')} relative`}>
              <MessageSquare size={17} /><span>Messages</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center font-black border-2 border-white animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            <div className="w-px h-6 bg-slate-200 mx-2" />
            <Link to="/profile" className="ml-1 flex items-center gap-2 hover:bg-violet-50 px-3 py-2 rounded-xl transition-all group border border-transparent hover:border-violet-100">
              <img
                src={userData?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`}
                alt="" className="w-8 h-8 rounded-full border-2 border-violet-200 object-cover group-hover:scale-105 transition-transform"
              />
              <span className="text-sm font-bold text-slate-600 hidden lg:block">Profile</span>
            </Link>
            <button onClick={handleLogout} className="p-2 ml-1 text-slate-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* ---- Mobile Top Bar ---- */}
      <nav className="md:hidden sticky top-0 z-50"
        style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(91,33,182,0.08)' }}>
        <div className="h-14 flex items-center justify-between px-5">
          <Link to="/dashboard">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/profile">
              <img
                src={userData?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`}
                alt="" className="w-8 h-8 rounded-full border-2 border-violet-200 object-cover"
              />
            </Link>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

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

          {userData?.role === 'customer' && (
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
