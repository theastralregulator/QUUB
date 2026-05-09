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
    <div className="min-h-screen bg-[#060812] text-white pb-28">
      {/* --- Premium Discovery Hero --- */}
      <section className="px-6 pt-6 mb-8">
        <div className="relative bg-gradient-to-br from-[#1e1b4b] to-[#312e81] rounded-[2rem] p-6 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
          {/* Illustration (Folder Stack) */}
          <div className="absolute top-6 right-[-10px] w-32 h-28 opacity-90">
             <div className="relative w-full h-full">
                <div className="absolute top-0 right-0 w-24 h-20 bg-white/5 rounded-2xl rotate-[-6deg]" />
                <div className="absolute top-2 right-2 w-24 h-20 bg-white/10 rounded-2xl rotate-[-3deg]" />
                <div className="absolute top-4 right-4 w-24 h-20 bg-gradient-to-br from-violet-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">
                   <Sparkles size={32} className="text-white fill-white/20" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/20 blur-xl rounded-full" />
             </div>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-[10px] font-black tracking-widest text-violet-200 mb-4">
              <Sparkles size={12} className="text-yellow-400" />
              DISCOVER
            </div>
            <h1 className="text-3xl font-black mb-1.5">Premium Projects</h1>
            <p className="text-sm text-white/70 font-medium mb-6">{jobs.length} opportunities available right now</p>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center gap-2 text-center">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-violet-400">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black leading-tight">Verified Clients</p>
                  <p className="text-[7px] text-white/50">100% trusted</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center gap-2 text-center">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-cyan-400">
                  <Zap size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black leading-tight">Fast Payments</p>
                  <p className="text-[7px] text-white/50">Secure & on-time</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center gap-2 text-center">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-yellow-400">
                  <Star size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black leading-tight">Top Quality</p>
                  <p className="text-[7px] text-white/50">High standards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Search & Filters --- */}
      <section className="px-6 mb-6">
        <div className="bg-[#0e1328] border border-white/5 rounded-2xl p-2 flex items-center gap-3 mb-4">
          <div className="pl-3 text-slate-500"><Search size={20} /></div>
          <input 
            type="text" 
            placeholder="Search projects, skills or keywords..." 
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium py-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-violet-600 hover:bg-violet-700 px-5 py-2.5 rounded-xl text-xs font-black transition-colors">Search</button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <div className="flex-shrink-0 bg-[#0e1328] border border-white/5 px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-300">
            <Filter size={14} className="text-violet-500" />
            All Categories
            <X size={12} className="opacity-40" />
          </div>
          <div className="flex-shrink-0 bg-[#0e1328] border border-white/5 px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-300">
            <DollarSign size={14} className="text-cyan-500" />
            Budget
            <X size={12} className="opacity-40" />
          </div>
          <div className="flex-shrink-0 bg-[#0e1328] border border-white/5 px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-300">
            Sort
            <X size={12} className="opacity-40" />
          </div>
          <div className="flex-shrink-0 w-11 h-11 bg-[#0e1328] border border-white/5 rounded-xl flex items-center justify-center relative">
            <Filter size={18} className="text-slate-400" />
            <span className="absolute top-2 right-2 w-4 h-4 bg-violet-600 border-2 border-[#0e1328] rounded-full text-[8px] flex items-center justify-center font-black">1</span>
          </div>
        </div>
      </section>

      {/* --- Results --- */}
      <div className="px-6 flex justify-between items-center mb-6">
        <span className="text-sm font-black tracking-tight">{filtered.length} Projects Found</span>
        <button className="text-xs font-bold text-violet-400 flex items-center gap-1">
          <Sparkles size={12} /> Clear Filters
        </button>
      </div>

      <div className="px-6 space-y-4">
        {loading ? (
           <div className="animate-pulse space-y-4">
             {[1,2,3].map(i => (
               <div key={i} className="h-48 bg-white/5 rounded-[2rem]" />
             ))}
           </div>
        ) : filtered.map((job) => (
          <div key={job.id} onClick={() => navigate(`/jobs/${job.id}`)} className="bg-[#0e1328] border border-white/5 rounded-[2rem] p-6 group cursor-pointer hover:border-white/10 transition-all">
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-3">
                <img src={job.customerAvatar} alt="" className="w-11 h-11 rounded-full object-cover grayscale opacity-80" />
                <div>
                  <h4 className="text-xs font-black tracking-widest uppercase flex items-center gap-1.5">
                    {job.customerName}
                    <div className="w-3 h-3 bg-violet-500 rounded-full flex items-center justify-center">
                      <ShieldCheck size={8} className="text-white" />
                    </div>
                  </h4>
                  <p className="text-[10px] font-bold text-slate-500">Member since {new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">OPEN</span>
            </div>

            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-black group-hover:text-violet-400 transition-colors">{job.title}</h3>
              <button className="text-slate-600 hover:text-white transition-colors"><Star size={20} /></button>
            </div>
            
            <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-2 mb-6">
              {job.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {['React', 'JavaScript', 'Tailwind CSS'].map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-slate-400">{tag}</span>
              ))}
              <span className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-slate-600">+2</span>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex items-center gap-10">
                <div>
                  <p className="text-lg font-black text-violet-400">${job.budget}</p>
                  <p className="text-[9px] font-bold text-slate-600 uppercase">Fixed Price</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-slate-600"><Clock size={16} /></div>
                  <div>
                    <p className="text-xs font-black text-slate-300">{job.deadline}</p>
                    <p className="text-[9px] font-bold text-slate-600 uppercase">Deadline</p>
                  </div>
                </div>
              </div>
              <button className="bg-violet-600 hover:bg-violet-700 px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-violet-900/20">
                View Details <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
