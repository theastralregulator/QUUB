import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container mx-auto px-4 flex flex-col items-center justify-center animate-fade-in" style={{ minHeight: '100vh', textAlign: 'center' }}>
      <h1 className="text-4xl md:text-6xl font-extrabold text-[#1dbf73] mb-4 tracking-tight">
        Welcome to QUUB
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10">
        The premium freelance platform connecting top-tier workers and artists with clients. 
        Zero fees for customers. Infinite possibilities.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link to="/register" className="btn btn-primary w-full sm:w-auto text-lg py-3 px-8 shadow-md">Join Now</Link>
        <Link to="/login" className="btn btn-secondary w-full sm:w-auto text-lg py-3 px-8">Log In</Link>
      </div>
    </div>
  );
}
