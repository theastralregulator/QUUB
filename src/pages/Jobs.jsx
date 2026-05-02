import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, DollarSign, Clock, ArrowRight, Filter } from 'lucide-react';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "Jobs"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#fcfdff] min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12 animate-fade-in">
        
        {/* Header Section */}
        <div className="mb-10 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Discover Projects</h1>
          <p className="text-slate-500 font-medium">Find elite opportunities matching your world-class skills.</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="sticky top-20 z-30 mb-10 md:mb-12">
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-2 flex flex-col md:flex-row gap-2 shadow-lg shadow-indigo-100/50">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 text-slate-900 font-medium placeholder:text-slate-400"
                placeholder="Search for projects, keywords, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn btn-secondary rounded-full px-6 flex items-center gap-2 md:w-auto w-full">
              <Filter size={18} />
              <span>Filters</span>
            </button>
            <button className="btn btn-primary rounded-full px-8 py-4 md:w-auto w-full font-bold">
              Search
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredJobs.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <Search size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-900">No projects found</h3>
                <p className="text-slate-500">Try adjusting your keywords or filters.</p>
              </div>
            ) : (
              filteredJobs.map(job => (
                <div 
                  key={job.id} 
                  className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col relative overflow-hidden"
                >
                  {/* Decorative Gradient Corner */}
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-50 rounded-full blur-2xl group-hover:bg-cyan-50 transition-colors"></div>

                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <img src={job.customerAvatar} alt="" className="w-10 h-10 rounded-full border border-slate-100 shadow-sm" />
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{job.customerName}</p>
                        <p className="text-[10px] text-slate-300 font-bold">{new Date(job.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-600 text-[10px] font-black uppercase tracking-tighter">
                      {job.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 mb-4 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                    {job.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm mb-8 line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="mt-auto space-y-4">
                    <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-indigo-600 font-black">
                        <DollarSign size={18} />
                        <span className="text-sm">{job.budget}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 font-bold">
                        <Clock size={16} />
                        <span className="text-xs">{job.deadline}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl group-hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
                    >
                      View Details
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
