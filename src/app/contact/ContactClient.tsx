"use client";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SubHero } from "@/components/ui/SubHero";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { Mail, Linkedin, ArrowUpRight } from "lucide-react";

export default function ContactClient() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-blue-500/30">
      <Header />
      
      <SubHero 
        badge="Global Network"
        title="Connect with the"
        gradientTitle="Future"
        description="Have questions about the HOPE cycle or interested in collaboration? We're here to help you explore the future of thermodynamics."
      />

      <SectionWrapper className="pt-0 pb-32">
        <div className="container px-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto relative">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

            <GlassCard className="p-8 border-white/5 bg-[#030712]/50 backdrop-blur-xl hover:bg-white/[0.03] transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Email Inquiry</h3>
              <p className="text-slate-500 mb-6 text-sm font-light italic opacity-80">Direct research or business inquiries.</p>
              <a href="mailto:contact@ajaypalta.com" className="text-blue-400 font-bold hover:text-blue-300 transition-colors flex items-center gap-2">
                contact@ajaypalta.com
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </GlassCard>

            <GlassCard className="p-8 border-white/5 bg-[#030712]/50 backdrop-blur-xl hover:bg-white/[0.03] transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Linkedin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Professional Network</h3>
              <p className="text-slate-500 mb-6 text-sm">Connect on LinkedIn for updates.</p>
              <a href="https://linkedin.com/in/ajaypalta" target="_blank" rel="noopener noreferrer" className="text-blue-400 font-bold hover:text-blue-300 transition-colors flex items-center gap-2">
                Visit Profile
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </GlassCard>
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </main>
  );
}
