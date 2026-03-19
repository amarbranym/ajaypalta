"use client";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SubHero } from "@/components/ui/SubHero";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { Info, Target, History } from "lucide-react";

export default function AboutClient() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-blue-500/30">
      <Header />
      
      <SubHero 
        badge="Hydro Oxy Palta Engine"
        title="Theoretical Excellence,"
        gradientTitle="First Principles"
        description="Bridging the gap between thermodynamic theory and net-zero reality through fundamental engine redesign."
      />

      <SectionWrapper className="pt-0 pb-32">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-6xl mx-auto relative">
            <div className="md:col-span-12">
              <GlassCard className="p-8 md:p-12 border-white/5 bg-white/[0.01]">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                    <Info className="w-6 h-6" />
                  </div>
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">The Vision</h2>
                    <div className="space-y-4 text-lg text-slate-400 leading-relaxed">
                      <p>
                        This project represents a decade of research into isothermal compression and high-efficiency thermodynamic cycles. The HOPE cycle isn't just an incremental improvement; it's a fundamental shift in how we handle waste heat.
                      </p>
                      <p>
                        By integrating water injection precisely where entropy normally climbs, we anchor the cycle to more efficient pathways, enabling compression ratios and temperature caps previously thought unachievable in practical reciprocating engines.
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            <div className="md:col-span-6">
              <GlassCard className="p-8 border-white/5 bg-white/[0.01] h-full hover:shadow-blue-500/10 transition-shadow">
                <Target className="w-8 h-8 text-violet-400 mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">The Goal</h3>
                <p className="text-slate-400 leading-relaxed">
                  Our objective is to double the thermal efficiency of current internal combustion systems while maintaining the energy density and reliability of liquid fuels.
                </p>
              </GlassCard>
            </div>

            <div className="md:col-span-6">
              <GlassCard className="p-8 border-white/5 bg-white/[0.01] h-full hover:shadow-blue-500/10 transition-shadow">
                <History className="w-8 h-8 text-blue-400 mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">The Philosophy</h3>
                <p className="text-slate-400 leading-relaxed" >
                  Innovation must be grounded in the first principles of thermodynamics. We don't fight physics; we optimize implementation to match theoretical perfection.
                </p>
              </GlassCard>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </main>
  );
}
