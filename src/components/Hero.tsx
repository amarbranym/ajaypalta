"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Recycle } from "lucide-react";
import { GlowButton } from "./ui/GlowButton";
import Link from "next/link";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-40 pb-20 bg-slate-950">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        {/* Deep Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-blue-600/10 rounded-[100%] blur-[120px] opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-violet-600/5 rounded-full blur-[140px] animate-pulse" />
        
        {/* Technical Subgrid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Animated Orbs */}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]"
        />
      </div>

      <motion.div
        className="container relative z-10 text-center px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          variants={itemVariants} 
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass border border-white/10 mb-10 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
        >
          <div className="relative">
            <Zap className="w-4 h-4 text-blue-400 relative z-10" />
            <div className="absolute inset-0 blur-sm bg-blue-400/50 animate-pulse" />
          </div>
          <span className="text-[10px] font-black tracking-[0.4em] text-blue-400 uppercase">
            Engineering the Future of Heat
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-[18vw] sm:text-8xl md:text-9xl lg:text-[11rem] font-black mb-10 tracking-[-0.05em] leading-[0.8] text-white uppercase"
        >
          HOPE <span className="text-gradient drop-shadow-[0_0_30px_rgba(59,130,246,0.2)]">Cycle</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-slate-500 text-sm md:text-base font-bold uppercase tracking-[0.4em] mb-12 flex flex-wrap items-center justify-center gap-4 px-4"
        >
          <span>Thermodynamic Innovation</span>
          <span className="w-1 h-1 rounded-full bg-blue-500/30 hidden sm:block" />
          <span>Waste Heat Recovery</span>
          <span className="w-1 h-1 rounded-full bg-blue-500/30 hidden sm:block" />
          <span>Isothermal Expansion</span>
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
          <Link href="/calc">
            <GlowButton className="text-sm md:text-base px-10 py-5 group bg-white text-black hover:bg-white/90">
              Interactive Model
              <ArrowRight className="inline-block ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </GlowButton>
          </Link>
          <button className="text-sm md:text-base px-10 py-5 font-black uppercase tracking-widest text-white border border-white/10 rounded-full hover:bg-white/5 transition-all">
            Technical Specs
          </button>
        </motion.div>

        {/* Floating Features */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {[
            { icon: Zap, title: "70% Efficiency", desc: "Theoretical limit of recovery", color: "text-blue-400" },
            { icon: Shield, title: "Isothermal Control", desc: "Constant temp expansion", color: "text-violet-400" },
            { icon: Recycle, title: "Zero Heat Loss", desc: "Recycled exhaust energy", color: "text-emerald-400" },
          ].map((feature, i) => (
            <div key={i} className="group flex flex-col items-center p-8 glass rounded-[32px] border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all duration-500 text-center">
              <div className={`p-4 rounded-2xl bg-white/5 mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Hero Bottom Decor */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-950 to-transparent z-10" />
    </section>
  );
}
