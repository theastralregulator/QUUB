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
    <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h2>Dashboard</h2>
        <div className="flex gap-sm">
          {userData.role === 'customer' && (
            <Link to="/post-job" className="btn btn-primary">Post a New Job</Link>
          )}
          <button onClick={handleLogout} className="btn btn-secondary flex items-center gap-sm">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-md" style={{ marginBottom: '1.5rem' }}>
          <img 
            src={userData.avatarUrl} 
            alt="Profile Avatar" 
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }} 
          />
          <div>
            <h3 style={{ marginBottom: '0.25rem' }}>{userData.name}</h3>
            <div className="flex items-center gap-sm">
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{userData.email}</span>
              <span style={{ display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-color)', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>
                {userData.role}
              </span>
            </div>
          </div>
        </div>
        
        <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '1.5rem 0' }}></div>

        <p style={{ color: 'var(--text-secondary)' }}>
          {userData.role === 'worker' 
            ? "Welcome to your worker dashboard! Soon you'll be able to manage your portfolio and apply for jobs." 
            : "Welcome to your customer dashboard! Soon you'll be able to post new projects and hire talented workers."}
        </p>
      </div>
    </div>
  );
}
