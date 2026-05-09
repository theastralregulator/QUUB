"use client";

import React from "react";
import { Home, Briefcase, MessageSquare, User } from "lucide-react";
import { motion } from "framer-motion";

export default function BottomNav() {
  const navItems = [
    { label: "Home", icon: <Home size={24} />, active: true },
    { label: "Jobs", icon: <Briefcase size={24} />, active: false },
    { label: "Messages", icon: <MessageSquare size={24} />, active: false },
    { label: "Profile", icon: <User size={24} />, active: false },
  ];

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50">
      <div className="glass rounded-[32px] p-3 flex items-center justify-around shadow-2xl shadow-black/50 border border-white/10">
        {navItems.map((item, idx) => (
          <button
            key={idx}
            className={`flex flex-col items-center gap-1 p-2 transition-all ${
              item.active ? "text-white" : "text-white/40 hover:text-white/60"
            }`}
          >
            <div className="relative">
              {item.icon}
              {item.active && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-quub-purple glow-purple shadow-quub-purple"
                />
              )}
            </div>
            <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
