import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container flex-col items-center justify-center animate-fade-in" style={{ minHeight: '100vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--accent-color)' }}>
        Welcome to QUUB
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '2.5rem' }}>
        The premium freelance platform connecting top-tier workers and artists with clients. 
        Zero fees for customers. Infinite possibilities.
      </p>
      <div className="flex gap-md justify-center">
        <Link to="/register" className="btn btn-primary">Join Now</Link>
        <Link to="/login" className="btn btn-secondary">Log In</Link>
      </div>
    </div>
  );
}
