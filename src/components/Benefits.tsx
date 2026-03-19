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
    <SectionWrapper className="bg-linear-to-b from-transparent to-blue-900/5">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Core <span className="text-gradient">Benefits</span></h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          The HOPE cycle isn't just an improvement—it's a paradigm shift in how we generate mechanical power.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BENEFITS.map((benefit, i) => (
          <GlassCard key={i} delay={i * 0.1} className="hover:bg-white/[0.04]">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
              <benefit.icon className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">{benefit.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{benefit.desc}</p>
          </GlassCard>
        ))}
      </div>
    </SectionWrapper>
  );
}
