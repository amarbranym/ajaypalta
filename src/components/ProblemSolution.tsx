"use client";
import React from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "./ui/SectionWrapper";
import { GlassCard } from "./ui/GlassCard";
import { Trash2, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

const PROBLEM_ITEMS = [
  { icon: Trash2, text: "Engines waste 30-40% of energy as heat" },
  { icon: AlertTriangle, text: "Cooling systems dump 35% of energy" },
  { icon: TrendingUp, text: "Exhaust gases waste another 30%" },
  { icon: AlertTriangle, text: "High compression blocked by heat & knock" },
];

const SOLUTION_ITEMS = [
  { icon: CheckCircle2, text: "Water absorbs heat -> prevents knock" },
  { icon: CheckCircle2, text: "Isothermal compression -> less work" },
  { icon: CheckCircle2, text: "Steam joins expansion -> more work" },
  { icon: CheckCircle2, text: "90% of water condensed & recycled" },
];

export default function ProblemSolution() {
  return (
    <SectionWrapper className="bg-black/50">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">The Challenge vs <span className="text-gradient">The Solution</span></h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Traditional combustion engines are fundamentally inefficient. The HOPE cycle flips the logic by turning waste heat into productive power.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Problem Card */}
        <GlassCard className="border-red-500/10 bg-red-500/[0.02]">
          <h3 className="text-2xl font-bold text-red-500 mb-8 flex items-center gap-2">
            The Problem
          </h3>
          <div className="space-y-6">
            {PROBLEM_ITEMS.map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <item.icon className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                <p className="text-slate-300 font-medium">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Solution Card */}
        <GlassCard className="border-blue-500/10 bg-blue-500/[0.02]">
          <h3 className="text-2xl font-bold text-blue-400 mb-8 flex items-center gap-2">
            The HOPE Solution
          </h3>
          <div className="space-y-6">
            {SOLUTION_ITEMS.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <item.icon className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
                <p className="text-slate-300 font-medium">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </SectionWrapper>
  );
}
