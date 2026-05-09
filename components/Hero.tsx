"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Globe } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-16 px-6 flex flex-col items-center text-center overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-quub-purple/20 blur-[120px] -z-10 rounded-full" />
      <div className="absolute top-40 -right-20 w-[300px] h-[300px] bg-quub-cyan/10 blur-[100px] -z-10 rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-quub-purple/30 bg-quub-purple/5 text-quub-purple text-xs font-medium mb-8 glow-purple"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-quub-purple opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-quub-purple"></span>
        </span>
        ✨ The Future of Freelancing ⭐️
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
      >
        Connect with <br />
        <span className="text-gradient">Elite Talent</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-white/60 text-lg max-w-md mb-8 leading-relaxed"
      >
        A premium freelance marketplace designed for speed, security, and world-class quality.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex items-center gap-6 mb-10 text-sm text-white/40"
      >
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-quub-purple" />
          <span>Zero fees</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-quub-cyan" />
          <span>Infinite possibilities</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col w-full gap-4 max-w-xs relative"
      >
        <button className="relative group w-full py-4 rounded-2xl bg-gradient-to-r from-quub-purple to-quub-cyan text-white font-bold text-lg shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] active:scale-[0.98] overflow-hidden">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-center gap-2 relative z-10">
            Get Started
            <ArrowRight size={20} />
          </div>
        </button>
        
        <button className="w-full py-4 rounded-2xl border border-white/10 bg-white/5 text-white font-semibold text-lg transition-all hover:bg-white/10 hover:border-white/20 active:scale-[0.98] backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2">
            Sign In
            <ArrowRight size={20} />
          </div>
        </button>
      </motion.div>
    </section>
  );
}
