import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Search, Star, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchJobs() {
      try {
        const q = query(collection(db, "Jobs"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const jobsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setJobs(jobsList);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
      setLoading(false);
    }
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleContactClick(e, posterId) {
    e.preventDefault();
    e.stopPropagation(); // prevent card click
    navigate(`/messages?contactId=${posterId}`);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
      
      {/* Header & Search */}
      <div className="mb-10 text-center md:text-left bg-[#1dbf73] p-8 md:p-12 rounded-2xl shadow-sm text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Find your next freelance job</h1>
        <p className="text-green-50 mb-8 max-w-2xl text-lg">Browse thousands of jobs posted by clients. Use the search bar to find opportunities that match your skills.</p>
        
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search for any service..." 
            className="w-full pl-12 pr-4 py-4 rounded-lg border-none focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg text-lg text-gray-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Job Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1dbf73]"></div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">No jobs found</h3>
          <p className="text-gray-500">Try adjusting your search terms or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredJobs.map(job => (
            <Link 
              to={`/jobs/${job.id}`} 
              key={job.id} 
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer hover:-translate-y-1"
            >
              <div className="p-5 flex-1 flex flex-col">
                {/* Poster Info */}
                <div className="flex items-center gap-3 mb-4">
                  <img src={job.customerAvatar} alt={job.customerName} className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm group-hover:text-[#1dbf73] transition-colors">{job.customerName}</h4>
                    <div className="flex items-center text-xs text-gray-500 gap-1 font-medium mt-0.5">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span>5.0 (New)</span>
                    </div>
                  </div>
                </div>
                
                {/* Job Title */}
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 leading-tight group-hover:underline decoration-[#1dbf73]">{job.title}</h3>
                
                {/* Description Snippet */}
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                  {job.description}
                </p>
                
                {/* Meta Info */}
                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-2">
                  <Clock size={14} />
                  <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              {/* Footer / Action */}
              <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Budget</span>
                  <span className="text-lg font-black text-gray-900">{job.budget}</span>
                </div>
                
                {userData?.uid !== job.customerId ? (
                  <button 
                    onClick={(e) => handleContactClick(e, job.customerId)} 
                    className="text-[#1dbf73] font-bold hover:text-white hover:bg-[#1dbf73] border-2 border-[#1dbf73] px-4 py-1.5 rounded-md transition-colors text-sm"
                  >
                    Contact
                  </button>
                ) : (
                  <span className="text-xs text-gray-400 font-bold bg-gray-200 px-3 py-1 rounded-full">Your Post</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
