"use client";

import React from "react";
import { Crown, Zap, Shield, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Features() {
  const features = [
    {
      title: "Premium Talent",
      description: "Only the top 1% of creators join our curated network.",
      icon: <Crown size={24} />,
      color: "from-purple-500/20 to-purple-500/0",
      iconColor: "text-quub-purple",
      glow: "glow-purple"
    },
    {
      title: "Lightning Fast",
      description: "Post a job and receive proposals within minutes.",
      icon: <Zap size={24} />,
      color: "from-blue-500/20 to-blue-500/0",
      iconColor: "text-blue-400",
      glow: "glow-cyan"
    },
    {
      title: "Zero Risk",
      description: "Advanced protection for every project you run.",
      icon: <Shield size={24} />,
      color: "from-emerald-500/20 to-emerald-500/0",
      iconColor: "text-emerald-400",
      glow: "shadow-[0_0_20px_rgba(52,211,153,0.2)]"
    }
  ];

  return (
    <section className="px-6 mb-16 flex flex-col gap-4">
      {features.map((feature, idx) => (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.02 }}
          className="relative group flex items-center gap-5 p-6 rounded-[28px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all duration-300"
        >
          <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${feature.color} border border-white/10 ${feature.iconColor} ${feature.glow}`}>
            {feature.icon}
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-bold mb-1 tracking-tight">{feature.title}</h3>
            <p className="text-white/40 text-sm leading-relaxed">{feature.description}</p>
          </div>
          <ChevronRight size={20} className="text-white/20 group-hover:text-white/40 transition-colors" />
        </motion.div>
      ))}
    </section>
  );
}
