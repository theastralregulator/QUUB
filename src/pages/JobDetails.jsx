import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Calendar, DollarSign } from 'lucide-react';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [message, setMessage] = useState('');
  
  const { userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchJobAndApplication() {
      try {
        const docRef = doc(db, "Jobs", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setJob({ id: docSnap.id, ...docSnap.data() });
        } else {
          setMessage("Job not found.");
        }

        if (userData?.role === 'worker') {
          const q = query(collection(db, "Applications"), where("jobId", "==", id), where("workerId", "==", userData.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            setHasApplied(true);
          }
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
        setMessage("Error loading job details.");
      }
      setLoading(false);
    }
    fetchJobAndApplication();
  }, [id, userData]);

  async function handleApply() {
    setApplying(true);
    try {
      await addDoc(collection(db, "Applications"), {
        jobId: job.id,
        jobTitle: job.title,
        customerId: job.customerId,
        workerId: userData.uid,
        workerName: userData.name,
        workerAvatar: userData.avatarUrl,
        workerEmail: userData.email,
        status: "pending",
        createdAt: new Date().toISOString()
      });
      setHasApplied(true);
      setMessage("Application submitted successfully!");
    } catch (error) {
      console.error("Error applying:", error);
      setMessage("Failed to submit application.");
    }
    setApplying(false);
  }

  if (loading) return <div className="container" style={{ paddingTop: '3rem', textAlign: 'center' }}>Loading details...</div>;
  if (!job) return <div className="container" style={{ paddingTop: '3rem', textAlign: 'center' }}>{message}</div>;

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '800px' }}>
      <Link to="/jobs" className="flex items-center gap-sm" style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
        <ArrowLeft size={16} /> Back to Jobs
      </Link>
      
      <div className="card" style={{ padding: '2.5rem' }}>
        <div className="flex justify-between items-start" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{job.title}</h1>
            <div className="flex items-center gap-sm" style={{ color: 'var(--text-secondary)' }}>
              <img src={job.customerAvatar} alt={job.customerName} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
              <span>Posted by {job.customerName}</span>
              <span>•</span>
              <span>{new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div style={{ display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '2rem', backgroundColor: job.status === 'open' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.1)', color: job.status === 'open' ? 'var(--success-color)' : 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.875rem' }}>
            {job.status}
          </div>
        </div>

        <div className="flex gap-lg" style={{ marginBottom: '2.5rem', padding: '1.5rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--border-radius-sm)' }}>
          <div className="flex items-center gap-sm">
            <DollarSign color="var(--success-color)" />
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Budget</span>
              <span style={{ fontWeight: '600' }}>{job.budget}</span>
            </div>
          </div>
          <div className="flex items-center gap-sm">
            <Calendar color="var(--accent-color)" />
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Deadline</span>
              <span style={{ fontWeight: '600' }}>{job.deadline}</span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Job Description</h3>
          <p style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
            {job.description}
          </p>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
          {userData?.role === 'worker' ? (
            hasApplied ? (
              <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', borderRadius: 'var(--border-radius-sm)', textAlign: 'center', fontWeight: '500' }}>
                You have expressed interest in this job!
              </div>
            ) : (
              <div>
                {message && <div className="error-text" style={{ marginBottom: '1rem', textAlign: 'center', color: 'var(--success-color)' }}>{message}</div>}
                <button 
                  className="btn btn-primary w-full" 
                  style={{ padding: '1rem', fontSize: '1.1rem' }}
                  onClick={handleApply}
                  disabled={applying}
                >
                  {applying ? 'Submitting...' : "I'm Interested"}
                </button>
              </div>
            )
          ) : userData?.uid === job.customerId ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1rem' }}>
              You posted this job. Applications will appear in your dashboard soon.
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1rem' }}>
              Only workers can apply for jobs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
