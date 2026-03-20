"use client";
import React from "react";
import { SectionWrapper } from "./ui/SectionWrapper";
import { GlassCard } from "./ui/GlassCard";
import { motion } from "framer-motion";
import { BarChart3, ShieldCheck, ThermometerSnowflake, Droplets, Leaf, Cog } from "lucide-react";

const BENEFITS = [
  {
    icon: BarChart3,
    title: "Double Efficiency",
    desc: "Achieve thermodynamic efficiency up to 70-85%, nearly double traditional internal combustion engines.",
  },
  {
    icon: ThermometerSnowflake,
    title: "Temperature Capping",
    desc: "Control peak temperatures at TDC, preventing engine knock and allowing for higher compression ratios.",
  },
  {
    icon: Droplets,
    title: "Water Recycling",
    desc: "Innovative condenser technology allows for over 90% water recovery from exhaust gases.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable & Stable",
    desc: "Reduced thermal stress and intelligent pressure management lead to longer engine life and stability.",
  },
  {
    icon: Leaf,
    title: "Sustainable Power",
    desc: "Lower fuel consumption and optimized combustion significantly reduce environmental impact.",
  },
  {
    icon: Cog,
    title: "Plug-and-Play",
    desc: "Designed to integrate with existing infrastructure while delivering next-gen performance.",
  },
];

export default function Benefits() {
  return (
    <SectionWrapper className="bg-slate-950 relative overflow-hidden py-32">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent_70%)] pointer-events-none" />

      <div className="text-center mb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6"
        >
          Performance Metrics
        </motion.div>
        <h2 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tighter uppercase">
          Core <span className="text-gradient">Advantages</span>
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
          The HOPE cycle isn't just an improvement—it's a paradigm shift in how we generate mechanical power, pushing the limits of modern thermodynamics.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {BENEFITS.map((benefit, i) => (
          <GlassCard key={i} delay={i * 0.05} className="group p-8 rounded-[32px] border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all duration-500 overflow-hidden relative">
            {/* Subtle Gradient Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-colors" />
            
            <div className="w-16 h-16 rounded-[20px] bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all duration-500">
              <benefit.icon className="w-8 h-8 text-blue-400" />
            </div>
            
            <h3 className="text-2xl font-black mb-4 text-white uppercase tracking-tight">{benefit.title}</h3>
            <p className="text-slate-500 text-base leading-relaxed">{benefit.desc}</p>
          </GlassCard>
        ))}
      </div>
    </SectionWrapper>
  );
}
