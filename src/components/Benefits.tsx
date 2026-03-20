"use client";
import React from "react";
import { motion } from "framer-motion";
import { Zap, Shield, Recycle, Globe, Activity } from "lucide-react";

const BENEFITS = [
  {
    icon: Zap,
    title: "Extreme Efficiency",
    description: "Achieve brake thermal efficiency peaks previously considered impossible in standard internal combustion.",
    tag: "ETA_OPTIMAL",
    metric: "58.2%"
  },
  {
    icon: Shield,
    title: "Thermal Stability",
    description: "Isothermal operation eliminates the extreme temperature spikes that cause mechanical fatigue and knock.",
    tag: "T_STABLE",
    metric: "±0.5K"
  },
  {
    icon: Recycle,
    title: "Fluid Recovery",
    description: "Our closed-loop system reclaims the working fluid with 95% efficiency, reducing logistical overhead.",
    tag: "FLUID_RECL",
    metric: "95%"
  },
  {
    icon: Globe,
    title: "Carbon Reduction",
    description: "Lower fuel consumption directly translates to a significant reduction in CO2 footprint per kilowatt-hour.",
    tag: "CO2_MINIM",
    metric: "-40%"
  },
];

export default function Benefits() {
  return (
    <section className="relative py-48 bg-[#020617] overflow-hidden blueprint-grid">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

       {/* Professional Metadata */}
      <div className="absolute top-10 left-10 blueprint-marker opacity-40">REF_BENEFIT_v2.1</div>
      <div className="absolute top-1/2 right-10 -translate-y-1/2 blueprint-marker [writing-mode:vertical-lr] opacity-40 italic">PERF_METRICS_SCAN</div>

      <div className="container relative z-10 px-6">
        <div className="text-center mb-32">
          {/* Section Entry Tag */}
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="inline-flex items-center gap-4 px-6 py-2 rounded-full glass-premium border border-white/10 mb-12"
          >
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">OPTIMIZATION_MATRIX_v7.2</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-5xl font-black text-white tracking-tight uppercase font-playfair italic mb-6 max-w-3xl mx-auto"
          >
            Engineering <span className="text-glimmer">Advantages</span>
          </motion.h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto italic font-light opacity-80 leading-relaxed">
            Precision-engineered outcomes that redefine the operational envelope of modern power generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {BENEFITS.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 glass-premium rounded-[32px] border border-white/5 hover:border-white/20 transition-all duration-500 relative overflow-hidden"
            >
               {/* Scanner Overlay Simulation */}
              <div className="scanner-overlay opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="scanner-line" />
              </div>

              {/* Viewfinder Corners */}
              <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-white/10 group-hover:border-blue-500/40 transition-colors" />
              <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-white/10 group-hover:border-blue-500/40 transition-colors" />
              <div className="absolute bottom-6 left-6 w-4 h-4 border-b border-l border-white/10 group-hover:border-blue-500/40 transition-colors" />
              <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-white/10 group-hover:border-blue-500/40 transition-colors" />

              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative">
                <benefit.icon className="w-7 h-7 text-blue-400" />
                {/* Focal Crosshair */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity">
                   <div className="absolute top-1/2 left-0 right-0 h-px bg-white" />
                   <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white" />
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-xl font-bold text-white uppercase tracking-tight font-playfair italic">
                   {benefit.title}
                 </h3>
                 <span className="text-[9px] font-mono text-slate-700">TAG_0{i+1}</span>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed mb-12 min-h-[60px] font-light italic opacity-80">
                {benefit.description}
              </p>

              <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{benefit.tag}</span>
                  <div className="text-2xl font-black text-white font-mono mt-1 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">{benefit.metric}</div>
                </div>
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-blue-500/40 transition-all">
                  <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:animate-ping" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
