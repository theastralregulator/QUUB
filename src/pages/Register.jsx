import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('worker');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await register(email, password, role, name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create an account.');
    }
    setLoading(false);
  }

  async function handleGoogleSignUp() {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle(role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign up with Google.');
    }
    setLoading(false);
  }

  return (
    <div className="container flex items-center justify-center animate-fade-in" style={{ minHeight: '100vh', padding: '2rem 1.5rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <UserPlus size={48} color="var(--accent-color)" style={{ margin: '0 auto 1rem' }} />
          <h2>Join QUUB</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Create your free account</p>
        </div>
        
        {error && <div className="error-text" style={{ marginBottom: '1.5rem', textAlign: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)' }}>{error}</div>}
        
        <div className="form-group">
          <label className="form-label">I am a...</label>
          <div className="flex gap-sm" style={{ marginTop: '0.5rem' }}>
            <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.75rem', border: `1px solid ${role === 'worker' ? 'var(--accent-color)' : 'var(--border-color)'}`, borderRadius: 'var(--border-radius-sm)', backgroundColor: role === 'worker' ? 'rgba(59, 130, 246, 0.1)' : 'transparent', transition: 'all 0.2s' }}>
              <input type="radio" name="role" value="worker" checked={role === 'worker'} onChange={() => setRole('worker')} style={{ display: 'none' }} />
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Worker/Artist</span>
            </label>
            <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.75rem', border: `1px solid ${role === 'customer' ? 'var(--accent-color)' : 'var(--border-color)'}`, borderRadius: 'var(--border-radius-sm)', backgroundColor: role === 'customer' ? 'rgba(59, 130, 246, 0.1)' : 'transparent', transition: 'all 0.2s' }}>
              <input type="radio" name="role" value="customer" checked={role === 'customer'} onChange={() => setRole('customer')} style={{ display: 'none' }} />
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Customer</span>
            </label>
          </div>
        </div>

        <button disabled={loading} onClick={handleGoogleSignUp} className="btn btn-secondary w-full flex items-center justify-center gap-sm" style={{ marginBottom: '1.5rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign up with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
          <span style={{ margin: '0 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>or sign up with email</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" required minLength="6" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button disabled={loading} type="submit" className="btn btn-primary w-full" style={{ marginTop: '0.5rem' }}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
}
