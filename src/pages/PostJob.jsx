import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function PostJob() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { userData } = useAuth();
  const navigate = useNavigate();

  if (userData?.role !== 'customer') {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="card">
          <h2 style={{ color: 'var(--danger-color)' }}>Access Denied</h2>
          <p>Only customers can post jobs.</p>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ marginTop: '1rem' }}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await addDoc(collection(db, "Jobs"), {
        title,
        description,
        budget,
        deadline,
        customerId: userData.uid,
        customerName: userData.name,
        customerAvatar: userData.avatarUrl,
        status: "open",
        createdAt: new Date().toISOString()
      });
      navigate('/jobs');
    } catch (err) {
      console.error(err);
      setError('Failed to post the job. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Post a New Job</h2>
        
        {error && <div className="error-text" style={{ marginBottom: '1.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Job Title</label>
            <input 
              type="text" 
              className="form-input" 
              required 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Senior React Developer Needed"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="form-input" 
              required 
              rows="6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the project requirements, required skills, and deliverables..."
              style={{ resize: 'vertical' }}
            ></textarea>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div className="form-group flex-1">
              <label className="form-label">Budget</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g., $1000 - $1500"
              />
            </div>
            
            <div className="form-group flex-1">
              <label className="form-label">Deadline</label>
              <input 
                type="date" 
                className="form-input" 
                required 
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-6">
            <button type="button" className="btn btn-secondary w-full sm:w-auto" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button disabled={loading} type="submit" className="btn btn-primary w-full sm:w-auto shadow-md">
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
