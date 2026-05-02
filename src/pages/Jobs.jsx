import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, DollarSign, Clock, ArrowRight, Sparkles, Filter, X } from 'lucide-react';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "Jobs"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setJobs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColor = { open: '#10B981', closed: '#94A3B8' };

  return (
    <div className="page-bg min-h-screen pb-28 md:pb-10">
      {/* Animated top gradient accent */}
      <div className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 50%, #06B6D4 100%)', padding: '3rem 1.25rem 5rem' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          animation: 'gridDrift 25s linear infinite',
        }} />
        <div className="container mx-auto relative z-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Sparkles size={18} className="text-yellow-300" />
            </div>
            <span className="text-white/70 font-bold text-sm uppercase tracking-widest">Discover</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight">
            Premium Projects
          </h1>
          <p className="text-white/70 font-medium text-lg">{jobs.length} opportunities available right now</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-10">
        {/* Floating Search Bar */}
        <div className="animate-scale-in mb-8">
          <div className="bg-white rounded-[2rem] p-2 flex items-center gap-2 shadow-2xl shadow-violet-200/50 border border-violet-100">
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search size={20} className="text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search projects, skills..."
                className="flex-1 py-3 bg-transparent border-none focus:ring-0 text-slate-800 font-semibold placeholder:text-slate-400 text-base outline-none"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-violet-600 transition-colors">
                  <X size={18} />
                </button>
              )}
            </div>
            <button className="btn btn-primary rounded-[1.5rem] px-6 py-3 text-sm shrink-0">
              Search
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-[2rem] p-7 border border-slate-100 h-64">
                <div className="shimmer h-4 w-1/3 mb-4 rounded" />
                <div className="shimmer h-6 w-3/4 mb-3 rounded" />
                <div className="shimmer h-4 w-full mb-2 rounded" />
                <div className="shimmer h-4 w-2/3 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(91,33,182,0.1), rgba(6,182,212,0.1))' }}>
              <Search size={36} className="text-violet-400" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">No Projects Found</h3>
            <p className="text-slate-400 font-medium">Try adjusting your search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((job, idx) => (
              <div
                key={job.id}
                className="animate-fade-in bg-white rounded-[2rem] p-7 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-violet-100/60 hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col relative overflow-hidden"
                style={{ animationDelay: `${idx * 0.07}s` }}
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                {/* Gradient accent top */}
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-[2rem]"
                  style={{ background: 'linear-gradient(90deg, #7C3AED, #06B6D4)' }} />

                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3">
                    <img src={job.customerAvatar} alt="" className="w-10 h-10 rounded-2xl border border-slate-100 object-cover shadow-sm" />
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{job.customerName}</p>
                      <p className="text-[10px] text-slate-300 font-bold">{new Date(job.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase"
                    style={{ background: `${statusColor[job.status]}15`, color: statusColor[job.status] }}>
                    {job.status}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-violet-600 transition-colors">
                  {job.title}
                </h3>

                <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                  {job.description}
                </p>

                <div className="border-t border-slate-50 pt-5 flex items-center justify-between">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-1.5 font-black text-violet-600 text-sm">
                      <DollarSign size={16} />
                      <span>{job.budget}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs">
                      <Clock size={14} />
                      <span>{job.deadline}</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-all shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
                    <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
