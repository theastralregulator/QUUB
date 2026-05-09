"use client";

import React from "react";
import { Star, CheckCircle2 } from "lucide-react";

export default function Trust() {
  const avatars = [
    "https://i.pravatar.cc/100?u=1",
    "https://i.pravatar.cc/100?u=2",
    "https://i.pravatar.cc/100?u=3",
  ];

  return (
    <section className="px-6 mb-32">
      <div className="glass-card rounded-3xl p-5 flex items-center justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex -space-x-3">
            {avatars.map((url, i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden">
                <img src={url} alt="User" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-background bg-quub-purple flex items-center justify-center text-[10px] font-bold">
              10K+
            </div>
          </div>
          
          <div>
            <p className="text-xs font-semibold text-white/60 mb-1">Trusted by 10K+ creators</p>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-xs font-bold ml-1">4.9/5</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle2 size={24} className="text-emerald-400" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            Secure & Verified
          </span>
        </div>
      </div>
    </section>
  );
}
