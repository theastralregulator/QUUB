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
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      <Link to="/jobs" className="inline-flex items-center gap-2 mb-6 text-gray-500 hover:text-[#1dbf73] font-medium transition-colors">
        <ArrowLeft size={16} /> Back to Jobs
      </Link>
      
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-2 text-gray-500 text-sm font-medium">
              <img src={job.customerAvatar} alt={job.customerName} className="w-6 h-6 rounded-full shadow-sm" />
              <span>Posted by <span className="text-gray-800">{job.customerName}</span></span>
              <span className="hidden sm:inline">•</span>
              <span>{new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${job.status === 'open' ? 'bg-green-50 text-[#1dbf73]' : 'bg-gray-100 text-gray-500'}`}>
            {job.status}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-10 p-6 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg text-[#1dbf73]">
              <DollarSign size={20} />
            </div>
            <div>
              <span className="block text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Budget</span>
              <span className="font-extrabold text-gray-900 text-lg">{job.budget}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-500">
              <Calendar size={20} />
            </div>
            <div>
              <span className="block text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Deadline</span>
              <span className="font-extrabold text-gray-900 text-lg">{job.deadline}</span>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Job Description</h3>
          <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
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
