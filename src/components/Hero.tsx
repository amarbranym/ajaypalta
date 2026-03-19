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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-48 pb-20">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] animate-pulse" />
        <div className="bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px] animate-pulse delay-700" />
        
        {/* Glowing Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <motion.div
        className="container relative z-10 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass border border-white/10 mb-8">
          <Zap className="w-4 h-4 text-blue-400" />
          <span className="text-[10px] font-black tracking-[0.3em] text-blue-400 uppercase">
            Hydro Oxy Palta Engine
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter leading-[0.85] text-white"
        >
          HOPE <span className="text-gradient">Cycle</span>
        </motion.h1>

        <motion.div 
          variants={itemVariants} 
          className="flex items-center justify-center space-x-4 mb-10 text-xs font-bold text-slate-500 uppercase tracking-widest"
        >
          <span>Reference Model</span>
          <span className="w-1 h-1 rounded-full bg-blue-500/30" />
          <span>FAQ Backed</span>
          <span className="w-1 h-1 rounded-full bg-blue-500/30" />
          <span>White Paper Certified</span>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/calc">
            <GlowButton className="text-lg px-10 py-4 group">
              Explore the Model
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </GlowButton>
          </Link>
          <GlowButton variant="outline" className="text-lg px-10 py-4">
            Download Whitepaper
          </GlowButton>
        </motion.div>

        {/* Floating Features */}
        <motion.div 
          variants={itemVariants}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {[
            { icon: Zap, title: "Double Efficiency", desc: "Up to 70% in practice" },
            { icon: Shield, title: "Temperature Cap", desc: "Prevents engine knock" },
            { icon: Recycle, title: "Energy Recovery", desc: "90% water recycling" },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center p-6 glass rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300">
              <feature.icon className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
