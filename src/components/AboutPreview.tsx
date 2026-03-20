"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Info, Compass, Shield, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPreview() {
  return (
    <section className="relative py-32 bg-[#020617] overflow-hidden blueprint-grid">
      {/* Background Grid Atmosphere */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
      <div className="absolute top-10 right-10 blueprint-marker opacity-40">META_DATA_6.2.X</div>
      <div className="absolute bottom-10 left-10 blueprint-marker tracking-[0.4em] opacity-40 italic">RESEARCH_PHASE_FINAL</div>

      <div className="container relative z-10 px-6">
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1, ease: [0.165, 0.84, 0.44, 1] }}
           className="max-w-7xl mx-auto rounded-[60px] glass-premium border border-white/10 p-12 md:p-20 relative overflow-hidden group shadow-2xl"
        >
          {/* Subtle Dynamic Glow */}
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[160px] pointer-events-none group-hover:bg-blue-600/10 transition-all duration-[2s]" />
          
          <div className="grid lg:grid-cols-2 gap-24 items-center relative z-10">
            <div className="space-y-12">
               {/* Section Entry Tag */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full glass-premium border-white/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.5em]"
              >
                <Activity className="w-4 h-4 animate-pulse" />
                <span className="opacity-80">Scientific_Mission_Protocol</span>
              </motion.div>
              
              <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tight leading-[1.1] text-white uppercase font-playfair italic max-w-2xl">
                The Frontiers of <br />
                <span className="text-glimmer">Thermal Reclamation</span>
              </h2>
              
               <p className="text-base text-slate-400 leading-relaxed font-light italic opacity-80 max-w-lg">
                The HOPE engine cycle represents a total departure from conventional internal 
                combustion. It&apos;s a path toward ultra-high efficiency by fundamentally 
                re-engineering how we manage peak cycle temperatures.
              </p>
              
              <div className="pt-10 flex flex-col sm:flex-row items-center gap-10">
                <Link 
                  href="/about" 
                  className="group/btn relative inline-flex items-center gap-4 px-12 py-6 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.4em] overflow-hidden transition-all duration-500 shadow-2xl"
                >
                  <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                  <span className="relative z-10 flex items-center gap-4">
                    Read Philosophy
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-4 transition-transform duration-500" />
                  </span>
                </Link>
                
                <div className="flex items-center gap-4">
                   <div className="w-10 h-px bg-white/10" />
                   <span className="text-[10px] uppercase font-black text-slate-700 tracking-widest">EST_DATA_v1.0.4</span>
                </div>
              </div>
            </div>
            
            <div className="relative group/visual">
              {/* Viewfinder Corners */}
              <div className="absolute top-0 left-0 w-10 h-10 border-t border-l border-white/10 group-hover/visual:border-blue-500/40 transition-colors z-20" />
              <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-white/10 group-hover/visual:border-blue-500/40 transition-colors z-20" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b border-l border-white/10 group-hover/visual:border-blue-500/40 transition-colors z-20" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b border-r border-white/10 group-hover/visual:border-blue-500/40 transition-colors z-20" />

              <div className="aspect-square rounded-[60px] bg-[#020617] border border-white/5 flex items-center justify-center p-12 relative overflow-hidden group-hover/visual:border-white/10 transition-colors">
                 {/* Scanner Overlay Simulation */}
                <div className="scanner-overlay opacity-0 group-hover/visual:opacity-20 transition-opacity duration-1000">
                   <div className="scanner-line" />
                </div>
                
                {/* Tech Background Visual */}
                <div className="absolute inset-0 opacity-10 group-hover/visual:opacity-20 transition-opacity">
                   <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] bg-[size:40px_40px]" />
                   <div className="absolute inset-x-0 top-1/2 h-px bg-blue-500/30" />
                   <div className="absolute inset-y-0 left-1/2 w-px bg-blue-500/30" />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <Compass className="w-32 h-32 text-blue-500/20 mb-12 animate-spin-slow rotate-12" />
                  <div className="text-center">
                    <div className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tighter font-playfair group-hover/visual:scale-105 transition-transform duration-[1.5s] italic">10+</div>
                    <div className="text-blue-400 font-black uppercase tracking-[0.5em] text-[10px]">Years of Simulation Research</div>
                  </div>
                </div>
                
                {/* Visual Blueprint Labels */}
                <div className="absolute top-12 left-12 blueprint-marker italic opacity-40">SYS_STABILITY_OK</div>
                <div className="absolute bottom-12 right-12 blueprint-marker text-emerald-500/30 font-bold animate-pulse tracking-widest">OPTIMIZED_ENV</div>

                {/* Focal Crosshair */}
                <div className="absolute inset-0 opacity-0 group-hover/visual:opacity-10 transition-opacity">
                   <div className="absolute top-1/2 left-0 right-0 h-px bg-white" />
                   <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
