import React from 'react';

export default function AnimatedBG() {
  return (
    <div className="animated-bg">
      <div className="grid-overlay" />
      <div className="orb3" />
      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${4 + Math.random() * 10}px`,
            height: `${4 + Math.random() * 10}px`,
            background: i % 2 === 0
              ? `rgba(124, 58, 237, ${0.4 + Math.random() * 0.4})`
              : `rgba(6, 182, 212, ${0.4 + Math.random() * 0.4})`,
            animationDuration: `${10 + Math.random() * 15}s`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
}
