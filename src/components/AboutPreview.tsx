"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { GlassCard } from "./ui/GlassCard";
import { SectionWrapper } from "./ui/SectionWrapper";

export default function AboutPreview() {
  return (
    <SectionWrapper className="bg-black/30">
      <div className="container px-4">
        <GlassCard className="max-w-5xl mx-auto p-8 md:p-16 border-white/5 bg-white/[0.01] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
                Our Mission
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
                Engineering <span className="text-gradient">Innovation</span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed mb-8">
                The HOPE engine cycle represents a significant departure from conventional internal 
                combustion, offering a path to dramatically higher efficiency and lower thermal 
                stress by fundamentally changing how we manage heat within the cycle.
              </p>
              <Link 
                href="/about" 
                className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors group"
              >
                Read Technical Philosophy
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-linear-to-br from-blue-500/20 to-violet-600/20 border border-white/10 flex items-center justify-center p-12">
                <Info className="w-full h-full text-blue-400/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-black text-white mb-2 tracking-tighter">10+</div>
                    <div className="text-blue-400 font-bold uppercase tracking-widest text-[10px]">Years Research</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </SectionWrapper>
  );
}
