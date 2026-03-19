"use client";
import React from "react";
import { SectionWrapper } from "./ui/SectionWrapper";
import { GlassCard } from "./ui/GlassCard";
import { motion } from "framer-motion";
import { Cpu, Zap, Thermometer, Droplets } from "lucide-react";

const STEPS = [
  {
    icon: Droplets,
    title: "Step 1: Compression",
    desc: "Water droplets flash into steam, flattening the P–T curve and absorbing compression heat.",
  },
  {
    icon: Thermometer,
    title: "Step 2: Cap",
    desc: "Peak pressure and temperature are precisely controlled at Top Dead Center (TDC).",
  },
  {
    icon: Zap,
    title: "Step 3: Expansion",
    desc: "Steam-rich expansion holds pressure longer, adding significant work to the cycle.",
  },
  {
    icon: Cpu,
    title: "Step 4: Recycle",
    desc: "Exhaust is cool enough (~400K) to condense and recycle over 90% of the water used.",
  },
];

export default function HowItWorks() {
  return (
    <SectionWrapper id="how-it-works">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">How It <span className="text-gradient">Works</span></h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          A four-step thermodynamic revolution that doubles engine efficiency through intelligent heat management.
        </p>
      </div>

      <div className="relative">
        {/* Connector Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-500/10 hidden lg:block -translate-y-1/2" />
        
        <div className="grid lg:grid-cols-4 gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <GlassCard className="h-full hover:border-blue-500/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                  <step.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                
                {/* Step Number Dot */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-900/40">
                  {i + 1}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
