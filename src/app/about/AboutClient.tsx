"use client";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SubHero } from "@/components/ui/SubHero";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { Info, Target, History, Award, Shield, Cpu, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AboutClient() {
  return (
    <main className="min-h-screen bg-[#020617] text-white flex flex-col font-sans selection:bg-blue-500/30">
      <Header />
      
      <SubHero 
        badge="Evolutionary Engineering"
        title="Theoretical Excellence,"
        gradientTitle="First Principles"
        description="Bridging the gap between thermodynamic theory and net-zero reality through fundamental engine redesign."
      />

      <SectionWrapper className="pt-0 pb-32">
        <div className="container px-6">
          <div className="max-w-6xl mx-auto space-y-32">
            
            {/* Section 1: The Vision & Strategy */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              <div className="lg:col-span-5 space-y-8">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/10 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-black tracking-[0.3em] text-blue-400 uppercase">VISION_STRATEGY::v2.1</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tight font-playfair italic leading-[1.1]">
                  The Future of <br />
                  <span className="text-blue-500">Thermal Reclamation</span>
                </h2>
                <p className="text-slate-400 text-lg font-light leading-relaxed italic border-l-2 border-blue-500/20 pl-6">
                  "The HOPE cycle isn't just an incremental improvement; it's a fundamental shift in how we handle waste heat across the global energy landscape."
                </p>
              </div>
              <div className="lg:col-span-1" />
              <div className="lg:col-span-6 space-y-8 text-slate-400 leading-relaxed font-light">
                <p>
                  This project represents a decade of research into isothermal compression and high-efficiency thermodynamic cycles. By integrating water injection precisely where entropy normally climbs, we anchor the cycle to more efficient pathways.
                </p>
                <p>
                  Our research enables compression ratios and temperature caps previously thought unachievable in practical reciprocating engines. We don't just fight physics; we optimize implementation to match theoretical perfection.
                </p>
                    <div className="p-4 rounded-2xl bg-[#030712]/50 border border-white/5 backdrop-blur-xl">
                      <div className="text-2xl font-black text-white mb-1">10+</div>
                      <div className="text-[9px] uppercase tracking-widest text-slate-500">Years Research</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#030712]/50 border border-white/5 backdrop-blur-xl">
                      <div className="text-2xl font-black text-white mb-1">PATENTED</div>
                      <div className="text-[9px] uppercase tracking-widest text-slate-500">Cycle Logic</div>
                    </div>
              </div>
            </div>

            {/* Section 2: Core Technological Matrix */}
            <div className="space-y-12">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="text-[10px] font-black tracking-[0.5em] text-blue-500 uppercase">TECHNICAL_MATRIX</div>
                <h2 className="text-3xl font-black font-playfair italic">Operational Foundations</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: Target, title: "The Goal", text: "Double thermal efficiency while maintaining energy density and reliability of traditional systems.", color: "text-blue-400", code: "REF_TAR::2.0x" },
                  { icon: History, title: "Philosophy", text: "Ground innovation in first principles. Matching implementation to theoretical thermodynamic perfection.", color: "text-violet-400", code: "LOG_ARCH::PRIM" },
                  { icon: Shield, title: "Reliability", text: "Engineered for longevity, ensuring that reclamation doesn't compromise structural integrity.", color: "text-emerald-400", code: "SYS_INT::HIGH" }
                ].map((item, i) => (
                  <GlassCard key={i} className="p-10 border-white/5 bg-[#030712]/50 backdrop-blur-xl hover:bg-white/[0.03] transition-all group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                      <span className="text-[8px] font-mono tracking-widest uppercase">{item.code}</span>
                    </div>
                    <div className="relative mb-8 w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform blueprint-grid">
                      <div className="absolute inset-0 bg-blue-500/5 blur-xl group-hover:bg-blue-500/10 transition-colors" />
                      <item.icon className={cn("w-8 h-8 relative z-10", item.color)} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tighter">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed font-light text-sm italic opacity-80">{item.text}</p>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Section 3: Engineering Lead */}
            <GlassCard className="p-12 md:p-20 border-white/5 bg-gradient-to-br from-[#030712]/80 to-transparent backdrop-blur-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[100px] -translate-y-1/2 translate-x-1/2" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-violet-500/5 border border-violet-500/10">
                    <Award className="w-4 h-4 text-violet-400" />
                    <span className="text-[10px] font-black tracking-[0.3em] text-violet-400 uppercase">LEAD_INGENIEUR</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black font-playfair italic">Ajay Palta</h2>
                  <div className="space-y-6 text-slate-400 leading-relaxed font-light italic">
                    <p>
                      A pioneer in high-efficiency thermodynamic cycles, Ajay has dedicated his career to solving the "Heat Problem" in internal combustion and industrial power generation.
                    </p>
                    <p>
                      With a deep focus on Isothermal Compression and Water-Assisted Expansion, his work has redefined the boundaries of what is achievable in sustainable engine architecture.
                    </p>
                    <p>
                      The HOPE cycle represents the culmination of this journey—a bridge between legendary engineering principles and a net-zero future.
                    </p>
                  </div>
                </div>
                <div className="relative aspect-square max-w-sm mx-auto lg:ml-auto group/profile">
                   <div className="absolute inset-0 border border-blue-500/10 rounded-3xl rotate-6 scale-95 group-hover/profile:rotate-12 transition-transform duration-700" />
                   <div className="absolute inset-0 border border-violet-500/10 rounded-3xl -rotate-3 scale-105 group-hover/profile:-rotate-6 transition-transform duration-700" />
                   <div className="relative h-full w-full rounded-2xl bg-[#030712]/50 border border-white/5 backdrop-blur-xl flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 blueprint-grid opacity-10" />
                      <div className="text-slate-800 text-[120px] font-black opacity-5 select-none transition-all duration-700 group-hover/profile:scale-110 group-hover/profile:opacity-10">AP</div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-linear-to-b from-transparent to-[#020617]/90">
                         <motion.div 
                           animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                           transition={{ duration: 10, repeat: Infinity }}
                           className="relative"
                         >
                           <div className="absolute inset-0 bg-blue-500/20 blur-3xl" />
                           <Cpu className="w-16 h-16 text-blue-400 relative z-10 opacity-40 group-hover/profile:opacity-100 transition-opacity" />
                         </motion.div>
                         <div className="mt-8 space-y-2">
                           <div className="text-[10px] font-black tracking-[0.5em] text-blue-400 uppercase">CORE_ARCHITECT_LOG</div>
                           <div className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">ID_REF::AJAY_P_B92</div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </GlassCard>

          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </main>
  );
}
