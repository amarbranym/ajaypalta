"use client";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SubHero } from "@/components/ui/SubHero";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { HelpCircle, Cpu, Zap, ShieldCheck } from "lucide-react";

const FAQ_ITEMS = [
  {
    icon: HelpCircle,
    question: "What is the HOPE engine cycle?",
    answer: "The HOPE (High-efficiency, Optimized-pressure Expansion) cycle is a patented thermodynamic process that integrates water injection for nearly isothermal compression and steam-assisted expansion."
  },
  {
    icon: Zap,
    question: "What are the primary efficiency gains?",
    answer: "Gain comes from reducing the work of compression (via cooling) and increasing the work of expansion (via steam generation), while recycling waste heat from the exhaust."
  },
  {
    icon: Cpu,
    question: "Is it compatible with current engine blocks?",
    answer: "The HOPE cycle requires specific head and injection modifications, but the core reciprocating architecture remains compatible with high-volume manufacturing processes."
  },
  {
    icon: ShieldCheck,
    question: "How does it prevent engine knock?",
    answer: "By injecting water during the compression stroke, we strictly control the temperature rise, preventing the auto-ignition (knock) that limits high-compression efficiency in traditional engines."
  }
];

export default function FAQClient() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-blue-500/30">
      <Header />
      
      <SubHero 
        badge="Technical Reference"
        title="Technical FAQ /"
        gradientTitle="Deep Dive"
        description="Detailed insights into the thermodynamics, mechanics, and implementation of the HOPE cycle innovation."
      />

      <SectionWrapper className="pt-0 pb-32">
        <div className="container px-4">

          <div className="max-w-4xl mx-auto space-y-6 relative">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />

            {FAQ_ITEMS.map((item, i) => (
              <GlassCard key={i} className="p-8 border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.question}</h3>
                    <p className="text-slate-400 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </main>
  );
}
