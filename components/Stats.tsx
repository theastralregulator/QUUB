"use client";

import React from "react";
import { Users, DollarSign, Headphones } from "lucide-react";

export default function Stats() {
  const stats = [
    { label: "Creators", value: "10K+", icon: <Users size={20} className="text-quub-purple" /> },
    { label: "Fees", value: "$0", icon: <DollarSign size={20} className="text-quub-cyan" /> },
    { label: "Support", value: "24/7", icon: <Headphones size={20} className="text-quub-purple" /> },
  ];

  return (
    <section className="px-6 mb-12">
      <div className="glass-card rounded-[32px] p-8 grid grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-center text-center">
            <div className="mb-3 opacity-80">{stat.icon}</div>
            <div className="text-2xl font-bold mb-1 tracking-tight">{stat.value}</div>
            <div className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
