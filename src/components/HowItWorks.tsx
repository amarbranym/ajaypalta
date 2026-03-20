"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  Droplets, 
  RefreshCw, 
  ArrowRight,
  Activity,
  Zap
} from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    icon: Droplets,
    title: "1. Isothermal Suppression",
    description: "Multi-point precision liquid injection absorbs latent energy precisely at the peak of compression, maintaining near-constant temperature.",
    tag: "T_ISO_PHASE",
    metric: "< 1.2K Drift"
  },
  {
    icon: Zap,
    title: "2. Kinetic Recovery",
    description: "The captured thermal energy is instantly transitioned into high-pressure vapor work, rather than being expelled through a radiator.",
    tag: "W_REC_PHASE",
    metric: "14.2% Gain"
  },
  {
    icon: RefreshCw,
    title: "3. Closed-Loop Reclaim",
    description: "Exhaust headers act as high-efficiency condensers, reclaiming working fluids for the next cycle with minimal pressure drop.",
    tag: "FLUID_LOOP_PHASE",
    metric: "95% Recovery"
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-48 bg-[#020617] overflow-hidden blueprint-grid">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />
      
      {/* Professional Metadata */}
      <div className="absolute top-10 left-10 blueprint-marker opacity-40">SYS_PROC_FLOW::V4.2</div>
      <div className="absolute top-20 right-10 blueprint-marker opacity-40 italic tracking-widest">REALTIME_PHASE_MONITOR</div>

      <div className="container relative z-10 px-6">
        <div className="text-center mb-32">
          {/* Section Entry Tag */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-4 px-8 py-2.5 rounded-full glass-premium border-white/20 mb-12 shadow-xl"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">OPERATIONAL_CYCLES_v4.2</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl font-black mb-6 text-white tracking-tight uppercase font-playfair italic max-w-3xl mx-auto">
            The <span className="text-glimmer">HOPE</span> Cycle
          </h2>
          <p className="text-base text-slate-400 max-w-xl mx-auto font-light leading-relaxed italic opacity-80">
            Our proprietary thermodynamic sequence optimizes every phase of combustion and reclamation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          {/* Animated Connectors for Desktop */}
          <div className="hidden lg:block absolute top-[120px] left-[25%] right-[25%] h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent z-0" />

          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="group relative p-10 glass-premium rounded-[40px] border border-white/5 hover:border-white/20 transition-all duration-500 flex flex-col items-center text-center overflow-hidden"
            >
              {/* Scanner Overlay Simulation */}
              <div className="scanner-overlay opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="scanner-line" />
              </div>

               {/* Viewfinder Corners */}
              <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-white/10 group-hover:border-blue-500/40 transition-colors" />
              <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-white/10 group-hover:border-blue-500/40 transition-colors" />
              <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-white/10 group-hover:border-blue-500/40 transition-colors" />
              <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-white/10 group-hover:border-blue-500/40 transition-colors" />

              <div className="w-24 h-24 rounded-[40px] bg-white/5 flex items-center justify-center mb-12 border border-white/10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 relative">
                <step.icon className="w-10 h-10 text-blue-400" />
                {/* Phase Number Marker */}
                <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-[#020617] border border-blue-500/40 flex items-center justify-center text-xs font-black text-blue-500 font-mono shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  {i + 1}
                </div>
                {/* Focal Crosshair */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity">
                   <div className="absolute top-1/2 left-0 right-0 h-px bg-white" />
                   <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white" />
                </div>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight font-playfair italic mb-6">
                {step.title}
              </h3>
              
              <p className="text-sm text-slate-400 leading-relaxed font-light mb-10 italic opacity-80">
                {step.description}
              </p>

              <div className="mt-auto w-full pt-10 border-t border-white/5 flex flex-col items-center gap-4">
                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{step.tag}</span>
                 <div className="flex items-center gap-4">
                    <span className="text-xl font-mono text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">{step.metric}</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-pulse" />
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
