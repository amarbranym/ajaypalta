"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Factory, 
  Thermometer, 
  Wind, 
  Zap, 
  Flame, 
  Droplets,
  ArrowRight,
  Activity
} from "lucide-react";

const PROBLEM_ITEMS = [
  { icon: Factory, text: "Traditional engines waste 30-40% of energy as pure radiator heat", label: "THERMAL_LOSS_01", sensor: "T_RAD_76" },
  { icon: Flame, text: "Peak combustion temps force early exhaust to prevent melting", label: "EXH_WASTE_02", sensor: "T_CYL_MAX" },
  { icon: Wind, text: "High-speed flow carries 30% of energy out the tailpipe", label: "KIN_LOSS_03", sensor: "P_EXH_V" },
  { icon: AlertTriangle, text: "Extreme compression is limited by uncontrolled thermal knock", label: "CR_LIMIT_04", sensor: "K_DETECT" },
];

const SOLUTION_ITEMS = [
  { icon: Droplets, text: "Precision water injection absorbs latent heat mid-cycle", label: "ISOTHM_CTRL_01", sensor: "FLOW_W_CTRL" },
  { icon: Zap, text: "Waste heat is recycled into high-pressure steam for work", label: "RECOVERY_02", sensor: "P_STM_GEN" },
  { icon: CheckCircle2, text: "Enhanced volume expansion captures every joule of pressure", label: "MAX_TORQUE_03", sensor: "T_OUT_READ" },
  { icon: CheckCircle2, text: "Closed-loop condenser reclaims 95% of working fluid", label: "RECYCLE_04", sensor: "C_RECLAIM" },
];

export default function ProblemSolution() {
  return (
    <section className="relative py-48 bg-[#020617] overflow-hidden blueprint-grid">
      {/* Background Atmosphere */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[160px]" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[160px]" />

      <div className="container relative z-10 px-6">
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-premium mb-10 border-white/20"
          >
            <Activity className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Inefficiency Analysis Engine</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-8 text-white tracking-tight leading-[1.1] font-playfair italic max-w-3xl mx-auto">
            The Thermodynamic <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-blue-500">
              Paradox
            </span>
          </h2>
          
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed mb-16 italic opacity-80">
            Traditional internal combustion is a century-old compromise. We solve the fundamental efficiency leak at the core of human transportation.
            We transition from <span className="text-red-400 font-bold px-1">Heat Management</span> to 
            <span className="text-blue-400 font-bold px-1">Energy Reclamation</span>.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-px bg-white/5 rounded-[60px] overflow-hidden border border-white/10 shadow-2xl relative">
          {/* Central Vertical Rift */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent hidden lg:block -translate-x-1/2 z-20" />
          
          {/* Blueprint Labels */}
          <div className="absolute top-6 left-10 blueprint-marker italic">REF_LOSS_04.A</div>
          <div className="absolute top-6 right-10 blueprint-marker italic">REF_GAIN_04.B</div>

          {/* Problem Side */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-12 md:p-20 relative bg-gradient-to-br from-red-500/[0.02] to-transparent group"
          >
             {/* Scanner Overlay Simulation */}
            <div className="scanner-overlay opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="scanner-line h-px bg-red-500/10" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-16">
                <div className="relative">
                   <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                     <Flame className="w-8 h-8 text-red-500" />
                   </div>
                   <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-black border border-red-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                   </div>
                </div>
                <div className="flex flex-col">
                   <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Heat Loss Paradox
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light italic">
                    Up to 70% of potential energy is discarded as waste heat before it ever reaches the drivetrain.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                {PROBLEM_ITEMS.map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col gap-2 group/item"
                  >
                    <div className="flex items-center gap-6 p-6 rounded-[32px] glass-premium hover:border-red-500/20 transition-all duration-500 group-hover:translate-x-2">
                       <div className="p-3 rounded-xl bg-red-500/5 text-red-400/50 group-hover/item:text-red-400 transition-colors">
                          <item.icon className="w-5 h-5" />
                       </div>
                       <p className="text-lg text-slate-400 font-light leading-snug group-hover/item:text-white transition-colors">{item.text}</p>
                    </div>
                    <div className="ml-24 flex items-center gap-4">
                       <div className="blueprint-marker scale-75 origin-left opacity-0 group-hover/item:opacity-100 transition-opacity">
                         FLAG::{item.label}
                       </div>
                       <div className="telemetry-text text-[7px] opacity-0 group-hover/item:opacity-40 transition-opacity">
                          SENSOR_LOG::{item.sensor}
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Solution Side */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-12 md:p-20 relative bg-[#020617] group"
          >
             {/* Scanner Overlay Simulation */}
            <div className="scanner-overlay opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="scanner-line h-px bg-blue-500/10" />
            </div>

             <div className="relative z-10">
              <div className="flex items-center gap-6 mb-16">
                 <div className="relative">
                   <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                     <Zap className="w-8 h-8 text-blue-400" />
                   </div>
                   <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-black border border-blue-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                   </div>
                 </div>
                <div className="flex flex-col">
                   <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    The HOPE Solution
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-light italic">
                    Our dual-stage cycle captures and re-injects thermal energy, shattering traditional efficiency ceilings.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                {SOLUTION_ITEMS.map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col gap-2 group/item"
                  >
                    <div className="flex items-center gap-6 p-6 rounded-[32px] glass-premium hover:border-blue-500/30 transition-all duration-500 group-hover:translate-x-2 bg-blue-500/[0.01]">
                       <div className="p-3 rounded-xl bg-blue-500/5 text-blue-400/50 group-hover/item:text-blue-400 transition-colors">
                          <item.icon className="w-5 h-5" />
                       </div>
                       <p className="text-lg text-slate-300 font-light leading-snug group-hover/item:text-white transition-colors">{item.text}</p>
                    </div>
                    <div className="ml-24 flex items-center gap-4">
                       <div className="blueprint-marker scale-75 origin-left opacity-0 group-hover/item:opacity-100 transition-opacity">
                         FLAG::{item.label}
                       </div>
                       <div className="telemetry-text text-[7px] opacity-0 group-hover/item:opacity-40 transition-opacity">
                          SENSOR_LOG::{item.sensor}
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Metadata Bar */}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="mt-20 pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-6"
        >
           <div className="flex items-center gap-10">
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">SIM_KERNEL</span>
                 <span className="text-[10px] font-mono text-slate-400">v1.2.9_STABLE</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">CALC_PRECISION</span>
                 <span className="text-[10px] font-mono text-slate-400">FLOAT64_NATIVE</span>
              </div>
           </div>
           
           <button className="group inline-flex items-center gap-4 text-blue-400 font-bold uppercase tracking-[0.3em] text-[10px] hover:text-white transition-all duration-300 bg-white/5 px-6 py-3 rounded-full border border-white/10">
            Export Technical Data
            <ArrowRight className="w-4 h-4 group-hover:translate-x-4 transition-transform duration-500" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
