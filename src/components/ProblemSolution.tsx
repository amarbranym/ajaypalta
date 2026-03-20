"use client";
import React from "react";
import { motion } from "framer-motion";
import { Trash2, TrendingUp, AlertTriangle, CheckCircle2, Factory, Thermometer, Wind, Zap as ZapIcon } from "lucide-react";

const PROBLEM_ITEMS = [
  { icon: Factory, text: "Traditional engines waste 30-40% of energy as heat" },
  { icon: Thermometer, text: "Radiators dump 35% of peak energy to the environment" },
  { icon: Wind, text: "Exhaust gases carry away another 30% of useable power" },
  { icon: AlertTriangle, text: "High compression is blocked by thermal knock limits" },
];

const SOLUTION_ITEMS = [
  { icon: CheckCircle2, text: "Water injection absorbs heat to prevent engine knock" },
  { icon: ZapIcon, text: "Isothermal compression reduces parasite work load" },
  { icon: TrendingUp, text: "Exhaust steam joins expansion for massive torque" },
  { icon: CheckCircle2, text: "Advanced condenser recycles 90% of working fluid" },
];

export default function ProblemSolution() {
  return (
    <section className="py-32 bg-slate-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6"
          >
            Efficiency Analysis
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tighter uppercase">
            The Thermodynamic <span className="text-gradient">Paradox</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Standard internal combustion engines are built on a compromise. We turn it into a <span className="text-white font-bold">competitive advantage.</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 relative">
          {/* Connector Line (Desktop Only) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-px bg-gradient-to-r from-red-500/20 via-slate-500/40 to-blue-500/20 hidden lg:block" />

          {/* Problem Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="p-10 rounded-[40px] glass border border-red-500/10 bg-gradient-to-br from-red-500/[0.03] to-transparent h-full relative overflow-hidden group">
              {/* Grid Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ef444405_1px,transparent_1px),linear-gradient(to_bottom,#ef444405_1px,transparent_1px)] bg-[size:30px_30px]" />
              
              <h3 className="text-3xl font-black text-red-500 mb-10 flex items-center gap-4 uppercase tracking-tighter relative z-10">
                <AlertTriangle className="w-8 h-8" />
                The Problem
              </h3>
              
              <div className="space-y-4 relative z-10">
                {PROBLEM_ITEMS.map((item, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-5 p-5 rounded-2xl bg-slate-900/50 border border-white/5 group-hover:border-red-500/20 transition-all duration-500"
                  >
                    <div className="p-3 rounded-xl bg-red-500/10 text-red-400">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <p className="text-slate-400 font-bold text-sm tracking-tight">{item.text}</p>
                  </div>
                ))}
              </div>

              {/* Decorative Accent */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-500/5 blur-[60px] rounded-full" />
            </div>
          </motion.div>

          {/* Solution Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="p-10 rounded-[40px] glass border border-blue-500/10 bg-gradient-to-br from-blue-500/[0.03] to-transparent h-full relative overflow-hidden group">
              {/* Grid Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f605_1px,transparent_1px),linear-gradient(to_bottom,#3b82f605_1px,transparent_1px)] bg-[size:30px_30px]" />

              <h3 className="text-3xl font-black text-blue-400 mb-10 flex items-center gap-4 uppercase tracking-tighter relative z-10">
                <CheckCircle2 className="w-8 h-8" />
                The Solution
              </h3>
              
              <div className="space-y-4 relative z-10">
                {SOLUTION_ITEMS.map((item, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-5 p-5 rounded-2xl bg-slate-900/50 border border-white/5 group-hover:border-blue-500/20 transition-all duration-500"
                  >
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <p className="text-slate-400 font-bold text-sm tracking-tight">{item.text}</p>
                  </div>
                ))}
              </div>

              {/* Decorative Accent */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/5 blur-[60px] rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
