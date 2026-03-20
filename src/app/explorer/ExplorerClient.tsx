"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import { GlowButton } from "@/components/ui/GlowButton";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { SubHero } from "@/components/ui/SubHero";
import { cn } from "@/lib/utils";

const HybridExplorer = dynamic(() => import("@/components/HybridExplorer"), {
  ssr: false,
});

const ModelComparison = dynamic(() => import("@/components/ModelComparison"), {
  ssr: false,
});

export default function ExplorerClient() {
  const [view, setView] = useState<"dive" | "compare">("dive");

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-blue-500/30">
      <Header />
      
      <SubHero 
        badge="Advanced Multi-Model Explorer"
        title="HOPE Hybrid"
        gradientTitle="Cycle Explorer"
        description="Deep-dive simulation suite for isothermal engine optimization. Compare multiple configurations in real-time."
      />

      <SectionWrapper className="pt-0 pb-32">
        <div className="container px-4">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
            <div className="bg-[#030712]/50 border border-white/5 p-1 rounded-xl flex gap-1 backdrop-blur-md">
              <button 
                onClick={() => setView("dive")}
                className={cn(
                  "px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  view === "dive" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:text-white"
                )}
              >
                Deep Dive
              </button>
              <button 
                onClick={() => setView("compare")}
                className={cn(
                  "px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  view === "compare" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:text-white"
                )}
              >
                Comparison
              </button>
            </div>
            
            <GlowButton onClick={() => window.open('mailto:contact@ajaypalta.com')} className="h-[46px] text-xs uppercase tracking-widest font-black">
              Request Full Evaluation
            </GlowButton>
          </div>
          
          <div className="glass rounded-3xl p-4 md:p-8 border border-white/5 relative overflow-hidden bg-[#030712]/50 backdrop-blur-xl">
             {/* Background glow decoration */}
             <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none" />
             
             <div className="relative z-10">
               {view === "dive" ? <HybridExplorer /> : <ModelComparison />}
             </div>
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </main>
  );
}
