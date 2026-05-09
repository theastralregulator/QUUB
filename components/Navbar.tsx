"use client";

import React from "react";
import { Menu } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/50 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-quub-purple flex items-center justify-center glow-purple">
          <Image 
            src="/logo.jpg.png" 
            alt="QUUB Logo" 
            width={32} 
            height={32}
            className="object-contain"
          />
        </div>
        <span className="text-xl font-bold tracking-tight">QUUB</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden">
          <img 
            src="https://i.pravatar.cc/150?u=quub-user" 
            alt="User Avatar" 
            className="w-full h-full object-cover"
          />
        </div>
        <button className="text-white/80 hover:text-white transition-colors">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
}
